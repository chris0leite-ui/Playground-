# Lektion 06: Klassen und Objekte

> Zum Nachlesen **nach** den Übungen. Erst vorhersagen, dann lesen. → [uebungen.md](uebungen.md)

**Kernidee:** Eine Klasse ist ein Bauplan. Ein Objekt bündelt **Daten** (Attribute) und
**Verhalten** (Methoden). `self` ist das Objekt, auf dem eine Methode gerade arbeitet.

## 6a: Klasse, Objekt, `self`

```python
class Position:                        # Bauplan
    def __init__(self, area, volume):  # läuft beim Erzeugen
        self.area = area               # Attribut am Objekt anlegen

p = Position("DE", 10.0)               # Objekt erzeugen, __init__ läuft, self = p
p.area                                 # Attribut lesen
```

- `p.methode(x)` ist dasselbe wie `Position.methode(p, x)`. Deshalb steht `self` in jeder Definition,
  aber nie im Aufruf.
- Das Etikettenmodell gilt weiter: `p2 = p1` kopiert nicht.

**R-Vergleich:** Am nächsten an R6-Klassen (`self$area`). S3/S4 funktionieren anders: Dort gehören
Methoden zu generischen Funktionen, nicht zum Objekt.

## 6b: Methoden

Dieselbe Frage wie in Lektion 01: **Verändert sie das Objekt, oder gibt sie etwas zurück?**

| Methode | verändert `self` | gibt zurück |
|---|---|---|
| `value(price)` | nein | Wert |
| `close()` | ja | `None` |
| `fit(y)` (sklearn) | ja | `self` (zum Verketten) |

**Lesestrategie:** In einer Methode alle `self.xyz =` suchen. Das sind die Stellen, die den Zustand ändern.

**Falle:** Ein veränderliches Attribut direkt in der Klasse (`trades = []`) teilen sich alle Objekte.
Pro Objekt gehört es in `__init__` (`self.trades = []`).

## 6c: Vererbung

```python
class WindForecast(Forecast):   # erbt alles von Forecast
    def mean(self):             # überschreibt eine Methode
        return round(super().mean(), 1)   # ruft die Version der Elternklasse
```

Ruft eine geerbte Methode `self.mean()` auf, gewinnt die Version der **tatsächlichen** Klasse des Objekts.
**Lesestrategie:** Bei `self.methode()` nicht nur in der aktuellen Klasse suchen, sondern auch in Unterklassen.

## 6d: Das scikit-learn-Muster

```python
model = Model(**params).fit(X_train, y_train)   # fit lernt, speichert, gibt self zurück
y_hat = model.predict(X_test)                    # predict nutzt das Gelernte
```

- Attribute mit `_` am Ende (`coef_`, `mean_`) entstehen erst in `fit`.
- Tracebacks mit mehreren Ebenen: Die **unterste** `File`-Zeile zeigt, wo der Fehler entstand, die
  oberen, über welche Aufrufe man dorthin kam.
