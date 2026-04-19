# Schema: region

Path: `content/regions/<id>/region.md`.

Required frontmatter:
- `id`: kebab-case, unique across regions.
- `name`: display name.
- `tilemap`: usually `./map.md` (refers to the neighboring tilemap file).
- `neighbors`: map of `north|south|east|west|ne|nw|se|sw` → region-id or `null`.

Optional:
- `parent`: region-id — enables macro/micro region trees.
- `climate`: free-text keyword.
- `era`: `fourth-age-early`, `fourth-age-mid`, etc.
- `tone`: `pastoral-cozy`, `ruin-haunted`, `trade-bustling`, etc.
- `factions_present`: array of faction-ids.
- `spawn_point`: `{ x: int, y: int }` in tile coords (not pixels).
- `overworld_pos`: `{ x: int, y: int }` on the 16×16 macro-grid.
- `description`: body prose is also allowed.
- `tags`: free array.

Rules:
- Neighbor pairs must be **symmetric** — if `shire.east = bree-land`, then `bree-land.west = shire`. The build validator enforces this.
- `spawn_point` must be on a non-solid tile (checked at build time).

See `_examples/region.example.md` for a worked example.
