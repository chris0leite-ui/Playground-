# §3 Dialogue + quest DSLs

## §3.1 Tilemap legend (defaults)
`.`=GRASS · `,`=ROAD · `p`=PAVEMENT · `#`=BUILDING · `H`=BUILDING subtype `hobbit-hole` · `~`=WATER · `T`=TREE · `W`=WALL · `+`=DOOR · `=`=BRIDGE · `^`=MOUNTAIN · `s`=SAND · `r`=RUIN · space=VOID (solid boundary padding). Overridable per-map via `legend_overrides`.

## §3.2 Dialogue DSL
Inside a ```dialogue fenced block (inline in npc.md) or a dedicated `dialogues/<id>.md`.

```
## node: start
Well met! What'll it be — a room, a rumor, or a rare ale?
- "A room." -> offer-room
- "Rumors?" -> rumors [if: quest:ranger-initiation.step >= 2]
- "The ale." -> order-ale {effects: gold -2, hp +5}
- "Nothing." -> END
```

- `## node: <id>` defines a node. First node is `start` unless `default_node:` overrides.
- Choice line: `- "<text>" -> <next|END> [if: <cond>] {effects: <eff-list>}`.
- **Condition grammar (LL(1), no parens):** `quest:<id>.step <cmp> <int>` | `faction:<id>.rep <cmp> <int>` | `item:<id>` | `!item:<id>` | `flag:<name>` | `class == <class-id>`, combined with ` && ` / ` || `.
- **Effects (comma-separated tuples):** `gold ±N`, `hp ±N`, `item:<id> +N`, `quest:<id>.start|advance|complete`, `faction:<id>.rep ±N`, `flag:<name>=true`.

## §3.3 Quest steps DSL
Inside a ```steps fenced block in quest.md.

```
- id: patrol-greenway
  type: reach
  target: region:bree-land coord (34,18)
  hint: Patrol the Greenway south of Bree.
- id: slay-scouts
  type: kill
  target: entity-tag:orc-scout count 3
- id: report
  type: dialogue
  target: npc:halbarad-ii node report
  complete: dialogue-ended
  rewards_on_complete: true
```

Step `type` values: `dialogue | reach | kill | gather | deliver | escort | survive | flag`. Optional `on_success:<step-id>` / `on_fail:<step-id>` for branches; default is linear walk.
