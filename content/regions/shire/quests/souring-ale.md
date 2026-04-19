---
id: souring-ale
title: Souring Ale
giver: npc:rosie-cotton-the-younger
summary: "The Green Dragon's ale has soured. Fetch a pot of mallorn honey from Lothlórien."
rewards: { gold: 15, rep: [{ faction: hobbits, delta: 10 }] }
classes_eligible: [hobbit, ranger-of-the-north, elf-noldor, elf-silvan, rohirrim, dwarf, gondorian, dunadan]
---

```steps
- id: fetch
  type: flag
  target: ale-done
  hint: Ask Orophin in Lothlórien for mallorn honey, then return to Rosie.
```
