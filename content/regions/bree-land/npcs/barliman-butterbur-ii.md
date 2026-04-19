---
id: barliman-butterbur-ii
name: Barliman Butterbur II
location: region:bree-land
faction: bree-folk
role: innkeeper
disposition: friendly
dialogue: barliman-welcome
quest_hooks: [strangers-on-the-greenway]
spawn_pos: { x: 20, y: 20 }
---

Great-grandson of the old Barliman. Still forgets names. Keeps the Prancing
Pony at a bright polish.

```dialogue
## node: start
Well met! [if: !flag:accepted-greenway] The roads have been restless of late. Care to hear what I've heard?
- "What's the word?" -> news [if: !flag:accepted-greenway]
- "Any progress on the Greenway?" -> progress [if: flag:accepted-greenway && !flag:greenway-clear]
- "It's quiet now." -> reward [if: flag:greenway-clear]
- "A room, please." -> room {effects: gold -5, hp +30, flag:slept-at-pony=true}
- "Heard of the Keeper's Errand?" -> errand-1 [if: !flag:errand-leg-1]
- "Another time." -> END

## node: news
Travelers say orc-scouts skulk along the Greenway south of town. If a soul of your cut were to scatter them, the Kingdom would remember.
- "I'll ride there." -> accept {effects: flag:accepted-greenway=true, quest:strangers-on-the-greenway.start}
- "Not my errand." -> start

## node: accept
The Greenway runs south from the crossroads. Ride safe.
- "Aye." -> END

## node: progress
Take care down there — keep the road to your right.
- "Understood." -> start

## node: reward
Word came back: the road's clear. Here — a traveller's pouch on the house.
- "My thanks." -> END {effects: flag:greenway-rewarded=true, gold +25}

## node: room
A fine room, as always. Sleep well.
- "My thanks." -> start

## node: errand-1
Hush, then. Halbarad left this sealed letter — bear it east to Elrohir at Rivendell.
- "I'll bear it." -> END {effects: flag:errand-leg-1=true, quest:keepers-errand-1.start}
- "Not now." -> start
```
