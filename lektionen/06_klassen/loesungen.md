# Lektion 06: Lösungen. Klassen und Objekte

## Häppchen 6a

**Ü1: `DE -5.0`**
`Position("DE", 10.0)` erzeugt ein neues Objekt und ruft dabei `__init__` auf. `self` ist dieses
neue Objekt, `self.area = area` legt ein Attribut an. Jedes Objekt hat seine eigenen Attribute.

**Ü2: `0.0`**
`p2 = p1` kopiert nicht, es klebt ein zweites Etikett an dasselbe Objekt (Lektion 01).
Eigene Klassen sind veränderlich: `p2.volume = 0.0` ändert das gemeinsame Objekt.

## Häppchen 6b

**Ü3: `800.0`, `None`, `0.0`**
`value` gibt etwas zurück und verändert nichts. `close` verändert das Objekt und gibt nichts
zurück, also `None`, wie `list.sort()`. Danach ist `volume` 0.

**Ü4: `NameError: name 'volume' is not defined. Did you mean: 'self.volume'?`**
In einer Methode gibt es `volume` nur als `self.volume`. Der Traceback hat zwei Ebenen:
Zeile 9 ruft `describe` auf, und dort in Zeile 7 passiert der Fehler. Unten steht, was schiefging.

**Ü5: `[10, -3]`**
`trades = []` steht in der **Klasse**, nicht in `__init__`. Es ist ein Klassenattribut, das sich
alle Objekte teilen. `self.trades.append` verändert diese eine Liste. Gleiche Falle wie der
veränderliche Default `history=[]`. Richtig wäre `self.trades = []` in `__init__`.

## Häppchen 6c

**Ü6: `Forecast: mean=1.8333333333333333` und `WindForecast: mean=1.8`**
`WindForecast` erbt `__init__` und `describe`, überschreibt aber `mean`. `describe` ruft
`self.mean()` auf, und `self` ist ein `WindForecast`, also wird dessen `mean` benutzt.
`type(self).__name__` ist der Klassenname des tatsächlichen Objekts.

## Häppchen 6d

**Ü7: `[60.0, 60.0, 60.0]`**
`fit` lernt etwas, speichert es im Objekt und gibt `self` zurück. Deshalb geht
`MeanModel().fit(...)` in einer Zeile. Das Attribut mit Unterstrich am Ende (`mean_`) ist in
scikit-learn die Konvention für „beim Fitten gelernt“.

**Ü8: `AttributeError: 'MeanModel' object has no attribute 'mean_'`**
`mean_` entsteht erst in `fit`. Attribute können jederzeit angelegt werden, nicht nur in `__init__`.
Vor `fit` gibt es sie nicht. scikit-learn wirft hier einen `NotFittedError`.
