---
id: a-wight-returns
title: A Wight Returns
giver: npc:goldberry
summary: A barrow-wight has woken on the Downs. Put it to rest.
rewards: { gold: 15, rep: [{ faction: rangers-of-the-north, delta: 10 }] }
---

```steps
- id: silence
  type: reach
  target: landmark:barrowDowns
  set_flag: wight-done
  hint: Walk the Barrow-downs south-east of Bree and lay the wight to rest.
```
