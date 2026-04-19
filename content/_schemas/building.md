# Schema: building

Path: `content/regions/<region-id>/buildings/<id>.md`.

Required:
- `id`, `name`, `type` (`house|inn|shop|smithy|temple|tower|ruin|…`).

Must set ONE of `settlement` or `region` (the building's parent).

Optional:
- `owner_npc`: npc-id.
- `services`: array (`inn`, `shop:weapons`, `shop:food`, `healer`, `quest_board`).
- `inventory_for_sale`: array of `{ item: item-id, price: int, stock: int }`.
- `interior_map`: path to an interior tilemap (turns the building into a sub-region).
- `entrance`: `{ x, y }` in the parent tilemap.
- `description`, `tags`.

See `_examples/building.example.md`.
