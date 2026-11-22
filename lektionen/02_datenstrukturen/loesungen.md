# Lektion 02: Lösungen. Datenstrukturen

## Häppchen 2a

**Ü1: `[70.2, 58.9]` und `[52.1, 48.3]`**
`[-2:]` = ab dem vorletzten bis zum Ende, also die letzten zwei. `[:2]` = vom Anfang bis Pfahl 2,
also die ersten zwei. Fehlt Start oder Ende, heißt das „ab Anfang“ bzw. „bis Ende“.

**Ü2: `[52.1, 70.2]` und `[48.3, 58.9]`**
`[::4]` nimmt jedes vierte Element ab Position 0, hier die erste Viertelstunde jeder Stunde.
`[1::4]` startet bei Position 1, also die zweite Viertelstunde jeder Stunde.

**Ü3: `[48.3, 61.0]`, dann `IndexError: list index out of range`**
Ein Slice über das Ende hinaus ist kein Fehler, es liefert einfach, was da ist.
Ein einzelner Index außerhalb der Liste dagegen schon. In R gäbe `x[10]` still ein `NA`.

## Häppchen 2b

**Ü4: `[52.1, 48.3, 61.0, 5]`, dann `TypeError: can only concatenate list (not "int") to list`**
`+` zwischen zwei Listen hängt sie aneinander. Liste plus Zahl ist nicht definiert.
In R würde `prices + 5` zu jedem Element 5 addieren.

**Ü5: `3 75.0 55.0`**
`len`, `max`, `sum` sind eingebaute Funktionen, die mit Listen funktionieren.
Einen `mean()` gibt es für Listen nicht eingebaut, daher `sum / len`.

**Ü6: `[50.0, 75.0]`, dann `TypeError: '>' not supported between instances of 'list' and 'int'`**
Filtern geht mit einer Comprehension. `prices > 45` ist bei Listen ein Fehler, nicht wie in R
ein logischer Vektor. `prices[prices > 45]` funktioniert in Python also nicht.

## Häppchen 2c

**Ü7: `wind`, `pv`, `load`**
Eine Schleife über ein Dict läuft über die **Schlüssel**, nicht über die Werte.
Die Reihenfolge ist die Einfügereihenfolge (garantiert seit Python 3.7).

**Ü8: `True False`**
`in` prüft bei einem Dict nur die Schlüssel. Für Werte: `12.4 in forecast.values()`.

## Häppchen 2d

**Ü9: `5 3`**
`set()` entfernt Duplikate. Ähnlich wie `unique()` in R, aber ohne Reihenfolge.

**Ü10: `['price_lag_96', 'pv_fc']` und `['temp']`**
`-` bei Sets ist die Differenzmenge: was in der ersten Menge ist, aber nicht in der zweiten.
`sorted()` macht das Ergebnis zu einer sortierten Liste, weil ein Set keine feste Reihenfolge hat.

**Ü11: `True False`**
Sets haben keine Reihenfolge, also sind beide gleich. Bei Listen zählt die Reihenfolge.

## Häppchen 2e

**Ü12: `[50, 52, 55, 61]` und `[70, 68]`**
`return a, b` gibt **ein** Tupel zurück. `morning, rest = ...` packt es in zwei Namen aus.

**Ü13: `wind: 12.4 GW` und `pv: 3.1 GW`**
`.items()` liefert Paare `(schlüssel, wert)`, die im `for` direkt ausgepackt werden.

**Ü14: `17 89.5` und `18 95.0`**
`zip` hört beim kürzesten Partner auf, **ohne Warnung**. Stunde 19 fällt still weg.

## Häppchen 2f

**Ü15: `[55.0, 45.0, 80.0]` und `[50.0, 40.0, 75.0, 5]`**
Eine Polars-`Series` rechnet elementweise wie ein R-Vektor. Nach `.to_list()` gelten wieder die
Listenregeln: `+` hängt an.

**Ü16: `{'load_fc'}` und `['wind_fc', 'pv_fc']`**
Mengendifferenz gegen `df.columns` ist ein typischer Check auf fehlende Features.
Die Comprehension wählt nur vorhandene Spalten aus und behält die Reihenfolge aus `features`.
