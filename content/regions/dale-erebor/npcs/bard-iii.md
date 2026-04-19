---
id: bard-iii
name: Bard III
location: region:dale-erebor
faction: dwarves-of-erebor
role: king-of-dale
disposition: friendly
dialogue: bard-iron
quest_hooks: [iron-for-the-south]
spawn_pos: { x: 24, y: 24 }
---

Young king, sharp-eyed, trades as easily with Elves as with Dwarves.

```dialogue
## node: start
Well met, traveller. [if: !flag:iron-started] We've a caravan bound for Gondor — could use another sword.
- "I'll ride with them." -> accept [if: !flag:iron-started]
- "Road clear?" -> progress [if: flag:iron-started && !flag:iron-delivered]
- "Thanks again." -> reward [if: flag:iron-delivered]
- "I bear a Keeper's packet." -> errand-receive [if: flag:errand-leg-4 && !flag:errand-leg-5]
- "Fare well." -> END

## node: accept
The wagons leave at dawn. Keep the axle wheels unbroken.
- "Aye." -> END {effects: flag:iron-started=true, quest:iron-for-the-south.start}

## node: progress
Mind the hills east of the Anduin.
- "I shall." -> start

## node: reward
A purse of Ereborian silver, well earned.
- "My thanks." -> END {effects: flag:iron-rewarded=true, faction:dwarves-of-erebor.rep +15, gold +30}

## node: errand-receive
Hand it here. I add an Ereborian script. Bear the packet now south to the Reeve at Edoras.
- "I will." -> END {effects: flag:errand-leg-4-delivered=true, flag:errand-leg-5=true, quest:keepers-errand-4.complete, quest:keepers-errand-5.start}
- "A moment." -> start
```
