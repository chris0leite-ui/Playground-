# §8 Token-discipline protocol

## Region-author agent loads EXACTLY:
- `content/_schemas/*.md`
- `content/_schemas/_examples/*.md`
- `content/INDEX.json`
- `content/regions/<id>/` (whole folder)

It NEVER loads: other regions' folders, compiled `js/world/*.js`, engine source.

## Coordinator responsibilities
- Pick next region/arc/depth-pass.
- Dispatch sub-agent with a sharply scoped prompt (template below).
- Run `node build.js` after; feed validator errors back.
- Regenerate indexes (build.js does this).

## Delegate responsibilities
- Reads only files listed in its prompt.
- Writes only within its declared scope.
- Returns a summary of IDs introduced.

## Prompt template (fill-in)

```
Task: Author region "<id>" at tier <T1|depth-pass>.
Load EXACTLY these files (no others):
- content/_schemas/*.md
- content/_schemas/_examples/*.md
- content/INDEX.json
- content/regions/<id>/ (entire folder)
Produce: <tier deliverables from §7>.
Constraints:
- All IDs kebab-case.
- All cross-references must resolve against INDEX.json.
- No engine changes.
- Tilemap between 48x48 and 96x96.
- Every .md file ≤ 120 lines — split if larger.
```
