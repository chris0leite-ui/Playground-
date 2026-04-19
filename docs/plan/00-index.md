# Middle-earth RPG — Plan (index)

This `docs/plan/` tree is the split form of `/root/.claude/plans/i-do-not-know-valiant-sunrise.md`. One file per numbered section. Every file is capped at 80 lines.

## Context
`/home/user/Playground-` holds a ~1.3k-line vanilla-JS top-down sandbox set in Minas Tirith (GTA-2 style). No build step, no modules, classic `<script>` tags, plays from `file://`.

Goal: turn it into a large, detail-rich Middle-earth RPG — many regions, settlements, buildings, NPCs, quests, factions, classes, items — authored as **modular markdown**, compiled into committed JS, so content grows indefinitely without the engine growing. Setting: **Fourth Age** (post-Ring). Class choice at start. Overworld map **and** seamless edge transitions. Adds bow + stealth; magic via items only. No quest ceiling.

## Hard constraints
- Plays from `file://` — no runtime `fetch`; compiled world is committed JS.
- Zero npm at runtime and at build time (build uses only Node stdlib).
- **Modularity budgets (strict):**
  - Engine `.js` ≤ 150 lines.
  - Content `.md` ≤ 120 lines.
  - Build helper `.js` ≤ 120 lines.
  - Plan/doc `.md` ≤ 80 lines.
  - Any file nearing its cap must be split before merge.
- Token discipline: an author agent for region X loads only `_schemas/` + `_examples/` + that region's folder + `content/INDEX.json`. Never the corpus.

## Section index
- [01 Repository layout](01-repo-layout.md)
- [02 Markdown schemas](02-schemas.md)
- [03 Dialogue + quest DSLs](03-dsls.md)
- [04 Build pipeline](04-build.md)
- [05 Engine refactor sequence (T0.0 … T0.11)](05-engine-refactor.md)
- [06 Script load order](06-load-order.md)
- [07 Content tiers (T1 skeleton, T2 systems, T3 depth, T4 arcs, T5+)](07-content-tiers.md)
- [08 Token-discipline protocol](08-token-discipline.md)
- [09 Design defaults (A–I)](09-design-defaults.md)
- [10 Critical files](10-critical-files.md)
- [11 Verification](11-verification.md)
