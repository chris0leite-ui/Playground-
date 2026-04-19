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
- "I bear a Keeper's packet." -> errand-final [if: flag:errand-leg-7 && !flag:errand-leg-8]
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

## node: errand-final
At last. The seven seals — Bree, Imladris, Khazad, Lórien, Erebor, Mark, Anor — and now the Black Gate. The packet bears a single line: 'The watch endures.' You have woven the realms anew, Keeper.
- "It is done." -> END {effects: flag:errand-leg-7-delivered=true, flag:errand-leg-8=true, flag:errand-leg-8-delivered=true, quest:keepers-errand-7.complete, quest:keepers-errand-8.start, quest:keepers-errand-8.complete, gold +100, faction:reunited-kingdom.rep +25}
```
