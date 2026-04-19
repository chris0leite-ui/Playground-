---
id: erestor-the-younger
name: Erestor the Younger
location: building:imladris-scriptorium
faction: imladris-elves
role: scriptorium-keeper
disposition: friendly
dialogue: erestor-scriptorium
quest_hooks: [a-forgotten-verse, the-lost-page]
spawn_pos: { x: 18, y: 20 }
---

Named for his grandsire, he keeps the vellum and ink of Imladris. Grave,
patient, and slow to speak.

```dialogue
## node: start
You walk softly — good. [if: !flag:verse-done] Lindir's line? I set it on the long table, beside the sea-songs. Read it if you wish.
- "I would read it." -> discover [if: flag:verse-started && !flag:verse-done]
- "About a lost page." -> lost-page [if: !flag:lost-page-started]
- "Just passing." -> END

## node: discover
Here. Between the verses of Fëanor's apology and the list of ships.
- "Thank you." -> END {effects: flag:verse-done=true}

## node: lost-page
A leaf of Arnor's roll has fallen from its binding — find it in the south archive and bring it back.
- "I will look." -> accept
- "Another day." -> start

## node: accept
Hannon le. Bring it unstained if you can.
- "I shall." -> END {effects: flag:lost-page-started=true, quest:the-lost-page.start}
```
