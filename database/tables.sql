DROP DATABASE IF EXISTS nitebite;

CREATE DATABASE nitebite;

USE nitebite;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(25) NULL,
  lastName VARCHAR(35) NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(60) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  defaultAddress VARCHAR(300) DEFAULT NULL  
);

CREATE TABLE sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  token VARCHAR(100) NOT NULL UNIQUE,
  FOREIGN KEY (userId) REFERENCES users (id)
);

CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  placeId VARCHAR(40),
  comment VARCHAR(10000),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users (id)
);

#ALTER TABLE `nitebite`.`users` ADD COLUMN `firstName` VARCHAR(25) NULL AFTER `updatedAt`, ADD COLUMN `lastName` VARCHAR(35) NULL AFTER `firstName`;








