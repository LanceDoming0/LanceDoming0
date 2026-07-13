# SQL & Reporting Dashboard Demo

A small relational database and browser-based reporting demonstration using **fictional sample data**.

## What It Demonstrates

- MySQL / MariaDB schema design
- Primary and foreign keys
- Data validation with enums and constraints
- Sample data inserts
- JOIN, GROUP BY, filtering, ordering, and summary queries
- Searchable and filterable reporting interface
- Responsive HTML/CSS/JavaScript dashboard

## Repository Structure

```text
database/
  schema.sql
  sample_data.sql
  queries.sql
web-demo/
  index.html
  assets/
docs/
  erd.svg
```

## Import with HeidiSQL or XAMPP

1. Start MySQL/MariaDB in XAMPP.
2. Open HeidiSQL or phpMyAdmin.
3. Run `database/schema.sql`.
4. Run `database/sample_data.sql`.
5. Open `database/queries.sql` to test reports.

## Open the Browser Demo

Open `web-demo/index.html`, or run a local server from the repository root:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000/web-demo/`.

## Data Disclosure

All names, email addresses, budgets, dates, and records in this repository are fictional and created for a portfolio demonstration.

## Author

Lance Albert D. Aganon
