---
id: eomers-reeve
name: 'Déorwin, Reeve of Edoras'
location: building:meduseld
faction: rohirrim
role: reeve
disposition: friendly
dialogue: deorwin-hoofbeats
quest_hooks: [hoofbeats-in-the-wold]
spawn_pos: { x: 22, y: 23 }
---

Lean as a spear-haft, watches the Wold from Meduseld's steps.

```dialogue
## node: start
Hail, rider. [if: !flag:hoofbeats-started] Easterling raiders trouble the Wold. Would you ride north?
- "I'll ride." -> accept [if: !flag:hoofbeats-started]
- "Raiders still out?" -> progress [if: flag:hoofbeats-started && !flag:hoofbeats-done]
- "Wold is quiet." -> reward [if: flag:hoofbeats-done]
- "I bear a Keeper's packet." -> errand-receive [if: flag:errand-leg-5 && !flag:errand-leg-6]
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

## node: errand-receive
Hand it here. The white horse-seal of the Mark, added. Bear the packet now east to Beregond at Osgiliath.
- "I will." -> END {effects: flag:errand-leg-5-delivered=true, flag:errand-leg-6=true, quest:keepers-errand-5.complete, quest:keepers-errand-6.start}
- "A moment." -> start
```
