---
id: easterling-raid
region: rohan
trigger: on_enter_region
type: scatter
once: false
enemies:
  - { type: orc, count: 4, tag: 'easterling-scout' }
loot_table:
  - { item: waybread, weight: 2, min: 1, max: 1 }
  - { item: spear-rohan, weight: 1, min: 1, max: 1 }
narrative: "Easterling riders still prowl the Wold. Keep to the road if you ride unarmed."
tags: [patrol, wold]
---
