# §10 Critical files

## Reused as-is (file:line)
- Collision: `tryMove` (js/player.js:49), `tileAt/isSolidAt` (js/util.js:18-29), `rectsOverlap` (js/util.js:14).
- Loop: `loop`/`update`/`draw` (js/game.js), `updateCamera` (js/game.js:20).
- Input: `bindStick` (js/input.js:50), `moveInput` (js/input.js:44), `bindInput` (js/input.js:4).
- Rendering primitives: `drawEntities` Y-sort (js/render.js:3), `drawShadow` (js/render.js:30), `drawHpBar` (js/render.js:221), frustum cull in `drawMap` (js/map.js:93).
- HUD modal: `showMessage`/`hideMessage` (js/hud.js:47-54).
- Math: `clamp/rand/randInt/dist/distEnt/lerp/now` (js/util.js).

## New files created (all ≤150 lines)
- `build.js` + `build/{parse_frontmatter,parse_tilemap,parse_dialogue,parse_quest,validators,emit,schemas}.js`
- `js/engine/{region,actor,entity_registry,combat,dialogue,quest,faction,save,overworld}.js`
- `js/engine/entity_types/{player,npc_actor,horse,pickup,projectile}.js`
- `js/world/_manifest.js` + all generated shards.

## Files modified
- `js/game.js` → `js/engine/loop.js` (rename).
- `js/{config,util,state,input,render,hud}.js` → `js/engine/` (move; small edits for region-awareness).
- `js/{map,entities,player,ai}.js` dissolved into registry + actor + region + combat.
- `index.html` — updated `<script>` list (§6).

## Content (authored across tiers)
- `content/_schemas/*`, `content/_schemas/_examples/*`, `content/regions/*/*`, `content/{factions,classes,items,arcs}/*`, `content/overworld.md`.
