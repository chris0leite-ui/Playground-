# §6 Script load order

World shards load before engine so boot can read `W.*`:

```
js/engine/{config,util,state}.js
js/world/_manifest.js
js/world/{factions,items,classes,tilemaps,regions,settlements,buildings,
         npcs,dialogues,quests,arcs,encounters,overworld}.js
js/engine/entity_registry.js
js/engine/entity_types/{player,npc_actor,horse,pickup,projectile}.js
js/engine/{actor,region,faction,quest,dialogue,combat,overworld,save,
           input,hud,render,loop}.js
```

## File-size rule
Every file here stays ≤ 150 lines. If a file approaches the cap, split by concern before merge — e.g. `combat.js` → `combat_melee.js` + `combat_ranged.js`, `render.js` → `render_world.js` + `render_ui.js`, `input.js` → `input_keyboard.js` + `input_touch.js` + `input_modes.js`.
