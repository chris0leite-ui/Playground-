# Lektion 00: Lösungen zur Einstufung

Jede Lösung nennt die Lektion, in der das Thema ausführlich drankommt.

### Ü1: `20 50 [20, 30]`
Python zählt ab **0**: `x[1]` ist das *zweite* Element. `x[-1]` ist das letzte.
Achtung, R-Falle: In R entfernt `x[-1]` das erste Element.
`x[1:3]` nimmt Position 1 und 2, **das Ende ist nicht eingeschlossen**. → Lektion 02

### Ü2: `[1, 2, 3, 4]`
`b = a` kopiert nichts. Beide Namen zeigen auf *dieselbe* Liste.
In R (copy-on-modify) bliebe `a` unverändert. → Lektion 01

### Ü3: `3 fehlt`
Ein `dict` ist wie eine benannte Liste in R. `.get(key, default)` liefert den Default,
wenn der Schlüssel fehlt, statt einen Fehler zu werfen. → Lektion 02

### Ü4: `[20, 40, 60]`
List Comprehension: „für jedes `n` in `nums`, falls `n` gerade, nimm `n * 10`“.
In R schriebe man `nums[nums %% 2 == 0] * 10`. → Lektion 03

### Ü5: `6 7 30`
`scale(3)` nutzt beide Defaults. `offset=1` ist ein benanntes Argument.
`scale(3, 10)` setzt `factor` über die Position. → Lektion 04

### Ü6: `[1, 2, 3, 1, 2, 3]`
R-Falle! Python-Listen sind **keine Vektoren**. `* 2` wiederholt die Liste, `+` hängt Listen aneinander.
Vektorisiert rechnen erst NumPy-Arrays und Polars-Spalten. → Lektion 02

### Ü7: `6`
`add` verändert `self.n` und gibt `self` zurück. Deshalb lassen sich Aufrufe verketten:
`c.add()` macht `n = 1`, `.add(5)` macht `n = 6`. Polars-Ketten wie `df.filter(...).sort(...)`
sehen genauso aus, geben aber jedes Mal ein *neues* Objekt zurück. → Lektionen 01 und 06

### Ü8: `['a']`, dann `['a', 'b']`
Die berühmteste Python-Falle: Der Default `bucket=[]` wird **einmal** beim Definieren
der Funktion erzeugt und danach bei jedem Aufruf wiederverwendet. → Lektion 01

### Ü9: Tabelle mit `a → 4`, `b → 2`
```
shape: (2, 2)
┌──────┬─────┐
│ team ┆ val │
│ ---  ┆ --- │
│ str  ┆ i64 │
╞══════╪═════╡
│ a    ┆ 4   │
│ b    ┆ 2   │
└──────┴─────┘
```
Entspricht `df |> group_by(team) |> summarise(val = sum(val)) |> arrange(team)`.
Unter dem Spaltennamen steht der Datentyp (`i64` = 64-Bit-Ganzzahl). → Lektion 10

## Auswertung (für Claude)

- Ü1–Ü3 richtig → Phase-1-Grundlagen zügig, Fokus auf R-Fallen.
- Ü2 oder Ü6 falsch → R-Intuition prägt noch stark. Lektion 01 und 02 gründlich.
- Ü7–Ü8 richtig → Lektion 04 kann kurz ausfallen.
- Ü9 richtig → dplyr-Wissen überträgt sich gut. In Phase 3 mehr Tempo möglich.
