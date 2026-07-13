USE lance_reporting_demo;

-- Project overview with client information
SELECT
  p.project_id,
  c.client_name,
  p.project_name,
  p.project_type,
  p.status,
  p.progress_percent,
  p.budget,
  p.due_date
FROM projects AS p
JOIN clients AS c ON c.client_id = p.client_id
ORDER BY FIELD(p.status,'in_progress','review','planning','on_hold','completed'), p.due_date;

-- Revenue and project count by client
SELECT
  c.client_name,
  COUNT(p.project_id) AS project_count,
  COALESCE(SUM(p.budget),0) AS total_project_value
FROM clients AS c
LEFT JOIN projects AS p ON p.client_id = c.client_id
GROUP BY c.client_id, c.client_name
ORDER BY total_project_value DESC;

-- Open support workload by priority
SELECT
  priority,
  COUNT(*) AS ticket_count
FROM support_tickets
WHERE status IN ('open','in_progress')
GROUP BY priority
ORDER BY FIELD(priority,'urgent','high','normal','low');

-- Projects due in the next 45 days
SELECT project_name,status,progress_percent,due_date
FROM projects
WHERE due_date BETWEEN CURRENT_DATE AND DATE_ADD(CURRENT_DATE, INTERVAL 45 DAY)
ORDER BY due_date;
