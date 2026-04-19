---
id: goldberry
name: Goldberry
location: region:old-forest
faction: none
role: river-daughter
disposition: friendly
dialogue: goldberry-wight
quest_hooks: [a-wight-returns]
spawn_pos: { x: 24, y: 24 }
---

The River-daughter, singing still among the reeds.

```dialogue
## node: start
Come, merry dol. [if: !flag:wight-started] A barrow stirs on the Downs — it should not.
- "I'll put it down." -> accept [if: !flag:wight-started]
- "Still restless?" -> progress [if: flag:wight-started && !flag:wight-done]
- "The Downs are quiet." -> reward [if: flag:wight-done]
- "Go well." -> END

## node: accept
Take heart. Sing if the dark closes.
- "I will." -> END {effects: flag:wight-started=true, quest:a-wight-returns.start}

## node: progress
Tom's name is a light. Use it if need be.
- "Thank you." -> start

## node: reward
The water is clear again. Peace go with you.
- "And with you." -> END {effects: flag:wight-rewarded=true, faction:rangers-of-the-north.rep +10}
```
