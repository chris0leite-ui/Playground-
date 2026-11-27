# Lektion 04: Lösungen. Funktionen

## Häppchen 4a

**Ü1: `price_lag1_x2.0` und `price_lag4_x0.5`**
Schlüsselwortargumente (`scale=2.0`) werden über den Namen zugeordnet, die übrigen behalten ihren Default.
Positionsargumente werden der Reihe nach vergeben: `"price"` → `name`, `4` → `lag`, `0.5` → `scale`.

**Ü2: nur `SyntaxError: positional argument follows keyword argument`**
Auch die erste Zeile wird **nicht** ausgegeben: Python prüft die Syntax der ganzen Datei, bevor
irgendetwas läuft. Regel: erst alle Positionsargumente, dann die Schlüsselwortargumente.
Ein `SyntaxError` hat keinen `Traceback`, nur Datei, Zeile und ein `^` an der Fundstelle.

**Ü3: `TypeError: make_feature() missing 1 required positional argument: 'name'`**
`name` hat keinen Default und ist damit Pflicht. Anders als in R gibt es den Fehler sofort beim
Aufruf, nicht erst, wenn `name` benutzt wird (R wertet Argumente „lazy“ aus).

## Häppchen 4b

**Ü4: `60.0` und `None`**
`print` in der Funktion gibt aus, aber die Funktion hat kein `return`. Ohne `return` gibt jede
Funktion `None` zurück. In R ist der letzte Ausdruck automatisch der Rückgabewert, in Python nicht.

**Ü5: `['negative', 'spike', 'normal', 'normal']`**
`return` beendet die Funktion sofort. Die folgenden `if` werden nicht mehr geprüft.
`100.0` ist nicht `> 100`, also `normal`.

## Häppchen 4c

**Ü6: `<class 'tuple'> (10, 20, 5)` und `35`**
`*volumes` sammelt beliebig viele Positionsargumente in einem **Tupel**.

**Ü7: `lgbm {'lr': 0.1, 'depth': 5}`**
`**params` sammelt beliebig viele Schlüsselwortargumente in einem **Dict**.
Entspricht grob `...` in R, nur nach Art getrennt.

**Ü8: `lgbm: lr=0.1, depth=5` und `ridge: lr=0.5, depth=3`**
Beim **Aufruf** ist es umgekehrt: `**config` packt ein Dict in Schlüsselwortargumente aus,
`*args` eine Liste in Positionsargumente. `depth` fehlt in `args` und bekommt den Default `3`.

## Häppchen 4d

**Ü9: `42 8`**
`f = double` (ohne Klammern) klebt ein zweites Etikett an die **Funktion**. `f(21)` ruft sie auf.
`g = double(4)` (mit Klammern) ruft sie sofort auf, `g` bekommt das **Ergebnis** `8`.

**Ü10: `['DE', 'AT', 'FR']`**
`sorted` über ein Dict sortiert die Schlüssel. `key=` bekommt eine Funktion, die für jeden
Schlüssel den Sortierwert liefert, hier den Preis. `lambda a: prices[a]` ist eine Funktion ohne Namen.
