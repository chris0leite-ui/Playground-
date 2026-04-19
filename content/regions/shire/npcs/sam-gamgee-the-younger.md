---
id: sam-gamgee-the-younger
name: Sam Gamgee-the-Younger
location: region:shire
faction: hobbits
role: mayor-of-hobbiton
disposition: friendly
dialogue: sam-missing-mathom
quest_hooks: [missing-mathom]
spawn_pos: { x: 22, y: 21 }
---

Great-grandson of Samwise, now the cheerful and mildly harried Mayor of
Hobbiton. Carries a second-hand pipe and a notebook of mathom inventories.

```dialogue
## node: start
Ah, good day to you! Ah — [if: !flag:accepted-mathom] have you a moment to help an old hobbit?
- "I have." -> ask [if: !flag:accepted-mathom]
- "Have you found it yet?" -> ask-found [if: flag:accepted-mathom && !flag:found-mathom]
- "Safe pocketing to you." -> farewell [if: flag:found-mathom]
- "Not today." -> END

## node: ask
You see, I've misplaced a mathom — small copper thing, belonged to my great-grand-dad. I last saw it by the pond. Would you fetch it, if you spy it?
- "I'll bring it back." -> accept {effects: flag:accepted-mathom=true, quest:missing-mathom.start}
- "Sorry, no." -> start

## node: accept
Bless you! The pond's south of the plaza.
- "I'll be off." -> END

## node: ask-found
Any luck? The pond's south of the square.
- "Found it." -> return {effects: flag:found-mathom=true, quest:missing-mathom.complete, gold +15, hp +20}
- "Not yet." -> START
- "Never mind." -> END

## node: return
Oh splendid — my thanks! Here, take a few coppers and a bite to eat.
- "Happy to help." -> END

## node: farewell
Fair travels, friend.
- "Likewise." -> END
```
