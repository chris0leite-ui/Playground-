---
id: kingsfoil-for-imladris
title: Kingsfoil for Imladris
giver: npc:miriel-vardameldo
summary: "Míriel's athelas supply has failed. Gather fresh kingsfoil from the Chetwood and bring it to the Healers' Hall."
rewards: { gold: 20, items: [elvenbread-fresh], rep: [{ faction: imladris-elves, delta: 10 }] }
tags: [herbalism, fetch]
---

```steps
- id: gather
  type: flag
  target: kingsfoil-done
  hint: Forage kingsfoil in the Chetwood (Bree-land, speak with Old Willowbark).
- id: deliver
  type: flag
  target: kingsfoil-errand-rewarded
  hint: Return the leaves to Míriel at the Healers' Hall.
```
