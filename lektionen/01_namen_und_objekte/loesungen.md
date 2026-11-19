# Lektion 01: Lösungen. Namen und Objekte

## Häppchen 1a

**Ü1: `[1, 2, 3, 4]`**
`b = a` klebt ein zweites Etikett an *dieselbe* Liste. `b.append(4)` verändert diese Liste,
also sieht man die Änderung auch über `a`. In R bliebe `a` unverändert.

**Ü2: `10 11`**
Zahlen sind unveränderlich. `y + 1` erzeugt ein **neues** Objekt `11`, und `y` wird darauf umgeklebt.
`x` zeigt weiter auf `10`.

**Ü3: `True False True`**
`a == c`: gleicher Inhalt → `True`. `a is c`: zwei verschiedene Listen → `False`.
`a is b`: dasselbe Objekt → `True`.

## Häppchen 1b

**Ü4: `[1, 2]`**
`a + [3]` baut eine **neue** Liste, und `a` wird darauf umgeklebt. `b` zeigt noch auf die alte.

**Ü5: `[1, 2, 3]`**
Falle: `+=` verändert eine Liste **in-place** (wie `a.extend([3])`). `b` sieht die Änderung.
Bei Zahlen und Strings verhält sich `+=` dagegen wie `x = x + ...`.

**Ü6: `('adam', [0.01, 0.001, 0.0001])`**
Das Tupel selbst ist unveränderlich, aber nur das, *worauf* es zeigt. Die Liste darin bleibt veränderbar.

**Ü7: `TypeError: 'tuple' object does not support item assignment`**
Ein Tupel-Platz lässt sich nicht neu belegen. Fehlermeldungen liest man von **unten nach oben**:
Die letzte Zeile sagt, *was* schiefging, darüber steht, *wo* (`line 2`).

## Häppchen 1c

**Ü8: `[0.7, 0.9, 0.8]` und `[0.7, 0.8, 0.9]`**
`sorted()` gibt eine **neue**, sortierte Liste zurück. Das Original bleibt, wie es war.

**Ü9: `[0.7, 0.8, 0.9]` und `None`**
`.sort()` sortiert **in-place** und gibt `None` zurück. `ranked = scores.sort()` ist ein klassischer Bug.

**Ü10: `[  churn_model  ]`**
Strings sind unveränderlich. `.strip()` gibt einen neuen String zurück, der hier weggeworfen wird.
Richtig wäre `name = name.strip()`.

## Häppchen 1d

**Ü11: `3 ['age', 'income', 'bias']`**
Die Funktion bekommt *dieselbe* Liste wie der Aufrufer und verändert sie. Das ist eine **Nebenwirkung**:
`cols` ist nach dem Aufruf anders, obwohl das nirgends zugewiesen wird.

**Ü12: `3 ['age', 'income']`**
`features = features + [...]` klebt nur das *lokale* Etikett um. Die Liste des Aufrufers bleibt unberührt.

**Ü13: `[0.5]` und `[0.5, 0.7]`**
Der Default `history=[]` wird **einmal** beim Definieren erzeugt und bei jedem Aufruf wiederverwendet.
So bleiben Werte von früheren Aufrufen „hängen“.

## Häppchen 1e

**Ü14: `[1, 2, 3] [1, 2, 3, 4]`**
`.copy()` erzeugt eine neue Liste. Jetzt sind es zwei unabhängige Objekte.

**Ü15: `{'lr': [0.1, 0.01, 0.001], 'depth': [3, 5]}`**
`.copy()` ist eine **flache** Kopie: neues dict, aber die Listen darin werden geteilt.
- `grid2["lr"].append(...)` verändert die *geteilte* Liste → auch `grid` ist betroffen.
- `grid2["depth"] = [7]` belegt nur einen Platz im *neuen* dict neu → `grid` bleibt unberührt.

Abhilfe: `copy.deepcopy(grid)`.

## Häppchen 1f

**Ü16: `['x']`**
`with_columns` verändert `df` nicht, sondern gibt einen neuen DataFrame zurück, der hier verloren geht.

**Ü17: `['x'] ['x', 'x10']`**
Erst durch die Zuweisung an `df2` wird das Ergebnis aufbewahrt. `df` bleibt unverändert, genau wie in R.

**Ü18: `[3, 1, 2] [2, 3]`**
Jeder Schritt der Kette erzeugt einen neuen DataFrame: `sort` → neuer DataFrame, darauf `filter` → noch einer.
Das Original `df` wird nie angefasst.
