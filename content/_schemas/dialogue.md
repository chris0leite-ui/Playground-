# Schema: dialogue

Path: inline inside an `npc.md` body (```dialogue fence) for short dialogues,
or `content/regions/<region-id>/dialogues/<id>.md` for branching trees.

Required frontmatter:
- `id`.
- `speaker`: npc-id.

Optional:
- `default_node` (default `start`).
- `tags`.

Body DSL:
```
## node: start
Hail, traveler. How may I serve?
- "A room." -> offer-room
- "Any rumors?" -> rumors [if: quest:ranger-initiation.step >= 2]
- "The ale." -> order-ale {effects: gold -2, hp +5}
- "Farewell." -> END
```

Rules:
- `## node: <id>` defines a node. The first defined node is `start` unless
  `default_node` overrides.
- Choice: `- "<text>" -> <next-or-END> [if: <cond>] {effects: <eff-list>}`.
- Conditions (LL(1), no parens): `quest:<id>.step <cmp> <int>`,
  `faction:<id>.rep <cmp> <int>`, `item:<id>`, `!item:<id>`,
  `flag:<name>`, `class == <class-id>`, combined with ` && ` / ` || `.
- Effects (comma-separated tuples): `gold ±N`, `hp ±N`, `item:<id> +N`,
  `quest:<id>.start|advance|complete`, `faction:<id>.rep ±N`,
  `flag:<name>=true`.

See `_examples/dialogue.example.md`.
