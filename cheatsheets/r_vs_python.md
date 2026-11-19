# Spickzettel: R ↔ Python

⚠️ = Hier täuscht R-Intuition.

## Grundlagen

| Konzept | R | Python |
|---|---|---|
| Zuweisung | `x <- 5` | `x = 5` |
| Wahrheitswerte | `TRUE`, `FALSE` | `True`, `False` |
| Nichts / fehlend | `NULL`, `NA` | `None` (in Polars: `null`; `NaN` ist etwas anderes) |
| Typ abfragen | `class(x)` | `type(x)` |
| Länge | `length(x)` | `len(x)` |
| Hilfe | `?mean` | `help(len)` |
| Kommentar | `# ...` | `# ...`, Docstring `"""..."""` unter `def` |
| Blöcke | `{ ... }` | **Einrückung** (4 Leerzeichen) |
| Potenz ⚠️ | `2^3` → 8 | `2 ** 3` → 8 (`2 ^ 3` ist XOR → 1) |
| Ganzzahl-Division, Rest | `7 %/% 2`, `7 %% 2` | `7 // 2`, `7 % 2` |
| Logik (Skalare) | `&&`, `\|\|`, `!` | `and`, `or`, `not` |
| Logik (Spalten) | `&`, `\|`, `!` | in Polars: `&`, `\|`, `~` (Klammern setzen!) |
| String-Formatierung | `glue("Wert: {x}")` | `f"Wert: {x}"` |

## Sammlungen

| Konzept | R | Python |
|---|---|---|
| Vektor ⚠️ | `c(1, 2, 3)` | `[1, 2, 3]` ist eine **Liste**, kein Vektor: `[1, 2] * 2` → `[1, 2, 1, 2]` |
| Vektorisiert rechnen | eingebaut | erst mit Polars-Spalten oder NumPy-Arrays |
| Erstes Element ⚠️ | `x[1]` | `x[0]` |
| Letztes Element ⚠️ | `x[length(x)]` | `x[-1]` (in R entfernt `x[-1]` das erste!) |
| Bereich ⚠️ | `x[2:4]` (2. bis 4., inklusive) | `x[1:4]` (Ende **exklusiv**) |
| Benannte Liste | `list(a = 1, b = 2)` | `{"a": 1, "b": 2}` (dict) |
| Zugriff per Name | `l$a`, `l[["a"]]` | `d["a"]`, sicher: `d.get("a")` |
| Enthalten? | `"a" %in% x` | `"a" in x` |
| Zahlenfolge ⚠️ | `1:10` | `range(1, 11)` (Ende exklusiv) |

## Funktionen und Kontrollfluss

| Konzept | R | Python |
|---|---|---|
| Funktion | `f <- function(x, y = 2) { x + y }` | `def f(x, y=2):` ↵ `    return x + y` |
| Rückgabe ⚠️ | letzter Ausdruck | **explizites `return`**, sonst kommt `None` zurück |
| Anonyme Funktion | `\(x) x + 1` | `lambda x: x + 1` |
| Schleife | `for (i in 1:10) { }` | `for i in range(1, 11):` |
| Bedingung | `if (x > 0) { } else { }` | `if x > 0:` / `elif ...:` / `else:` |
| map/apply | `sapply(x, f)`, `purrr::map(x, f)` | `[f(v) for v in x]` |
| Filter | `x[x > 0]` | `[v for v in x if v > 0]` |
| Fehler werfen | `stop("...")` | `raise ValueError("...")` |
| Fehler abfangen | `tryCatch(...)` | `try:` / `except ValueError:` |

## Pakete und Objekte

| Konzept | R | Python |
|---|---|---|
| Paket laden | `library(dplyr)` | `import polars as pl` → alles mit Präfix `pl.` |
| Einzelnes laden | `dplyr::filter` | `from polars import col` |
| Pipe | `df \|> filter(...) \|> mutate(...)` | Methodenkette: `df.filter(...).with_columns(...)` |
| Funktion vs. Methode | `mean(x)`: Funktion bekommt Daten | `x.mean()`: Methode hängt am Objekt |
| Kopiersemantik ⚠️ | copy-on-modify | Referenzen: `b = a` kopiert nicht → Lektion 01 |
| Klassen | S3, S4, R6 | `class`, überall im Einsatz → Lektion 06 |
