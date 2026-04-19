---
id: aethelrun-smith
name: Æthelrún Smith
location: building:armory-of-edoras
faction: rohirrim
role: smith
disposition: neutral
dialogue: aethelrun-armory
quest_hooks: []
spawn_pos: { x: 17, y: 27 }
---

Soot-scarred, broad-armed, speaks when struck. Forges the slender spear-heads
of the Mark.

```dialogue
## node: start
Gold or iron?
- "Show me your wares." -> shop
- "Another day." -> END

## node: shop
A Rohirric spear, thirty silver. A round shield, twenty-five.
- "I'll browse." -> start
```
