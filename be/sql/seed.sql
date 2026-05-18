-- Seed default users for testing
INSERT INTO users (name, role) 
SELECT 'Warga Budi', 'resident'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE name = 'Warga Budi');

INSERT INTO users (name, role) 
SELECT 'Pak RT Ahmad', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE name = 'Pak RT Ahmad');
