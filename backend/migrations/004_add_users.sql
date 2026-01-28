-- Migration 004: Users table for authentication
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- Insert default admin user
-- Password: admin (hashed with bcrypt)
INSERT INTO users (name, email, password, role) VALUES 
('Admin', 'admin@admin.com', '$2b$10$rQZ5YJZKZJZKZJZKZJZKZOqX5YJZKZJZKZJZKZJZKZJZKZJZKZJZa', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Note: Password hash will be generated properly by bcrypt in the application
-- The hash above is a placeholder. Real hash will be created via API.
