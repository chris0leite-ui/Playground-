# Schema: overworld

Path: `content/overworld.md` (top-level singleton).

Required:
- `id`.
- `regions`: array of `{ id, x, y, icon?, unlocked_by? }`.

Optional:
- `bg_color`: hex or rgba.
- `tags`.

Rules:
- Each `regions[i].id` must reference a real region.
- `(x, y)` are on a 16×16 macro-grid (centered at `(8, 8)`).
- `unlocked_by` is a flag name; if set, the region is fogged until the flag is true.
