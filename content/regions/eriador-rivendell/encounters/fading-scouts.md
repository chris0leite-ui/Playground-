---
id: fading-scouts
region: eriador-rivendell
trigger: on_enter_region
type: scatter
once: false
enemies:
  - { type: orc, count: 3 }
loot_table:
  - { item: lembas, weight: 2, min: 1, max: 1 }
narrative: "Orcs still creep through the hills north of Imladris. Keep your blade loose."
tags: [patrol, low-risk]
---
