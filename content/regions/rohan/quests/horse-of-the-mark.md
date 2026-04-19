---
id: horse-of-the-mark
title: Horse of the Mark
giver: npc:leofric-stablemaster
summary: "Fréawine, a bay colt of the Stables of the Mark, broke his tether. Find him east of Edoras and return him to Léofric."
rewards: { gold: 25, rep: [{ faction: rohirrim, delta: 10 }] }
tags: [rescue, fetch]
---

```steps
- id: find
  type: flag
  target: lost-horse-found
  hint: Ride east of Edoras, along the stream, to find the bay colt.
- id: return
  type: flag
  target: lost-horse-rewarded
  hint: Return Fréawine to Léofric at the Stables of the Mark.
```
