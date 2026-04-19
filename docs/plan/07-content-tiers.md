# §7 Content tiers

## T1 — Skeleton (10 Fourth-Age regions, 1 settlement + 1 NPC + 1 quest each)

1. `shire` — Hobbiton — Samwise Gamgee-the-Younger — *Missing Mathom*.
2. `bree-land` — Bree — Barliman Butterbur II — *Strangers on the Greenway*.
3. `old-forest` — Tom Bombadil's House — Goldberry — *A Wight Returns*.
4. `eriador-rivendell` — Imladris — Elrohir — *The Books of Elrond*.
5. `moria-hollin` — West-gate camp — Thorin IV — *Relight the Lamps*.
6. `lothlorien-anduin` — Caras Galadhon — Haldir's successor — *The Last Mallorn*.
7. `rohan` — Edoras — Éomer's reeve — *Hoofbeats in the Wold*.
8. `gondor-south` — Osgiliath-rebuilt — Faramir's steward — *Bridge of Stone*. (Minas Tirith persists as existing map, now a region.)
9. `dale-erebor` — Dale — Bard III — *Iron for the South*.
10. `mordor-ruin` — Watchfort at Morannon — Warden of the Black Gate — *Ash and Ember*.

Each T1 region ships only: `region.md`, `map.md` (48×48 min), 1 settlement, 1 NPC, 1 quest, and enough dialogue to start+complete it.

## T2 — Systems content
- Factions: Rangers of the North, Hobbits, Shirriffs, Bree-folk, Imladris-Elves, Galadhrim, Dwarves of Erebor, Rohirrim, Reunited Kingdom, Orc Remnant, Easterling Holdouts, Haradrim Holdouts.
- Classes: Ranger of the North, Rohirrim, Elf-Noldor, Elf-Silvan, Dwarf, Hobbit, Gondorian, Dúnadan.
- Starter items (~30): sword, bow, arrows, lembas, waybread, rope, Elven cloak, Phial (quest-gated), Dwarven rune-stone, healing herbs, quest keys.
- Spine arc **The Keeper's Errand** — 8 quests, Bree → Rivendell → Moria → Lórien → Edoras → Minas Tirith → Morannon. Starting leg depends on class.

## T3 — Depth-pass template per region
Deliverables for a "depth pass on region X":
- +3–6 settlements or landmarks · +10–20 NPCs · +5–10 side quests · +3–6 encounters · +1 region-arc or tie-ins · expanded `map.md` · region-specific items added under `content/items/` · regenerated `_index.md`.
- Complete when all validators green and `INDEX.json` updated.

## T4 — Cross-region arcs (3)
- **Rangers of the North** (6 quests) — Eriador-Rivendell → Bree-land → Shire.
- **The Lost Ring of Durin** (8 quests) — Moria-Hollin → Dale-Erebor → Lothlórien-Anduin → Gondor-south.
- **Ash of Mordor** (7 quests) — Gondor-south → Mordor-ruin → Old-Forest → class-gated finale.

## T5+ indefinite
Shard isolation: each author task touches ≤1 region folder. Schemas don't grow; novel mechanics enter via the quest step registry. Overworld stitches new regions via `overworld_pos` with zero edits to existing regions.
