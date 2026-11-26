# Lektion 03: Lösungen. Comprehensions

## Häppchen 3a

**Ü1: `[50.0, 75.0]` und `[50.0, 0.0, 75.0, 0.0]`**
`if` **hinter** dem `for` filtert: Elemente fallen weg, die Liste wird kürzer.
`... if ... else ...` **vor** dem `for` ersetzt: Jedes Element bleibt, nur sein Wert wird gewählt.
Die Länge bleibt gleich. Das entspricht `ifelse(p > 0, p, 0)` in R.

**Ü2: `95.0` und `{'FR': 95.0, 'AT': 91.2}`**
Geschweifte Klammern mit `schlüssel: wert` vor dem `for` bauen ein Dict.
`zip` liefert die Paare, `.items()` ebenso. Der Filter `if p > 90` wirkt wie in einer Listen-Comprehension.

**Ü3: `['price_h17_q1', 'price_h17_q2', 'price_h18_q1', 'price_h18_q2']`**
Zwei `for` werden von **links nach rechts** gelesen wie verschachtelte Schleifen:
Das linke `for` ist die äußere Schleife, das rechte läuft für jedes `h` komplett durch.
`range(1, 3)` liefert `1, 2`: Das Ende ist exklusiv wie beim Slice.

**Ü4: `True 125.0`**
Ohne eckige Klammern ist es ein **Generator-Ausdruck**: Die Werte werden einzeln an `any` bzw. `sum`
übergeben, ohne Zwischenliste. `any` fragt: „Ist mindestens einer wahr?“ (R: `any()`).
