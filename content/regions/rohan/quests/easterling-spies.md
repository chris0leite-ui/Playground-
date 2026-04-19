---
id: easterling-spies
title: Easterling Spies
giver: npc:oswin-scout
summary: "Oswin has seen strangers slipping past the Wold by night. Track them down and silence them."
rewards: { gold: 20, rep: [{ faction: rohirrim, delta: 15 }] }
tags: [combat, patrol]
---

```steps
- id: hunt
  type: kill
  target: orc
  count: 3
  hint: Slay three raiders on the Wold north-east of Edoras.
- id: report
  type: flag
  target: spies-rewarded
  hint: Return to Oswin at the Watchtower of Edoras.
```
