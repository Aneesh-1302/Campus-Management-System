USE campus_db;

-- USERS

INSERT INTO users (name, email, password_hash, designation)
VALUES 
(
  'System Admin',
  'admin@test.com',
  '$2b$10$6eCAi6py4b31pxTjMi3gsOLZZ8Ns90FdRobRKQ6J8mqZss25YDSJK',
  'admin'
),
(
  'Event Organizer',
  'organizer@test.com',
  '$2b$10$tQsRG0lrQUDIPWwi05DsEe9YnLrWLK8Om1L9L6iViOIWx7fZ9WTTi',
  'organizer'
),
(
  'Test Participant',
  'participant@test.com',
  '$2b$10$d6oSlyQ/ctpwCFmcSVRWAuCt5uzlUI1V2Kf2I4885Z9TjWjSTtjIW'
  'participant'
);

-- RESOURCES

INSERT INTO resources (name, type, capacity)
VALUES
('Main Auditorium', 'hall', 300),
('Conference Room A', 'room', 50);
