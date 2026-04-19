---
id: leofric-stablemaster
name: Léofric Stablemaster
location: building:stables-of-the-mark
faction: rohirrim
role: stablemaster
disposition: friendly
dialogue: leofric-stables
quest_hooks: [horse-of-the-mark]
spawn_pos: { x: 17, y: 20 }
---

Short-bearded, wind-burned, and fond of the horses more than the men. Knows
the lineage of every mare in the Westemnet.

```dialogue
## node: start
Hail, stranger. [if: !flag:lost-horse-started] A bay colt, Fréawine, broke his tether last night. Worth three silver to bring him in.
- "I'll look for him." -> accept [if: !flag:lost-horse-started]
- "I found the colt." -> reward [if: flag:lost-horse-found]
- "Later." -> END

## node: accept
He'll be east of here, near the stream.
- "I understand." -> END {effects: flag:lost-horse-started=true, quest:horse-of-the-mark.start}

## node: reward
Well ridden. The Mark thanks you.
- "My thanks." -> END {effects: flag:lost-horse-rewarded=true, gold +25, faction:rohirrim.rep +10}
```
