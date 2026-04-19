---
id: hildwyn-hearth-warden
name: Hildwyn Hearth-warden
location: building:mead-hall
faction: rohirrim
role: hearth-warden
disposition: friendly
dialogue: hildwyn-mead
quest_hooks: []
spawn_pos: { x: 28, y: 23 }
---

Tall, grey-plaited, keeps the Mead Hall's fire and its stories. Will pour a
horn for silver, and a second for a ballad.

```dialogue
## node: start
Welcome, rider. The fire is warm, the mead is fresh.
- "Pour me a horn." -> drink
- "Any news?" -> news
- "Another day." -> END

## node: drink
Ten silver. Long life. (heal 20)
- "Long life." -> END {effects: gold -10, hp +20}

## node: news
Oswin atop the watchtower saw eastern horsemen two nights past. Déorwin will
know more.
- "Noted." -> start
```
