USE campus_db;

-- USERS
-- All passwords are: password123

INSERT INTO users (name, email, password_hash, designation)
VALUES 
(
  'System Admin',
  'admin@test.com',
  '$2b$10$rf/HSU/ntStfOuvD6BGMxOx8s5brMwaPrSjEAa28cJJ.84Jr052Dm',
  'admin'
),
(
  'Event Organizer',
  'organizer@test.com',
  '$2b$10$rf/HSU/ntStfOuvD6BGMxOx8s5brMwaPrSjEAa28cJJ.84Jr052Dm',
  'organizer'
),
(
  'Test Participant',
  'participant@test.com',
  '$2b$10$rf/HSU/ntStfOuvD6BGMxOx8s5brMwaPrSjEAa28cJJ.84Jr052Dm',
  'participant'
);

-- RESOURCES

INSERT INTO resources (name, type, capacity)
VALUES
('Main Auditorium', 'hall', 300),
('Conference Room A', 'room', 50);
