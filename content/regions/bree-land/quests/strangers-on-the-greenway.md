---
id: strangers-on-the-greenway
title: Strangers on the Greenway
giver: npc:barliman-butterbur-ii
summary: Clear the orc-scouts prowling the Greenway south of Bree.
rewards: { gold: 25, rep: [{ faction: bree-folk, delta: 10 }, { faction: rangers-of-the-north, delta: 5 }] }
classes_eligible: [ranger-of-the-north, rohirrim, gondorian, dwarf, elf-noldor, hobbit]
---

```steps
- id: march
  type: reach
  target: landmark:greenwayCamp
  set_flag: greenway-done
  hint: March south on the Greenway and clear the orc camp.
```
