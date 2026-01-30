USE campus_db;

-- USERS

INSERT INTO users (name, email, password_hash, designation)
VALUES 
(
  'System Admin',
  'admin@test.com',
  ' $2b$10$nhxHUeOe4Qog4FNP5ZRCee1OvXSdH50GBtx3/f9iqtR0AITD9jvpK',
  'admin'
),
(
  'Event Organizer',
  'organizer@test.com',
  '$2b$10$fkbRmA1LiIiNlltD.GtyN.a6kKs8WPLFt2cyH/JibffJxRd0pBCgO',
  'organizer'
),
(
  'Test Participant',
  'participant@test.com',
  '$2b$10$lZH5mrwEBvN1r1VIknaZDeaJRryXxW6wOjVAYjHDB2TUWLvcCzgIa',
  'participant'
);

-- RESOURCES

INSERT INTO resources (name, type, capacity)
VALUES
('Main Auditorium', 'hall', 300),
('Conference Room A', 'room', 50);
