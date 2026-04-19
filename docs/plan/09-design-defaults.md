# §9 Design defaults

Applied unilaterally; each is easy to revisit later.

- **A — Interiors = sub-regions.** Door tile `+` → `loadRegion("<region>.<building>")` onto an auto-generated interior map.
- **B — Save versioning = reject-incompatible.** `W.schemaVersion` bumped on breaking schema changes; `_manifest.js` keeps `compatible_prior_versions: [...]`.
- **C — Pre-commit hook = no.** A `node build.js --check` step is recommended but not enforced via git hooks.
- **D — Time-of-day = reserved now, implemented in T2.** Field `spawn_conditions.time_of_day` valid today; engine clock added with faction/class content.
- **E — Dense enemy fill** = `encounter.type: scatter` generates N enemies in a region bbox at load.
- **F — Class choice** = start screen → load `class.starting_region` at `class.starting_pos`.
- **G — Fast-travel** = free after first on-foot visit (flag per region).
- **H — Combat math** = keep existing numbers through T0; retune in T2 against class stats.
- **I — Multi-tile entities** = no. Everything is point + `{w,h}` bbox.
