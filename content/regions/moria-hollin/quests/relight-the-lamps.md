---
id: relight-the-lamps
title: Relight the Lamps
giver: npc:thorin-iv
summary: Light the way-marker lamps along Moria's East Road.
rewards: { gold: 20, rep: [{ faction: dwarves-of-erebor, delta: 20 }] }
---

```steps
- id: light
  type: reach
  target: landmark:moriaGate
  set_flag: lamps-done
  hint: Follow the road east to the Moria East-gate and kindle the lamps.
```
