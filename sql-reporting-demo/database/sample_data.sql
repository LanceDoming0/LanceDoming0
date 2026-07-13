USE lance_reporting_demo;

INSERT INTO clients (client_name,email,industry,status) VALUES
('Northstar Café','hello@northstar-demo.test','Food & Beverage','active'),
('Pixel Harbor Studio','team@pixelharbor-demo.test','Gaming','active'),
('Greenline Services','contact@greenline-demo.test','Local Services','lead'),
('Orbit Commerce','ops@orbitcommerce-demo.test','E-commerce','active'),
('Blue Ridge Fitness','admin@blueridge-demo.test','Fitness','inactive');

INSERT INTO projects (client_id,project_name,project_type,status,progress_percent,budget,due_date) VALUES
(1,'Business Website Refresh','Website','in_progress',72,42000,'2026-08-15'),
(2,'Discord Community Dashboard','Discord System','review',90,58000,'2026-07-30'),
(3,'Service Booking Landing Page','Website','planning',18,25000,'2026-09-01'),
(4,'Product Catalog Interface','E-commerce','completed',100,65000,'2026-06-12'),
(5,'PC Maintenance Tracker','Reporting','on_hold',46,18000,'2026-08-28');

INSERT INTO support_tickets (client_id,project_id,subject,priority,status) VALUES
(1,1,'Update contact-form destination','normal','in_progress'),
(2,2,'Review role-management permissions','high','open'),
(4,4,'Add product category filter','normal','resolved'),
(5,5,'Confirm reporting fields','low','open'),
(1,1,'Optimize mobile hero image','high','resolved');
