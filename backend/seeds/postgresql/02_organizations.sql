-- Seed data for organizations table

INSERT INTO organizations (id, name, logo, industry, size, billing_email, billing_address)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Acme Corporation', 'https://example.com/logos/acme.png', 'Technology', 'Medium', 'billing@acme.com', '{"street": "123 Main St", "city": "San Francisco", "state": "CA", "postalCode": "94105", "country": "USA"}'),
  ('00000000-0000-0000-0000-000000000002', 'Global News Network', 'https://example.com/logos/gnn.png', 'Media', 'Large', 'finance@gnn.com', '{"street": "456 Market St", "city": "New York", "state": "NY", "postalCode": "10001", "country": "USA"}'),
  ('00000000-0000-0000-0000-000000000003', 'Startup Innovators', 'https://example.com/logos/startup.png', 'Technology', 'Small', 'admin@startup.io', '{"street": "789 Venture Ave", "city": "Austin", "state": "TX", "postalCode": "73301", "country": "USA"}');

-- Seed data for organization_subscriptions table

INSERT INTO organization_subscriptions (id, organization_id, plan_id, status, seats_total, seats_used, start_date, renewal_date, auto_renew, billing_cycle)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'active', 10, 5, '2025-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z', true, 'yearly'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'active', 50, 42, '2025-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z', true, 'yearly'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'active', 5, 3, '2025-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z', true, 'yearly');

-- Seed data for organization_members table

INSERT INTO organization_members (id, organization_id, user_id, role, joined_at, invited_by)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'admin', '2025-01-01T00:00:00.000Z', NULL),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'member', '2025-01-02T00:00:00.000Z', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'admin', '2025-01-01T00:00:00.000Z', NULL),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'admin', '2025-01-01T00:00:00.000Z', NULL);

-- Seed data for organization_invitations table

INSERT INTO organization_invitations (id, organization_id, email, role, invited_by, token, expires_at, status)
VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'newuser@example.com', 'member', '00000000-0000-0000-0000-000000000001', 'invite-token-123456', '2025-06-01T00:00:00.000Z', 'pending'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'editor@example.com', 'admin', '00000000-0000-0000-0000-000000000001', 'invite-token-789012', '2025-06-01T00:00:00.000Z', 'pending');

