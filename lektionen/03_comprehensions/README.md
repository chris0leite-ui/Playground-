# Lektion 03: Comprehensions

> Zum Nachlesen **nach** den Übungen. Erst vorhersagen, dann lesen. → [uebungen.md](uebungen.md)

**Kernidee:** Eine Comprehension ist eine Schleife in einer Zeile. Man liest sie am besten
**vom `for` aus**: Erst woher die Werte kommen, dann was mit ihnen passiert.

## Lesereihenfolge

```text
[ p * 2      for p in prices      if p > 0 ]
  3. Ergebnis  1. woher?            2. Filter
```

## Die Formen

| Form | Ergebnis | Beispiel |
|---|---|---|
| `[... for ...]` | Liste | `[p * 2 for p in prices]` |
| `{k: v for ...}` | Dict | `{a: p for a, p in zip(areas, prices)}` |
| `{... for ...}` | Set | `{c.split("_")[0] for c in cols}` |
| `(... for ...)` oder ohne Klammern in einer Funktion | Generator | `sum(p for p in prices)` |

## Zwei `if`, zwei Bedeutungen

- `[p for p in prices if p > 0]`: **Filter**, das Ergebnis kann kürzer sein.
- `[p if p > 0 else 0.0 for p in prices]`: **Ersetzen**, gleiche Länge (R: `ifelse`).

**Lesestrategie:** Steht das `if` hinter dem `for`, wird gefiltert. Steht es davor (mit `else`), wird ersetzt.

## Mehrere `for`

```python
[f"{h}_{q}" for h in hours for q in quarters]
```
Von links nach rechts wie verschachtelte Schleifen lesen: `h` außen, `q` innen.
Ab zwei `for` plus Filter ist eine normale Schleife meist lesbarer. Im Review darf man das anmerken.

## Wo du das siehst

- Spalten auswählen: `[c for c in df.columns if c.startswith("wind")]`
- Feature-Namen erzeugen: `[f"price_lag_{k}" for k in (1, 4, 96)]`
- Checks: `any(df[c].null_count() > 0 for c in features)`
