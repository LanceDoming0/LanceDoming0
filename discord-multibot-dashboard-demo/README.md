# Discord Multi-Bot Dashboard Demo

A responsive front-end demonstration of a control center for a modular Discord bot ecosystem.

## Important Disclosure

This repository is a **public portfolio demonstration using mock data**. It does not connect to Discord and does not include production bot source code, tokens, server IDs, client information, or private credentials.

## Features

- Responsive dashboard and mobile navigation
- Simulated start, stop, and restart actions
- Bot status cards and global controls
- Security-module switches
- Activity logging and log export
- No frameworks or build tools required

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- Responsive CSS Grid

## Run Locally

Open `index.html` directly, or run:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Suggested Production Architecture

A production implementation can use:

- A Node.js API server
- Discord.js bot workers
- Process management such as PM2 or Docker
- WebSocket or Server-Sent Events for status updates
- Role-based authentication
- Environment variables for credentials
- Structured audit logs and database persistence

## Security

Never commit bot tokens, `.env` files, API keys, database passwords, or private server data.

## Author

Lance Albert D. Aganon — Discord Bot Developer and Web Developer
