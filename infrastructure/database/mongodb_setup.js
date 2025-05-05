// MongoDB setup for News Room application

// Connect to MongoDB
db = db.getSiblingDB('newsroom');

// Create collections
db.createCollection('articles');
db.createCollection('user_activity');
db.createCollection('analytics');
db.createCollection('notifications');

// Create indexes
db.articles.createIndex({ "published_at": -1 });
db.articles.createIndex({ "source.id": 1 });
db.articles.createIndex({ "category": 1 });
db.articles.createIndex({ "tags": 1 });
db.articles.createIndex({ 
    "title": "text", 
    "description": "text", 
    "content": "text" 
}, {
    weights: {
        title: 10,
        description: 5,
        content: 1
    },
    name: "content_search"
});

db.user_activity.createIndex({ "user_id": 1 });
db.user_activity.createIndex({ "timestamp": -1 });
db.user_activity.createIndex({ "article_id": 1 });

db.analytics.createIndex({ "timestamp": -1 });
db.analytics.createIndex({ "event_type": 1 });

db.notifications.createIndex({ "user_id": 1 });
db.notifications.createIndex({ "created_at": -1 });
db.notifications.createIndex({ "read": 1 });

// Create article schema validation
db.runCommand({
    collMod: "articles",
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["title", "source", "published_at", "url"],
            properties: {
                title: {
                    bsonType: "string",
                    description: "Title of the article"
                },
                description: {
                    bsonType: "string",
                    description: "Short description of the article"
                },
                content: {
                    bsonType: "string",
                    description: "Full content of the article"
                },
                source: {
                    bsonType: "object",
                    required: ["id", "name"],
                    properties: {
                        id: {
                            bsonType: "string",
                            description: "Source identifier"
                        },
                        name: {
                            bsonType: "string",
                            description: "Source name"
                        }
                    }
                },
                author: {
                    bsonType: "string",
                    description: "Author of the article"
                },
                url: {
                    bsonType: "string",
                    description: "URL to the original article"
                },
                url_to_image: {
                    bsonType: "string",
                    description: "URL to the article image"
                },
                published_at: {
                    bsonType: "date",
                    description: "Publication date"
                },
                category: {
                    bsonType: "string",
                    description: "Primary category of the article"
                },
                tags: {
                    bsonType: "array",
                    description: "Tags associated with the article",
                    items: {
                        bsonType: "string"
                    }
                }
            }
        }
    }
});

