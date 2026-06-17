-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  avatar TEXT,
  address TEXT,
  city VARCHAR(255),
  country VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT,
  category VARCHAR(255),
  stock INTEGER DEFAULT 0,
  user_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Cart table
CREATE TABLE IF NOT EXISTS cart (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  product_id VARCHAR(255) NOT NULL,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  product_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE(user_id, product_id)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(255) DEFAULT 'pending',
  shipping_address JSONB,
  items JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- OTPs table
CREATE TABLE IF NOT EXISTS otps (
  id VARCHAR(255) PRIMARY KEY,
  identifier VARCHAR(255) NOT NULL,
  otp VARCHAR(10) NOT NULL,
  expires_at BIGINT NOT NULL,
  method VARCHAR(10) NOT NULL CHECK (method IN ('sms', 'email')),
  user_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample categories
INSERT INTO categories (id, name, description, image) VALUES
  ('cat-1', 'Electronics', 'Electronic devices and accessories', ''),
  ('cat-2', 'Clothing', 'Fashion and apparel', ''),
  ('cat-3', 'Home & Garden', 'Home improvement and garden supplies', '')
ON CONFLICT (id) DO NOTHING;

-- Insert sample user first
INSERT INTO users (id, name, email, phone) VALUES
  ('user-1', 'Sample User', 'sample@example.com', '+1234567890')
ON CONFLICT (id) DO NOTHING;

-- Insert sample products
INSERT INTO products (id, name, description, price, image, category, stock, user_id) VALUES
  ('prod-1', 'Wireless Headphones', 'High-quality wireless headphones with noise cancellation', 99.99, '', 'Electronics', 50, 'user-1'),
  ('prod-2', 'Smart Watch', 'Feature-rich smartwatch with health tracking', 149.99, '', 'Electronics', 30, 'user-1'),
  ('prod-3', 'T-Shirt', 'Comfortable cotton t-shirt', 19.99, '', 'Clothing', 100, 'user-1')
ON CONFLICT (id) DO NOTHING;
