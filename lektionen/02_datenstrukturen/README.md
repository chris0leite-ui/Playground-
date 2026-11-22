# Lektion 02: Datenstrukturen

> Zum Nachlesen **nach** den Übungen. Erst vorhersagen, dann lesen. → [uebungen.md](uebungen.md)

**Kernidee:** Python hat vier eingebaute Sammlungen, und keine davon ist ein R-Vektor.
Elementweises Rechnen gibt es erst mit Polars (oder NumPy).

| Typ | Schreibweise | geordnet | veränderlich | Duplikate | typischer Einsatz |
|---|---|---|---|---|---|
| `list` | `[1, 2]` | ja | ja | ja | Feature-Listen, Werte sammeln |
| `tuple` | `(1, 2)` | ja | nein | ja | mehrere Rückgabewerte, feste Paare |
| `dict` | `{"a": 1}` | Einfügereihenfolge | ja | Schlüssel nein | Configs, Zuordnungen |
| `set` | `{1, 2}` | nein | ja | nein | Duplikate entfernen, Spalten vergleichen |

## 2a: Slices

```text
 Pfahl:   0     1     2     3     4     5     6
          | 52.1| 48.3| 61.0| 75.4| 70.2| 58.9|
 negativ: -6    -5    -4    -3    -2    -1
```

- `x[a:b]`: von Pfahl `a` bis Pfahl `b`, also `b - a` Elemente.
- Fehlt `a` oder `b`: ab Anfang bzw. bis Ende. `x[-2:]` = die letzten zwei.
- `x[a:b:step]`: jedes `step`-te Element. Bei Viertelstunden: `x[::4]` = erste Viertelstunde je Stunde.
- Ein Slice über das Ende hinaus ist kein Fehler. Ein **Index** außerhalb schon (`IndexError`).

**R-Warnung:** `x[10]` gibt in R still `NA`, in Python einen Fehler.

## 2b: Eine Liste ist kein Vektor

| Ausdruck | R (Vektor) | Python (Liste) |
|---|---|---|
| `x + 5` | zu jedem Element 5 | `TypeError` |
| `x + y` | elementweise Summe | aneinanderhängen |
| `x * 2` | jedes Element mal 2 | Liste wiederholen |
| `x > 45` | logischer Vektor | `TypeError` |
| `x[x > 45]` | filtern | `TypeError` |

Python-Weg für Listen: Comprehension, z. B. `[p for p in prices if p > 45]` oder `[p * 2 for p in prices]`.
Eingebaut sind `len()`, `sum()`, `min()`, `max()`, `sorted()`. Kein `mean()`.

## 2c: Dictionaries

- Schleife `for k in d` läuft über die **Schlüssel**.
- `in` prüft nur Schlüssel. Für Werte: `d.values()`.
- `d["x"]` wirft `KeyError`, wenn der Schlüssel fehlt. `d.get("x")` gibt `None`, `d.get("x", ersatz)` den Ersatz.

**R-Warnung:** Bei einem benannten R-Vektor `for (v in x)` bekommst du die **Werte**. Beim Dict die Namen.

## 2d: Sets

- `set(liste)` entfernt Duplikate. Die Reihenfolge geht dabei verloren.
- `a - b`: in `a`, aber nicht in `b` (wie `setdiff(a, b)` in R).
- Außerdem `a & b` (Schnittmenge, `intersect`) und `a | b` (Vereinigung, `union`).
- Typisch in ML-Code: `missing = set(features) - set(df.columns)`.

## 2e: Tupel auspacken

```python
train, test = split(df)            # Funktion gibt ein Tupel zurück
for name, value in d.items():      # Paare aus einem Dict
for h, p in zip(hours, prices):    # zwei Listen parallel
```

**Lesestrategie:** Steht links vom `=` mehr als ein Name, wird ausgepackt.
Die Anzahl der Namen muss zur Anzahl der Elemente passen.

**Falle:** `zip` hört beim kürzesten Partner auf, ohne Warnung. In R würde recycelt oder gewarnt.
Seit Python 3.10 erzwingt `zip(a, b, strict=True)` gleiche Längen.

## 2f: Transfer zu Polars

- Eine Polars-`Series` (`df["price"]`) verhält sich wie ein R-Vektor: `df["price"] + 5` rechnet elementweise.
- `df.columns` ist eine normale Python-Liste. Damit gelten Listen- und Set-Regeln.
- Nach `.to_list()` ist es wieder eine Liste, und `+` hängt an.

**Lesestrategie:** Bei jedem `+`, `*` oder `>` fragen: *Ist das eine Liste oder eine Series?*
Davon hängt ab, ob elementweise gerechnet oder aneinandergehängt wird.
