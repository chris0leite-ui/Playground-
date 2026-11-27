# Lektion 04: Funktionen

> Zum Nachlesen **nach** den Übungen. Erst vorhersagen, dann lesen. → [uebungen.md](uebungen.md)

**Kernidee:** Beim Lesen eines Aufrufs zwei Fragen stellen:
*Welcher Wert landet in welchem Parameter?* und *Was kommt zurück?*

## 4a: Argumente zuordnen

```python
def make_feature(name, lag=1, scale=1.0): ...
make_feature("price", 4, scale=0.5)
#            Position  Position  Schlüsselwort
```

1. Positionsargumente der Reihe nach vergeben.
2. Schlüsselwortargumente über den Namen.
3. Was übrig ist, bekommt den Default. Fehlt ein Parameter ohne Default: `TypeError`.

Erst Positions-, dann Schlüsselwortargumente, sonst `SyntaxError`, und dann läuft gar nichts.

**R-Warnung:** R erlaubt Abkürzungen (`sc = 2` für `scale`) und wertet Argumente erst bei Gebrauch aus.
Python verlangt exakte Namen und prüft beim Aufruf.

## 4b: Rückgabe oder Ausgabe?

- `print(...)` zeigt etwas an. Das Programm kann damit nicht weiterrechnen.
- `return ...` gibt einen Wert an den Aufrufer zurück und **beendet** die Funktion.
- Ohne `return` gibt eine Funktion `None` zurück.

**R-Warnung:** In R ist der letzte Ausdruck automatisch der Rückgabewert. In Python braucht es `return`.

## 4c: `*args` und `**kwargs`

| Wo | `*name` | `**name` |
|---|---|---|
| in der Definition | sammelt Positionsargumente → Tupel | sammelt Schlüsselwortargumente → Dict |
| beim Aufruf | packt Liste/Tupel in Positionsargumente aus | packt Dict in Schlüsselwortargumente aus |

Typisch in ML-Code: `model = Model(**config["model_params"])`.
**Lesestrategie:** Bei `**kwargs` in einer Definition nachsehen, wohin `kwargs` weitergereicht wird.
Dort stehen die tatsächlich erlaubten Namen.

## 4d: Funktionen als Werte

- `f = double` ohne Klammern: `f` ist die Funktion selbst.
- `double(4)` mit Klammern: Aufruf, Ergebnis ist der Rückgabewert.
- `lambda x: x * 2` ist eine kurze Funktion ohne Namen, typisch als Argument: `sorted(..., key=lambda ...)`.

**Lesestrategie:** Klammern hinter einem Namen bedeuten „jetzt aufrufen“. Ohne Klammern wird die Funktion
nur weitergereicht.

## Tracebacks lesen (eingestreut)

- **Von unten nach oben:** letzte Zeile = *was* (`TypeError: ...`), darüber = *wo* (`line 4`).
- `SyntaxError` hat keinen Traceback: Die Datei konnte gar nicht erst starten.
