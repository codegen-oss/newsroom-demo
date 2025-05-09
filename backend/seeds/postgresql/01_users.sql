-- Seed data for users table

INSERT INTO users (id, email, password_hash, display_name, profile_image, created_at, updated_at, last_login)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@newsroom.com', '$2a$10$XgXB8OMM3QN8yCzUEVUoIeRRjJ5SJC1JGhJx1vLxK6.OuZmjXhWjm', 'Admin User', 'https://randomuser.me/api/portraits/men/1.jpg', '2025-01-01T00:00:00.000Z', '2025-01-01T00:00:00.000Z', '2025-05-01T00:00:00.000Z'),
  ('00000000-0000-0000-0000-000000000002', 'user@example.com', '$2a$10$XgXB8OMM3QN8yCzUEVUoIeRRjJ5SJC1JGhJx1vLxK6.OuZmjXhWjm', 'Regular User', 'https://randomuser.me/api/portraits/women/1.jpg', '2025-01-01T00:00:00.000Z', '2025-01-01T00:00:00.000Z', '2025-05-01T00:00:00.000Z'),
  ('00000000-0000-0000-0000-000000000003', 'free@example.com', '$2a$10$XgXB8OMM3QN8yCzUEVUoIeRRjJ5SJC1JGhJx1vLxK6.OuZmjXhWjm', 'Free User', NULL, '2025-01-01T00:00:00.000Z', '2025-01-01T00:00:00.000Z', '2025-05-01T00:00:00.000Z');

-- Seed data for subscription_plans table

INSERT INTO subscription_plans (id, name, description, price_monthly, price_yearly, features, is_active)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Free', 'Basic access with limited articles', 0.00, 0.00, '{"articles_per_day": 5, "premium_content": false, "ad_free": false}', true),
  ('00000000-0000-0000-0000-000000000002', 'Individual', 'Full access for individual users', 9.99, 99.00, '{"articles_per_day": null, "premium_content": true, "ad_free": true, "offline_reading": true}', true),
  ('00000000-0000-0000-0000-000000000003', 'Organization', 'Team access with collaboration features', 49.99, 499.00, '{"articles_per_day": null, "premium_content": true, "ad_free": true, "team_sharing": true, "api_access": true}', true);

-- Seed data for subscriptions table

INSERT INTO subscriptions (id, user_id, plan_id, status, tier, start_date, end_date, auto_renew, billing_cycle)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'active', 'organization', '2025-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z', true, 'yearly'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'active', 'individual', '2025-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z', true, 'yearly'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'active', 'free', '2025-01-01T00:00:00.000Z', '2099-12-31T23:59:59.999Z', false, NULL);

-- Seed data for payment_methods table

INSERT INTO payment_methods (id, user_id, type, provider, last_four, expiry_date, holder_name, is_default)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'credit_card', 'visa', '4242', '12/28', 'Admin User', true),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'credit_card', 'mastercard', '1234', '10/27', 'Regular User', true);

-- Seed data for billing_transactions table

INSERT INTO billing_transactions (id, user_id, subscription_id, payment_method_id, amount, currency, status, transaction_date, description)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 499.00, 'USD', 'completed', '2025-01-01T00:00:00.000Z', 'Annual subscription - Organization plan'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 99.00, 'USD', 'completed', '2025-01-01T00:00:00.000Z', 'Annual subscription - Individual plan');

