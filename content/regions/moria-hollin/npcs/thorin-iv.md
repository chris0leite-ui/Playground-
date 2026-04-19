---
id: thorin-iv
name: Thorin IV
location: region:moria-hollin
faction: dwarves-of-erebor
role: gate-keeper
disposition: friendly
dialogue: thorin-relight
quest_hooks: [relight-the-lamps]
spawn_pos: { x: 24, y: 24 }
---

Thorin Stonehelm's grandson, bearded to the belt. Presides over the
re-opening of the West-gate with a mason's patience.

```dialogue
## node: start
Welcome to the Doors of Durin, stranger. [if: !flag:relight-lamps-started] We've a task a stout arm might lend to.
- "Tell me." -> task [if: !flag:relight-lamps-started]
- "Still at it?" -> progress [if: flag:relight-lamps-started && !flag:relight-lamps-done]
- "Mithril for ye." -> reward [if: flag:relight-lamps-done]
- "Farewell." -> END

## node: task
The old way-marker lamps along the east road have gone dark. Light them and we'll know the path is safe again.
- "I'll light them." -> accept {effects: flag:relight-lamps-started=true, quest:relight-the-lamps.start}
- "Not my path." -> start

## node: accept
May the flame hold, friend.
- "Aye." -> END

## node: progress
Keep to the lamps and the lamps to you.
- "Understood." -> start

## node: reward
Durin's sign shines again. Here, a rune-stone for your troubles.
- "My thanks." -> END {effects: flag:relight-lamps-rewarded=true, faction:dwarves-of-erebor.rep +20}
```
