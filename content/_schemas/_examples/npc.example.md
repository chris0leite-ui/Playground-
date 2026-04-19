---
id: barliman-butterbur-ii
name: Barliman Butterbur II
location: building:prancing-pony
faction: bree-folk
role: innkeeper
disposition: friendly
dialogue: barliman-welcome
quest_hooks: [strangers-on-the-greenway]
spawn_pos: { x: 12, y: 16 }
---

Great-grandson of the famous Barliman. Still forgets names.

```dialogue
## node: start
Well met, Ranger! What'll it be — a room, a rumor, or a rare ale?
- "A room." -> offer-room
- "Any rumors?" -> rumors
- "The ale." -> order-ale {effects: gold -2, hp +5}
- "Nothing." -> END
```
