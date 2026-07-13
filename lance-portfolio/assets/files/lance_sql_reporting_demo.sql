-- Lance SQL & Reporting Practice Demo
-- Fictional sample data for portfolio demonstration only.

CREATE DATABASE IF NOT EXISTS lance_portfolio_demo;
USE lance_portfolio_demo;

CREATE TABLE clients (
  client_id INT AUTO_INCREMENT PRIMARY KEY,
  client_name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  service_type ENUM('Website','IT Support','Discord Bot','Design') NOT NULL,
  status ENUM('Active','Completed','On Hold') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
  project_id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  project_name VARCHAR(160) NOT NULL,
  due_date DATE,
  progress_percent TINYINT UNSIGNED DEFAULT 0,
  budget DECIMAL(10,2) DEFAULT 0,
  FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

CREATE TABLE support_tickets (
  ticket_id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  subject VARCHAR(180) NOT NULL,
  priority ENUM('Low','Normal','High') DEFAULT 'Normal',
  ticket_status ENUM('Open','In Progress','Resolved') DEFAULT 'Open',
  opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(client_id)
);

INSERT INTO clients (client_name,email,service_type,status) VALUES
('Northstar Trading','northstar@example.com','Website','Active'),
('Pixel District','pixel@example.com','Discord Bot','Completed'),
('Blue Ridge Office','blueridge@example.com','IT Support','Active'),
('Cedar Studio','cedar@example.com','Design','On Hold');

INSERT INTO projects (client_id,project_name,due_date,progress_percent,budget) VALUES
(1,'Responsive Business Website','2026-08-15',78,25000),
(2,'Discord Community Dashboard','2026-07-28',100,18000),
(3,'Workstation Maintenance Plan','2026-08-05',55,8500),
(4,'Branding Asset Collection','2026-09-01',35,12000);

-- Example reporting query
SELECT c.client_name, c.service_type, c.status,
       p.project_name, p.progress_percent, p.budget
FROM clients c
LEFT JOIN projects p ON p.client_id = c.client_id
ORDER BY p.progress_percent DESC;

-- Example summary query
SELECT service_type, COUNT(*) AS client_count
FROM clients
GROUP BY service_type
ORDER BY client_count DESC;
