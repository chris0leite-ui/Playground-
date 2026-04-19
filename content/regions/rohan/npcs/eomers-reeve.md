---
id: eomers-reeve
name: 'Déorwin, Reeve of Edoras'
location: region:rohan
faction: rohirrim
role: reeve
disposition: friendly
dialogue: deorwin-hoofbeats
quest_hooks: [hoofbeats-in-the-wold]
spawn_pos: { x: 24, y: 24 }
---

Lean as a spear-haft, watches the Wold from Meduseld's steps.

```dialogue
## node: start
Hail, rider. [if: !flag:hoofbeats-started] Easterling raiders trouble the Wold. Would you ride north?
- "I'll ride." -> accept [if: !flag:hoofbeats-started]
- "Raiders still out?" -> progress [if: flag:hoofbeats-started && !flag:hoofbeats-done]
- "Wold is quiet." -> reward [if: flag:hoofbeats-done]
- "Another day." -> END

## node: accept
Take a Rohirric spear. Return ere the moon turns.
- "I will." -> END {effects: flag:hoofbeats-started=true, quest:hoofbeats-in-the-wold.start}

## node: progress
Fast hooves, truer spears.
- "Aye." -> start

## node: reward
The Mark remembers you, friend.
- "My thanks." -> END {effects: flag:hoofbeats-rewarded=true, faction:rohirrim.rep +15, gold +20}
```
