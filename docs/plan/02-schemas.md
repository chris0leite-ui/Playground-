# §2 Markdown schemas

Every file: YAML-subset frontmatter between `---` fences, then markdown body. IDs are `[a-z0-9][a-z0-9-]*`, unique within their type. Cross-references use `<type>:<id>` strings (e.g. `npc:halbarad-ii`). Unknown top-level keys = build error. Type is derived from **path**, not frontmatter.

## YAML subset
Scalars (string/int/float/bool/null), flow arrays `[a,b]`, flow maps `{a:1,b:2}`, block lists, one level of block maps. No anchors, no multi-doc. Our parser (~120 LOC, pure Node) rejects anything else.

## Required fields per type
- **region**: `id, name, tilemap, neighbors{N,S,E,W,NE,NW,SE,SW}`. *opt: parent, climate, era, tone, factions_present, spawn_point{x,y}, overworld_pos{x,y}.*
- **settlement**: `id, region, name, type(village|town|city|fort|ruin|camp), faction`. *opt: population, ruler, notable_buildings, tile_region{x,y,w,h}.*
- **building**: `id, settlement|region, type, name`. *opt: owner_npc, services[], inventory_for_sale[], interior_map, entrance{x,y}.*
- **npc**: `id, name, location(region:id|building:id), faction, role`. *opt: class, disposition, dialogue, quest_hooks[], stats, spawn_conditions, spawn_pos, inventory.*
- **dialogue**: `id, speaker`. *opt: default_node (=`start`).* Body = dialogue DSL (§3).
- **quest**: `id, title, giver, summary`. *opt: prerequisites, rewards, classes_eligible, arc.* Body = steps DSL (§3).
- **item**: `id, name, type, slot`. *opt: stats, lore, rarity, crafted_by, where_found, icon_color.*
- **faction**: `id, name, banner_color`. *opt: rep_tiers[], allies[], enemies[], territories[].*
- **class**: `id, name, stats{hp,atk,def,speed,sight}`. *opt: starting_inventory, starting_region, starting_pos, signature_ability, can_use{melee,bow,magic_items}, lore.*
- **arc**: `id, title, summary, quests_in_order[]`. *opt: regions[], classes_eligible[], introduced_by, reward_capstone.*
- **encounter**: `id, region, trigger(on_enter_region|on_reach|on_interval|on_flag), enemies[]`. *opt: loot_table[], narrative, once, classes_affected, type(scatter|fixed).*
- **tilemap** (`map.md`): `id, size{w,h}`. *opt: legend_overrides{glyph→{tile,subtype}}.* Body = fenced ```tilemap block of ascii.

Each type gets its own `content/_schemas/<type>.md` plus `_examples/<type>.example.md`. Agents load these at task start.
