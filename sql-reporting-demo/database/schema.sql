CREATE DATABASE IF NOT EXISTS lance_reporting_demo;
USE lance_reporting_demo;

CREATE TABLE clients (
  client_id INT AUTO_INCREMENT PRIMARY KEY,
  client_name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  industry VARCHAR(80) NOT NULL,
  status ENUM('active','inactive','lead') NOT NULL DEFAULT 'lead',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
  project_id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  project_name VARCHAR(160) NOT NULL,
  project_type VARCHAR(80) NOT NULL,
  status ENUM('planning','in_progress','review','completed','on_hold') NOT NULL DEFAULT 'planning',
  progress_percent TINYINT UNSIGNED NOT NULL DEFAULT 0,
  budget DECIMAL(12,2) NOT NULL DEFAULT 0,
  due_date DATE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_projects_client FOREIGN KEY (client_id) REFERENCES clients(client_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT chk_progress CHECK (progress_percent BETWEEN 0 AND 100)
);

CREATE TABLE support_tickets (
  ticket_id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  project_id INT NULL,
  subject VARCHAR(180) NOT NULL,
  priority ENUM('low','normal','high','urgent') NOT NULL DEFAULT 'normal',
  status ENUM('open','in_progress','resolved','closed') NOT NULL DEFAULT 'open',
  opened_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL,
  CONSTRAINT fk_tickets_client FOREIGN KEY (client_id) REFERENCES clients(client_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_tickets_project FOREIGN KEY (project_id) REFERENCES projects(project_id)
    ON UPDATE CASCADE ON DELETE SET NULL
);
