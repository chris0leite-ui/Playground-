# Schema: tilemap

Path: `content/regions/<region-id>/map.md`.

Required frontmatter:
- `id`.
- `size`: `{ w, h }`.

Optional:
- `legend_overrides`: `{ glyph: { tile: <TILE_NAME>, subtype: <string>, decor: <string> } }`.
- `tags`.

Body: one fenced ``` ```tilemap ``` block whose rows are ascii.

Default legend:
- `.` GRASS · `,` ROAD · `p` PAVEMENT · `#` BUILDING
- `H` BUILDING subtype `hobbit-hole` · `~` WATER · `T` TREE · `W` WALL
- `+` DOOR (road tile, decor door) · `=` BRIDGE (road, decor bridge)
- `^` MOUNTAIN · `s` SAND · `r` RUIN · ` ` VOID (solid boundary)

Rules:
- Every row must be the same width (build error otherwise).
- `spawn_point` referenced from `region.md` must land on a non-solid tile.
