---
id: iron-for-the-south
title: Iron for the South
giver: npc:bard-iii
summary: Escort a caravan of iron-work from Dale toward Gondor.
rewards: { gold: 30, rep: [{ faction: dwarves-of-erebor, delta: 15 }] }
---

```steps
- id: cross
  type: reach
  target: landmark:oldFord
  set_flag: iron-ford-crossed
  hint: Follow the caravan road south to the Old Ford on the Anduin.
- id: deliver
  type: reach
  target: landmark:osgiliath
  set_flag: iron-done
  hint: Continue the caravan to Osgiliath.
```
