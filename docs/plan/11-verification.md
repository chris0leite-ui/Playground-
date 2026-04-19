# §11 Verification

## After T0 (engine refactor, no new content)

1. `node build.js` exits 0, emits `js/world/*.js`.
2. Open `index.html` via `file://` — intro modal appears.
3. "Ride out" → the old Minas Tirith map loads (now a region).
4. Joystick + attack + mount still work.
5. Killing orcs grants renown; killing guards drops `rep[citadel-guard]` → they aggro (old wanted behavior, now faction-driven).
6. `M` opens the overworld; clicking the one region returns in.
7. Walking off an edge with no neighbor shows "The path leads nowhere."
8. Trivial dialogue with a test NPC opens a choice modal; choices advance; closing resumes world input.
9. Save, reload page, load — returns to same state.
10. Equipping a bow + releasing the ranged button spawns a projectile that damages an orc.
11. Ranger class sneaks past an orc that would have detected a Gondorian.

## Automated checks (`node build.js --check`)
- Every content file parses and passes its schema.
- Every `<type>:<id>` resolves.
- Every tilemap is rectangular; `spawn_point` non-solid.
- Every dialogue node is reachable.
- No duplicate IDs; no cycles in arcs.
- Schema version matches `W.schemaVersion`.
- Every committed file obeys its size budget (see 00-index).

## Per-tier checkpoints
- **T1** — all 10 regions load; each starter quest playable start-to-finish; every adjacency transitions correctly; overworld shows all 10.
- **T2** — each class produces a playable start (different spawn + inventory); faction rep propagates to NPC hostility; spine arc *The Keeper's Errand* completable on at least one class.
- **T3 (per region)** — region still loads after depth-pass; new quests start; new encounters trigger; adjacent regions unaffected (validators green).
- **T4 (arcs)** — arc progression carries state across regions + save/load cycles; completing a leg in A unlocks the giver in B.

## Regression guard (optional, post-T0)
A `node test.js` that steps the engine through a scripted timeline (load region → advance quest → save → load → assert) without drawing — proves data integrity without a browser.
