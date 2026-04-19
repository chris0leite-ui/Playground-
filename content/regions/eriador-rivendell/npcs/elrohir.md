---
id: elrohir
name: Elrohir
location: building:last-homely-house
faction: imladris-elves
role: lore-keeper
disposition: friendly
dialogue: elrohir-books
quest_hooks: [the-books-of-elrond]
spawn_pos: { x: 22, y: 23 }
---

Son of Elrond, stayed when the others sailed. Keeps the great libraries
of Imladris.

```dialogue
## node: start
Mae govannen. [if: !flag:books-started] Some annals of my father were left behind in the hills. Would you fetch them?
- "I will search." -> accept [if: !flag:books-started]
- "Still searching?" -> progress [if: flag:books-started && !flag:books-done]
- "They are safe." -> reward [if: flag:books-done]
- "I bear a sealed letter." -> errand-receive [if: flag:errand-leg-1 && !flag:errand-leg-2]
- "Another time." -> END

## node: accept
Bring them to the library. Handle them gently.
- "I shall." -> END {effects: flag:books-started=true, quest:the-books-of-elrond.start}

## node: progress
They are likely south, by the old road.
- "Understood." -> start

## node: reward
Hannon le. Take this phial — a gift long kept.
- "My thanks." -> END {effects: flag:books-rewarded=true, faction:imladris-elves.rep +20}

## node: errand-receive
Hand it here. I add a leaf of counsel. Bear the packet now to Thorin IV at Moria's West-gate.
- "I will." -> END {effects: flag:errand-leg-1-delivered=true, flag:errand-leg-2=true, quest:keepers-errand-1.complete, quest:keepers-errand-2.start}
- "A moment." -> start
```
