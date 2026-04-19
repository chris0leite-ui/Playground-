---
id: ranger-initiation
title: Ranger's First Watch
giver: npc:halbarad-ii
summary: Patrol the Greenway south of Bree and return word of any foul sign.
prerequisites: class == ranger-of-the-north
rewards: { gold: 25, rep: [{ faction: rangers-of-the-north, delta: 10 }] }
classes_eligible: [ranger-of-the-north]
arc: rangers-of-the-north
---

```steps
- id: accept
  type: dialogue
  target: npc:halbarad-ii node accept
- id: patrol-greenway
  type: reach
  target: region:bree-land coord (34,18)
  hint: Patrol the Greenway south of Bree.
- id: slay-scouts
  type: kill
  target: entity-tag:orc-scout count 3
- id: report
  type: dialogue
  target: npc:halbarad-ii node report
  rewards_on_complete: true
```
