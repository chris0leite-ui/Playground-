---
id: culunedhel
name: Culunedhel
location: building:bruinen-archive
faction: imladris-elves
role: archivist
disposition: wary
dialogue: culunedhel-archive
quest_hooks: [the-lost-page]
spawn_pos: { x: 16, y: 25 }
---

Slight and grey-robed. Keeps the south archive without much patience for
strangers. Takes her tea from a very small cup.

```dialogue
## node: start
You again. [if: flag:lost-page-started && !flag:lost-page-done] The leaf sits in the fourth bay, among the Cardolan rolls. Take it, carefully, and I will let you leave.
- "I have it." -> deliver [if: flag:lost-page-started]
- "What leaf?" -> lost-page-hint [if: !flag:lost-page-started]
- "I meant no harm." -> END

## node: lost-page-hint
Speak with Erestor in the scriptorium. He knows what he lost.
- "I shall." -> END

## node: deliver
Good. Give it to Erestor, not to me. My hands no longer touch vellum.
- "Understood." -> END {effects: flag:lost-page-retrieved=true}
```
