---
id: barliman-welcome
speaker: barliman-butterbur-ii
default_node: start
---

## node: start
Well met, Ranger! What'll it be — a room, a rumor, or a rare ale?
- "A room." -> offer-room
- "Any rumors?" -> rumors [if: quest:ranger-initiation.step >= 2]
- "The ale." -> order-ale {effects: gold -2, hp +5}
- "Nothing." -> END

## node: offer-room
Five pennies for the night. I'll bolt your door.
- "Agreed." -> END {effects: gold -5, flag:slept-at-pony=true}
- "Too dear." -> start

## node: rumors
Folk say lights move in the Barrow-downs at dusk…
- "Tell me more." -> barrow-hook {effects: quest:a-wight-returns.start}
- "Later." -> start

## node: order-ale
A fine pint. Mind the froth.
- "My thanks." -> start

## node: barrow-hook
I'd not linger there by dusk, were I you.
- "I'll ride there at dawn." -> END
