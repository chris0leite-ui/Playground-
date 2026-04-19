---
id: haldirs-successor
name: Orophin the Grey
location: region:lothlorien-anduin
faction: galadhrim
role: march-warden
disposition: friendly
dialogue: orophin-mallorn
quest_hooks: [the-last-mallorn]
spawn_pos: { x: 24, y: 24 }
---

Heir to Haldir's post. Quiet voice, quicker bow.

```dialogue
## node: start
Mae govannen. [if: !flag:mallorn-started] A young mallorn falters. Would you guard it a while?
- "I will." -> accept [if: !flag:mallorn-started]
- "Has it held?" -> progress [if: flag:mallorn-started && !flag:mallorn-saved]
- "The wood is well?" -> reward [if: flag:mallorn-saved]
- "I bear a Keeper's packet." -> errand-receive [if: flag:errand-leg-3 && !flag:errand-leg-4]
- "Another time." -> END

## node: accept
Take this bow. Strike any who lay hand on the sapling.
- "I will." -> END {effects: flag:mallorn-started=true, quest:the-last-mallorn.start}

## node: progress
The sapling stands. Keep the watch.
- "I will." -> start

## node: reward
The tree has rooted. Accept this lembas — little though it is.
- "Hannon le." -> END {effects: flag:mallorn-rewarded=true, faction:galadhrim.rep +15}

## node: errand-receive
Hand it here. I wrap it in mallorn-leaf — it will not lose its way. Bear it now to Bard III in Dale.
- "I will." -> END {effects: flag:errand-leg-3-delivered=true, flag:errand-leg-4=true, quest:keepers-errand-3.complete, quest:keepers-errand-4.start}
- "A moment." -> start
```
