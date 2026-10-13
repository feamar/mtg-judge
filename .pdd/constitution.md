# Plan rules

- Cycles (`batches`) are numbered by increment: `1-2` is PI-1's second cycle. `1-0` holds PI-1's
  phase 1 and 2 documents.
- Items are W1, W2 across the project; an id is never reused.
- `depends_on` means "cannot correctly start until".
- Sizes are S, M, L or XL, never times.
- `delivers` names the behaviors an item delivers; every behavior of the current increment is
  delivered by some item.
- Operator items carry `"operator": true`.
- Exactly one item has nothing depending on it.
- Plan edits reach main in merges of their own; work branches never edit plan.json.
- Status comes from git: `Done:` trailers on main's first-parent merges, and branches named for items.
