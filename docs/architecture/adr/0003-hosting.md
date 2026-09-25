# ADR-0003: Host on the product owner's always-on machine, in Docker Compose

Status: Proposed · Date: 2026-09-25 · Requirements: NFR-AVAIL-1, NFR-COST-1, NFR-PRIV-1, D31

## Context

The bot must run around the clock, but brief restarts are acceptable if tickets opened during an outage are picked up afterwards (NFR-AVAIL-1). All costs must stay under $20 a month, so every euro spent on hosting is a euro not spent on model calls. The product owner has a machine that runs 24/7 and prefers to use it (owner answer, 2026-09-25).

## Options considered

| Option | Monthly cost | Notes |
| --- | --- | --- |
| **Owner's always-on machine (chosen)** | No extra cost; the machine is already on | The owner handles power and network outages and OS updates. Data stays in the EU, on hardware the owner controls. |
| Small EU VPS | Roughly €4–6 | Better uptime; takes a quarter or more of the budget. |
| Serverless / PaaS | Varies | A Discord gateway bot needs a long-lived WebSocket, which fits serverless poorly. |

## Decision

- Run the bot as a **Docker Compose** stack on the owner's machine:
    - the `bot` service;
    - a scheduled `retention` job (it may run inside `bot`);
    - an optional `stt` sidecar, only if voice ships.
    - Restart policy: `unless-stopped`. The stack starts when the machine boots.
- **Outbound connections only.** The Discord gateway, the AI provider, and Scryfall bulk downloads are all outbound. No port is opened on the owner's router. That rules out a public web URL in the MVP; see OQ-28 on the event-context share link (FR-CTX-4).
- **Portability:** the same compose file runs unchanged on a VPS. Moving later is a copy of the data volume plus `docker compose up`.
- **Secrets** (Discord token, API key) live in an env file outside the repository, readable only by the owner's account.
- **Backups:** a nightly copy of the knowledge bundle and the runtime database to a second disk. Case records in the backups also expire after 7 days (D39).
- **Health:** the bot posts a startup message to a configurable owner-only channel, and writes a heartbeat to the database. An optional external uptime check is out of scope for the MVP.

## Consequences

- Availability depends on the owner's power, internet, and OS updates. NFR-AVAIL-1 accepts restarts; ADR-0011 guarantees that tickets opened while the bot was down are picked up.
- **Owner prerequisites** (for the planner to schedule):
    - Docker installed on the host (on Windows this means Docker Desktop with WSL2);
    - an operating system that still receives security updates, because the host holds personal data (NFR-PRIV-1);
    - disk encryption if the OS supports it.
- The architecture MUST NOT assume a single host forever. Nothing in `core` knows about the host. Scaling out (D31) replaces SQLite with a server database and runs several stateless bot workers; see ADR-0004 and ADR-0011.

## Revisit when

Uptime on the home machine is a problem in practice, or a feature needs inbound HTTP (a web share link, WhatsApp webhooks, a phone app API).
