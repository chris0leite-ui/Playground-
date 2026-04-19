---
id: old-willowbark
name: Old Willowbark
location: region:bree-land
faction: bree-folk
role: herbalist
disposition: friendly
dialogue: willowbark-kingsfoil
quest_hooks: [kingsfoil-in-chetwood]
spawn_pos: { x: 17, y: 18 }
---

Hunched, whiskered, smells of damp leaves. Knows every root from the Shire
to the Weatherhills.

```dialogue
## node: start
Eh? You've the look of a walker. [if: !flag:kingsfoil-started] My kingsfoil stock's run thin — would you cut a fresh bundle in the Chetwood?
- "Where in the Chetwood?" -> task [if: !flag:kingsfoil-started]
- "Still looking?" -> progress [if: flag:kingsfoil-started && !flag:kingsfoil-done]
- "I've the bundle." -> reward [if: flag:kingsfoil-done]
- "Not today, gaffer." -> END

## node: task
North of town, a mile or two. Look for the thin-leaved plant with white flowers.
- "I'll bring a bundle." -> accept {effects: flag:kingsfoil-started=true, quest:kingsfoil-in-chetwood.start}
- "Not my errand." -> start

## node: accept
Mind the brambles.
- "Aye." -> END

## node: progress
Whitish flowers. Thin leaves. Smells of old summer.
- "Right." -> start

## node: reward
Bless you. Take this phial — I'll ready a salve for you another day.
- "My thanks." -> END {effects: flag:kingsfoil-rewarded=true, hp +25, gold +10, faction:bree-folk.rep +10}
```
