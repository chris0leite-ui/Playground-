---
id: missing-mathom
title: Missing Mathom
giver: npc:sam-gamgee-the-younger
summary: Sam Gamgee-the-Younger has misplaced a family mathom near the Hobbiton pond.
rewards: { gold: 15, rep: [{ faction: hobbits, delta: 10 }] }
classes_eligible: [hobbit, ranger-of-the-north]
---

A gentle errand for a new arrival in the Shire.

```steps
- id: find
  type: reach
  target: landmark:hobbitonPond
  set_flag: mathom-done
  hint: Walk to the Hobbiton pond and search the reeds.
```
