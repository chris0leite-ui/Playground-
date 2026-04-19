---
id: rosie-cotton-the-younger
name: Rosie Cotton-the-Younger
location: region:shire
faction: hobbits
role: tavern-keeper
disposition: friendly
dialogue: rosie-brew
quest_hooks: [souring-ale]
spawn_pos: { x: 28, y: 22 }
---

Keeps the Green Dragon at Bywater, second only to the Prancing Pony in
reputation among hobbits who've been east of the Brandywine.

```dialogue
## node: start
Evenin', traveller. Ale's a bit sour tonight — won't pass a hobbit's tongue.
- "I can help?" -> task [if: !flag:ale-started]
- "Honey found?" -> progress [if: flag:ale-started && !flag:ale-done]
- "Was the ale fixed?" -> reward [if: flag:ale-done]
- "Another pint." -> drink {effects: gold -2, hp +10}
- "Another time." -> END

## node: task
Mallorn honey — the real Elven kind. A pot of it fixes a cauldron. Try asking Orophin in Lothlórien.
- "I'll fetch a pot." -> accept {effects: flag:ale-started=true, quest:souring-ale.start}
- "Tall errand." -> start

## node: accept
A pint's on the house when you return.
- "I'll hurry." -> END

## node: progress
Mallorn honey — ask the Galadhrim kindly.
- "I will." -> start

## node: reward
Smooth as a summer evening, thanks to you. Here's your promised pint and a few silver besides.
- "Lovely." -> END {effects: flag:ale-rewarded=true, hp +20, gold +15, faction:hobbits.rep +10}

## node: drink
Bottoms up.
- "Heart's lighter already." -> start
```
