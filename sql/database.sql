CREATE DATABASE IF NOT EXISTS impulsa_tlapa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE impulsa_tlapa;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('comprador','vendedor','admin') DEFAULT 'comprador',
  active TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  category_id INT NOT NULL,
  name VARCHAR(120) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image VARCHAR(255) DEFAULT '/img/product-default.svg',
  active TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

INSERT INTO categories (name) VALUES
('Ropa'),('Comida'),('Tecnología'),('Papelería'),('Artesanías'),('Servicios locales')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Usuario administrador: admin@impulsatlapa.com / admin123
INSERT INTO users (name,email,password,phone,role) VALUES
('Administradora ImpulsaTlapa','admin@impulsatlapa.com','$2a$10$VlmX7iXrTFT0g7f3Hwv3ROQBwTm99wEp0i8iD/3wHE72i7QGyE0qS','7570000000','admin')
ON DUPLICATE KEY UPDATE email=email;
