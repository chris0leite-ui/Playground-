---
id: missing-pony
title: Missing Pony
giver: npc:tolman-smallburrow
summary: "Find Master Fredegar's runaway pony, Stybba, near the Hobbiton pond."
rewards: { gold: 10, rep: [{ faction: shirriffs, delta: 10 }] }
---

```steps
- id: find
  type: reach
  target: landmark:hobbitonPond
  set_flag: pony-done
  hint: Walk to the Hobbiton pond — follow the red pin on the minimap.
```
