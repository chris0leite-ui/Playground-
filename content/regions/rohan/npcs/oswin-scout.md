---
id: oswin-scout
name: Oswin of the Watchtower
location: building:watchtower-of-edoras
faction: rohirrim
role: scout
disposition: friendly
dialogue: oswin-watch
quest_hooks: [easterling-spies]
spawn_pos: { x: 29, y: 27 }
---

Young, sharp-eyed, always half-leaning on the parapet. Has climbed more
stairs than he has ridden mares.

```dialogue
## node: start
Up here, traveller. [if: !flag:spies-started] I have counted three strangers skirting the Wold by night. Will you track them?
- "I'll track them." -> accept [if: !flag:spies-started]
- "The spies are dealt with." -> reward [if: flag:spies-done]
- "Farewell." -> END

## node: accept
Ride north-east, past the crooked tree. Do not be seen ere they are.
- "I understand." -> END {effects: flag:spies-started=true, quest:easterling-spies.start}

## node: reward
Clean work. The Mark owes you a cup.
- "Aye." -> END {effects: flag:spies-rewarded=true, gold +20, faction:rohirrim.rep +15}
```
