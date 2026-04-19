---
id: faramirs-steward
name: Beregond the Younger
location: region:gondor-south
faction: reunited-kingdom
role: steward
disposition: friendly
dialogue: beregond-bridge
quest_hooks: [bridge-of-stone]
spawn_pos: { x: 24, y: 24 }
---

Bears the white tree on his cloak. Overseer of the Osgiliath rebuild.

```dialogue
## node: start
Hail, friend of the Kingdom. [if: !flag:bridge-started] Bandits set on the new bridge at dusk. Would you lend a blade?
- "Point the way." -> accept [if: !flag:bridge-started]
- "Bridge held?" -> progress [if: flag:bridge-started && !flag:bridge-done]
- "Bridge is open?" -> reward [if: flag:bridge-done]
- "I bear a Keeper's packet." -> errand-receive [if: flag:errand-leg-6 && !flag:errand-leg-7]
- "Later." -> END

## node: accept
The south span. Keep the king's peace.
- "I shall." -> END {effects: flag:bridge-started=true, quest:bridge-of-stone.start}

## node: progress
Swift strike, sure foot.
- "Aye." -> start

## node: reward
A Citadel commendation. And coin besides.
- "My thanks." -> END {effects: flag:bridge-rewarded=true, faction:reunited-kingdom.rep +20, gold +25}

## node: errand-receive
Hand it here. The white tree, sealed. Bear the packet now east to the Warden at the Morannon.
- "I will." -> END {effects: flag:errand-leg-6-delivered=true, flag:errand-leg-7=true, quest:keepers-errand-6.complete, quest:keepers-errand-7.start}
- "A moment." -> start
```
