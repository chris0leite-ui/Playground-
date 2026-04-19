# Schema: item

Path: `content/items/<id>.md`.

Required:
- `id`, `name`.
- `type`: `weapon | armor | consumable | key | lore | ring | cloak | light`.
- `slot`: `melee | ranged | body | hand | head | off | trinket | none`.

Optional:
- `stats`: `{ atk, def, range, on_use: "heal 30" }`.
- `lore`: free prose in body.
- `rarity`: `common | uncommon | rare | legendary | unique`.
- `crafted_by`: faction-id or class-id.
- `where_found`: informational free text.
- `icon_color`: hex (for placeholder art).
- `tags`.

See `_examples/item.example.md`.
