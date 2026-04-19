---
id: warden-of-morannon
name: Warden of the Black Gate
location: region:mordor-ruin
faction: reunited-kingdom
role: warden
disposition: friendly
dialogue: warden-ash
quest_hooks: [ash-and-ember]
spawn_pos: { x: 24, y: 24 }
---

Rohirric-born, Gondor-commissioned. Commands the fort that keeps the old
Morannon watch.

```dialogue
## node: start
You pass the gate at a good hour. [if: !flag:ash-started] We've a warren that must be cleared.
- "Where?" -> accept [if: !flag:ash-started]
- "Still stirring?" -> progress [if: flag:ash-started && !flag:ash-done]
- "Fire is out?" -> reward [if: flag:ash-done]
- "Not today." -> END

## node: accept
South of the watchfort. Burn it out.
- "Consider it done." -> END {effects: flag:ash-started=true, quest:ash-and-ember.start}

## node: progress
No shade must follow you back.
- "Aye." -> start

## node: reward
The Kingdom sends her thanks — and a sword.
- "My thanks." -> END {effects: flag:ash-rewarded=true, faction:reunited-kingdom.rep +25, gold +30}
```
