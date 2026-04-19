---
id: the-lost-page
title: The Lost Page
giver: npc:erestor-the-younger
summary: "A leaf of the Arnor charter-roll has slipped its binding. Retrieve it from the Bruinen Archive."
rewards: { gold: 20, rep: [{ faction: imladris-elves, delta: 10 }] }
tags: [lore, fetch]
---

```steps
- id: retrieve
  type: flag
  target: lost-page-retrieved
  hint: Speak with Culunedhel in the Bruinen Archive, south of the road.
- id: return
  type: flag
  target: lost-page-done
  hint: Return the page to Erestor in the scriptorium.
```
