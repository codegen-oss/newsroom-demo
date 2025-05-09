/**
 * Data Migration Scripts
 * 
 * This file contains utilities for:
 * - Initial data seeding
 * - Schema migration
 * - Backup and restore procedures
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');
const mongoose = require('mongoose');
const { Pool } = require('pg');
const { redisClient } = require('../../config/redis/redis.config');

// MongoDB models
const User = require('../../models/mongodb/user.model');
const Article = require('../../models/mongodb/article.model');
const Organization = require('../../models/mongodb/organization.model');

// PostgreSQL connection
const pgPool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  database: process.env.POSTGRES_DB || 'newsroom',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres'
});

const execAsync = promisify(exec);

/**
 * Initial Data Seeding
 */
const seedData = {
  // Seed MongoDB collections
  async seedMongoDB() {
    try {
      console.log('Seeding MongoDB collections...');
      
      // Check if data already exists
      const userCount = await User.countDocuments();
      if (userCount > 0) {
        console.log('MongoDB data already exists. Skipping seed.');
        return;
      }
      
      // Seed users
      const users = require('../../../seeds/mongodb/users.seed.json');
      await User.insertMany(users);
      console.log(`Seeded ${users.length} users`);
      
      // Seed articles
      const articles = require('../../../seeds/mongodb/articles.seed.json');
      await Article.insertMany(articles);
      console.log(`Seeded ${articles.length} articles`);
      
      // Seed organizations
      const organizations = require('../../../seeds/mongodb/organizations.seed.json');
      await Organization.insertMany(organizations);
      console.log(`Seeded ${organizations.length} organizations`);
      
      console.log('MongoDB seeding completed successfully');
    } catch (error) {
      console.error('Error seeding MongoDB:', error);
      throw error;
    }
  },
  
  // Seed PostgreSQL tables
  async seedPostgreSQL() {
    try {
      console.log('Seeding PostgreSQL tables...');
      
      // Check if data already exists
      const { rows } = await pgPool.query('SELECT COUNT(*) FROM users');
      if (parseInt(rows[0].count, 10) > 0) {
        console.log('PostgreSQL data already exists. Skipping seed.');
        return;
      }
      
      // Read SQL seed files
      const seedDir = path.join(__dirname, '../../../seeds/postgresql');
      const seedFiles = fs.readdirSync(seedDir)
        .filter(file => file.endsWith('.sql'))
        .sort(); // Ensure correct order of execution
      
      // Execute each seed file
      for (const file of seedFiles) {
        const filePath = path.join(seedDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');
        await pgPool.query(sql);
        console.log(`Executed seed file: ${file}`);
      }
      
      console.log('PostgreSQL seeding completed successfully');
    } catch (error) {
      console.error('Error seeding PostgreSQL:', error);
      throw error;
    }
  },
  
  // Run all seeding operations
  async seedAll() {
    try {
      await this.seedMongoDB();
      await this.seedPostgreSQL();
      console.log('All data seeding completed successfully');
    } catch (error) {
      console.error('Error during data seeding:', error);
      throw error;
    }
  }
};

/**
 * Schema Migration Utilities
 */
const schemaMigration = {
  // MongoDB schema migration
  async migrateMongoDBSchema(version) {
    try {
      console.log(`Migrating MongoDB schema to version ${version}...`);
      
      const migrationsDir = path.join(__dirname, '../../../migrations/mongodb');
      const migrationFiles = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.js') && file.startsWith(`v${version}_`))
        .sort();
      
      if (migrationFiles.length === 0) {
        console.log(`No MongoDB migration files found for version ${version}`);
        return;
      }
      
      for (const file of migrationFiles) {
        const migration = require(path.join(migrationsDir, file));
        await migration.up();
        console.log(`Executed MongoDB migration: ${file}`);
      }
      
      console.log(`MongoDB schema migration to version ${version} completed successfully`);
    } catch (error) {
      console.error(`Error migrating MongoDB schema to version ${version}:`, error);
      throw error;
    }
  },
  
  // PostgreSQL schema migration
  async migratePostgreSQLSchema(version) {
    try {
      console.log(`Migrating PostgreSQL schema to version ${version}...`);
      
      const migrationsDir = path.join(__dirname, '../../../migrations/postgresql');
      const migrationFiles = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.sql') && file.startsWith(`v${version}_`))
        .sort();
      
      if (migrationFiles.length === 0) {
        console.log(`No PostgreSQL migration files found for version ${version}`);
        return;
      }
      
      for (const file of migrationFiles) {
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');
        await pgPool.query(sql);
        console.log(`Executed PostgreSQL migration: ${file}`);
      }
      
      console.log(`PostgreSQL schema migration to version ${version} completed successfully`);
    } catch (error) {
      console.error(`Error migrating PostgreSQL schema to version ${version}:`, error);
      throw error;
    }
  },
  
  // Run all schema migrations
  async migrateAll(version) {
    try {
      await this.migrateMongoDBSchema(version);
      await this.migratePostgreSQLSchema(version);
      console.log(`All schema migrations to version ${version} completed successfully`);
    } catch (error) {
      console.error(`Error during schema migrations to version ${version}:`, error);
      throw error;
    }
  }
};

/**
 * Backup and Restore Procedures
 */
const backupRestore = {
  // MongoDB backup
  async backupMongoDB(outputDir) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const outputPath = path.join(outputDir, `mongodb_backup_${timestamp}`);
      
      // Ensure output directory exists
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // Run mongodump
      const mongodumpCmd = `mongodump --host=${process.env.MONGO_HOST || 'localhost'} --port=${process.env.MONGO_PORT || '27017'} --db=${process.env.MONGO_DB || 'newsroom'} --out=${outputPath}`;
      
      if (process.env.MONGO_USER && process.env.MONGO_PASSWORD) {
        mongodumpCmd += ` --username=${process.env.MONGO_USER} --password=${process.env.MONGO_PASSWORD} --authenticationDatabase=admin`;
      }
      
      const { stdout, stderr } = await execAsync(mongodumpCmd);
      console.log('MongoDB backup completed:', stdout);
      
      if (stderr && !stderr.includes('done dumping')) {
        console.warn('MongoDB backup warnings:', stderr);
      }
      
      return outputPath;
    } catch (error) {
      console.error('Error backing up MongoDB:', error);
      throw error;
    }
  },
  
  // PostgreSQL backup
  async backupPostgreSQL(outputDir) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const outputFile = path.join(outputDir, `postgresql_backup_${timestamp}.sql`);
      
      // Ensure output directory exists
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // Run pg_dump
      const pgDumpCmd = `pg_dump --host=${process.env.POSTGRES_HOST || 'localhost'} --port=${process.env.POSTGRES_PORT || '5432'} --username=${process.env.POSTGRES_USER || 'postgres'} --dbname=${process.env.POSTGRES_DB || 'newsroom'} --file=${outputFile}`;
      
      // Set PGPASSWORD environment variable for authentication
      const env = { ...process.env, PGPASSWORD: process.env.POSTGRES_PASSWORD || 'postgres' };
      
      const { stdout, stderr } = await execAsync(pgDumpCmd, { env });
      console.log('PostgreSQL backup completed:', stdout || 'Success');
      
      if (stderr) {
        console.warn('PostgreSQL backup warnings:', stderr);
      }
      
      return outputFile;
    } catch (error) {
      console.error('Error backing up PostgreSQL:', error);
      throw error;
    }
  },
  
  // Redis backup
  async backupRedis(outputDir) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const outputFile = path.join(outputDir, `redis_backup_${timestamp}.rdb`);
      
      // Ensure output directory exists
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // Save Redis database
      await redisClient.save();
      
      // Copy Redis RDB file
      const redisDbPath = process.env.REDIS_DB_PATH || '/var/lib/redis/dump.rdb';
      fs.copyFileSync(redisDbPath, outputFile);
      
      console.log(`Redis backup completed: ${outputFile}`);
      return outputFile;
    } catch (error) {
      console.error('Error backing up Redis:', error);
      throw error;
    }
  },
  
  // MongoDB restore
  async restoreMongoDB(backupPath) {
    try {
      // Run mongorestore
      const mongorestoreCmd = `mongorestore --host=${process.env.MONGO_HOST || 'localhost'} --port=${process.env.MONGO_PORT || '27017'} --db=${process.env.MONGO_DB || 'newsroom'} ${backupPath}`;
      
      if (process.env.MONGO_USER && process.env.MONGO_PASSWORD) {
        mongorestoreCmd += ` --username=${process.env.MONGO_USER} --password=${process.env.MONGO_PASSWORD} --authenticationDatabase=admin`;
      }
      
      const { stdout, stderr } = await execAsync(mongorestoreCmd);
      console.log('MongoDB restore completed:', stdout);
      
      if (stderr && !stderr.includes('done')) {
        console.warn('MongoDB restore warnings:', stderr);
      }
    } catch (error) {
      console.error('Error restoring MongoDB:', error);
      throw error;
    }
  },
  
  // PostgreSQL restore
  async restorePostgreSQL(backupFile) {
    try {
      // Run psql
      const psqlCmd = `psql --host=${process.env.POSTGRES_HOST || 'localhost'} --port=${process.env.POSTGRES_PORT || '5432'} --username=${process.env.POSTGRES_USER || 'postgres'} --dbname=${process.env.POSTGRES_DB || 'newsroom'} --file=${backupFile}`;
      
      // Set PGPASSWORD environment variable for authentication
      const env = { ...process.env, PGPASSWORD: process.env.POSTGRES_PASSWORD || 'postgres' };
      
      const { stdout, stderr } = await execAsync(psqlCmd, { env });
      console.log('PostgreSQL restore completed:', stdout || 'Success');
      
      if (stderr) {
        console.warn('PostgreSQL restore warnings:', stderr);
      }
    } catch (error) {
      console.error('Error restoring PostgreSQL:', error);
      throw error;
    }
  },
  
  // Redis restore
  async restoreRedis(backupFile) {
    try {
      // Stop Redis server
      await execAsync('redis-cli shutdown');
      
      // Copy backup file to Redis DB path
      const redisDbPath = process.env.REDIS_DB_PATH || '/var/lib/redis/dump.rdb';
      fs.copyFileSync(backupFile, redisDbPath);
      
      // Start Redis server
      await execAsync('service redis-server start');
      
      console.log('Redis restore completed');
    } catch (error) {
      console.error('Error restoring Redis:', error);
      throw error;
    }
  },
  
  // Run full backup
  async backupAll(outputDir = './backups') {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupDir = path.join(outputDir, `full_backup_${timestamp}`);
      
      // Ensure backup directory exists
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      
      // Run all backups
      const mongoBackupPath = await this.backupMongoDB(backupDir);
      const pgBackupFile = await this.backupPostgreSQL(backupDir);
      const redisBackupFile = await this.backupRedis(backupDir);
      
      // Create backup manifest
      const manifest = {
        timestamp,
        mongodb: path.relative(backupDir, mongoBackupPath),
        postgresql: path.relative(backupDir, pgBackupFile),
        redis: path.relative(backupDir, redisBackupFile)
      };
      
      fs.writeFileSync(
        path.join(backupDir, 'manifest.json'),
        JSON.stringify(manifest, null, 2)
      );
      
      console.log(`Full backup completed: ${backupDir}`);
      return backupDir;
    } catch (error) {
      console.error('Error during full backup:', error);
      throw error;
    }
  },
  
  // Run full restore
  async restoreAll(backupDir) {
    try {
      // Read backup manifest
      const manifestPath = path.join(backupDir, 'manifest.json');
      if (!fs.existsSync(manifestPath)) {
        throw new Error(`Backup manifest not found: ${manifestPath}`);
      }
      
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      
      // Run all restores
      await this.restoreMongoDB(path.join(backupDir, manifest.mongodb));
      await this.restorePostgreSQL(path.join(backupDir, manifest.postgresql));
      await this.restoreRedis(path.join(backupDir, manifest.redis));
      
      console.log(`Full restore completed from: ${backupDir}`);
    } catch (error) {
      console.error('Error during full restore:', error);
      throw error;
    }
  }
};

module.exports = {
  seedData,
  schemaMigration,
  backupRestore
};

