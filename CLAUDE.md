# Middle-earth RPG — agent notes

Vanilla-JS sandbox being grown into a Fourth-Age Middle-earth RPG. Classic
`<script>` tags, no modules, no bundler, no npm. Plays from `file://`.

## Branches

- **Deploy**: `claude/lotr-gta-game-0ydf5` — GitHub Pages serves from here.
  All changes intended for the live phone build must land on this branch.
- **Alternate (keep, do not merge)**: `claude/game-extension-planning-Smdlw` —
  a parallel game direction (Sauron, Balrog, Isengard, worldgen). Preserved
  for reference; it has no `js/world/` pipeline.

## Plan

`docs/plan/00-index.md` is the entry point. Eleven split files, one per
numbered section. Tiers: T0 engine refactor (done), T1 skeleton (done,
10 regions), T2 systems + spine arc (partial), T3 depth passes
(done for Shire/Bree/Rivendell), T4 cross-region arcs (future).

## Hard constraints

- No runtime `fetch` — compiled world is committed JS shards under `js/world/`.
- No npm at runtime or at build time (build uses only Node stdlib).
- All content lives on `window.W.*` globals, populated by the shards.
- Line budgets: engine `.js` ≤ 150, content `.md` ≤ 120, build helper
  `.js` ≤ 120, plan/doc `.md` ≤ 80. Split before merge if approaching.
- Token discipline: author agents read only `_schemas/` + the region they
  touch + `content/INDEX.json`. Never the whole corpus.

## Build

- `node build.js` — walks `content/`, regenerates `js/world/*.js`.
- `node build.js --check` — validates cross-refs without writing files.
- Edit `.md` under `content/`, rebuild, commit both.

## GitHub Pages gotchas

- **`.nojekyll` at repo root is mandatory.** Jekyll (Pages' default) drops
  files whose names begin with `_`, so `js/world/_manifest.js` would 404,
  `window.W` would never be initialised, every other shard would throw
  `ReferenceError: W is not defined`, and the game would boot with empty
  `W.classes` / `W.regions` / `W.overworld`.
- Cache-buster: every `<script>` and `<link>` tag in `index.html` carries
  `?v=N`. Bump `N` uniformly (`sed -i 's/?v=N/?v=N+1/g' index.html`) whenever
  script or style contents change so phones refetch.
