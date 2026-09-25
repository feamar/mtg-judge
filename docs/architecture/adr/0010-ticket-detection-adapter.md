# ADR-0010: Ticket detection as a pluggable `TicketSource`

Status: Proposed · Date: 2026-09-25 · Requirements: FR-INT-1, D37, OQ-21, OQ-22, R13, NFR-EXT-1, NFR-AVAIL-1

## Context

The judge never creates tickets. It detects the tickets that the server's existing ticket bot creates, joins them, and must survive differences between ticket bots (FR-INT-1, R13).

There is a Discord detail that matters here: **a thread belongs to a parent text or forum channel, not to a category.** Categories contain channels. Popular ticket bots use one of two patterns:

- (a) a new *private channel* per ticket, under a category;
- (b) a new *private thread* per ticket, under a fixed channel.

FR-INT-1 and FR-CTX-1 mention both "thread" and "category". **Owner's answer to OQ-22 (2026-09-25): the ticket bot creates a thread per ticket**, which is pattern (b). The bot's name (OQ-21) is still needed.

## Decision

```
interface TicketSource {
  id: string                                   // e.g. "discord-channel-in-category", "discord-private-thread"
  matches(event: DiscordContainerCreated, ctx: EventContext): boolean
  parse(container, firstMessages): TicketInfo | "not-yet"    // description, reporter(s), participants
  listOpen(guild, ctx): Promise<ContainerRef[]>               // for catch-up (ADR-0011)
  isClosed(container): boolean                                // archived, locked, deleted, renamed "closed-*", ...
}
TicketInfo { containerRef, reporterUserIds[], mentionedUserIds[], description, openedAt }
```

- The **event context** stores `ticketSource: { id, config }`. For example: category ID for pattern (a); parent channel ID for pattern (b); title regex; ticket bot user ID.
- The MVP ships **only the thread source** (`discord-private-thread`), because that's what the owner's server uses. The channel-in-category source is a later plugin for other servers; the interface already allows it. OQ-21 (the bot's name) tells us whether a parser specific to that bot is needed.
- The event context's "ticket category" field (FR-CTX-1) is filled with the **parent channel** that the ticket bot opens threads under. That is how the PRD field applies to the thread pattern; see OQ-22.
- **`parse` may return `"not-yet"`:** many ticket bots post the description a moment after the container is created, or only after the player fills in a form. The adapter waits for the first message by the ticket bot or the reporter, up to a configurable timeout.

**Required Discord permissions:**

- gateway intents for guilds, guild messages, and the privileged **Message Content** intent (bots in fewer than 100 servers can switch this on without verification);
- the permission to view the ticket category or parent channel;
- for private threads, being added to the thread or having Manage Threads.

The TO's server setup checklist lists these, and a `/judge doctor` command checks them.

## Consequences

- Supporting another server's ticket bot is a config change, or at worst one new parser, with no engine change.
- Spike S2 checks the chosen source against the real ticket bot, including the timing of the first message and who gets added.
- R13's mitigation is concrete: the parser has recorded fixtures of real ticket containers, replayed in CI.
