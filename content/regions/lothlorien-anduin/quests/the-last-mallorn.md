---
id: the-last-mallorn
title: The Last Mallorn
giver: npc:haldirs-successor
summary: Protect a young mallorn sapling while it roots.
rewards: { gold: 15, rep: [{ faction: galadhrim, delta: 15 }] }
---

```steps
- id: guard
  type: reach
  target: landmark:mallornGlade
  set_flag: mallorn-done
  hint: Walk to the Mallorn Glade in Lothlórien and watch the sapling.
```
