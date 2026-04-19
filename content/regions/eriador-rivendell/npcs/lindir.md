---
id: lindir
name: Lindir
location: building:hall-of-fire
faction: imladris-elves
role: loremaster-singer
disposition: friendly
dialogue: lindir-verse
quest_hooks: [a-forgotten-verse]
spawn_pos: { x: 29, y: 22 }
---

Keeper of songs, last of the high-voiced minstrels of Imladris.

```dialogue
## node: start
Mae govannen. [if: !flag:verse-started] A verse of my own making — I have lost a line. Would you seek it in the old hall?
- "I will look." -> task [if: !flag:verse-started]
- "Still seeking?" -> progress [if: flag:verse-started && !flag:verse-done]
- "Here is the line." -> reward [if: flag:verse-done]
- "Another time." -> END

## node: task
A leaf of vellum, lost among the annals. My father's hand is on it.
- "I will find it." -> accept {effects: flag:verse-started=true, quest:a-forgotten-verse.start}
- "A lesser errand." -> start

## node: accept
Hannon le.
- "Farewell." -> END

## node: progress
In the scriptorium, perhaps — or where annals gather.
- "I shall look." -> start

## node: reward
At last — the song is whole. Take a lembas wafer; it is little thanks for so much.
- "My thanks." -> END {effects: flag:verse-rewarded=true, hp +30, gold +15, faction:imladris-elves.rep +15}
```
