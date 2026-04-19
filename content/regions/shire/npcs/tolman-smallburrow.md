---
id: tolman-smallburrow
name: Sheriff Tolman Smallburrow
location: region:shire
faction: shirriffs
role: shirriff-captain
disposition: friendly
dialogue: tolman-pony
quest_hooks: [missing-pony]
spawn_pos: { x: 18, y: 22 }
---

Head of the Shirriffs, carries a ledger and a half-full pipe. Takes his
rounds with a seriousness hobbits rarely earn.

```dialogue
## node: start
Afternoon. [if: !flag:pony-started] Got a pony wandered off — Master Fredegar's Stybba. Could you bring him in?
- "Where last seen?" -> task [if: !flag:pony-started]
- "Pony found?" -> progress [if: flag:pony-started && !flag:pony-done]
- "All returned." -> reward [if: flag:pony-done]
- "Good day." -> END

## node: task
South of the plaza, near the pond. Shouldn't be far.
- "I'll look." -> accept {effects: flag:pony-started=true, quest:missing-pony.start}
- "Not today." -> start

## node: accept
Bring him back safe, mind.
- "I will." -> END

## node: progress
Try the pond — ponies love the sweet grass there.
- "Right." -> start

## node: reward
Stybba's home. Fredegar wept a tear. Here's a silver for your trouble.
- "My thanks." -> END {effects: flag:pony-rewarded=true, gold +10, faction:shirriffs.rep +10}
```
