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
  type: reach
  target: landmark:mallornGlade
  set_flag: ale-done
  hint: Travel to the Mallorn Glade in Lothlórien for the honey.
```
