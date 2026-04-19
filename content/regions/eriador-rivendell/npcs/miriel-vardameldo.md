---
id: miriel-vardameldo
name: Míriel Vardameldo
location: building:healers-hall
faction: imladris-elves
role: healer
disposition: friendly
dialogue: miriel-heal
quest_hooks: [kingsfoil-for-imladris]
spawn_pos: { x: 25, y: 27 }
---

The last healer of the Hall who learned her craft of Arwen's household.
Speaks little, listens well.

```dialogue
## node: start
Mae govannen. The hearth is warm. [if: !flag:kingsfoil-errand-started] Our kingsfoil has all but failed — could you bring fresh leaves from the Chetwood?
- "I will gather." -> accept [if: !flag:kingsfoil-errand-started]
- "I bring leaves." -> reward [if: flag:kingsfoil-done]
- "I am hurt." -> heal
- "Later." -> END

## node: accept
Three stems will be enough. Keep them out of direct sun.
- "Understood." -> END {effects: flag:kingsfoil-errand-started=true, quest:kingsfoil-for-imladris.start}

## node: heal
Rest a moment. Drink this. (+40 hp)
- "My thanks." -> END {effects: hp +40}

## node: reward
These will last the season. Take a loaf of fresh elven-bread with my thanks.
- "Hannon le." -> END {effects: flag:kingsfoil-errand-rewarded=true, hp +30, gold +20, faction:imladris-elves.rep +10}
```
