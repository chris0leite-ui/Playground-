# Lektion 01: Namen und Objekte

> Zum Nachlesen **nach** den Übungen. Erst vorhersagen, dann lesen. → [uebungen.md](uebungen.md)

**Kernidee:** Eine Python-Variable ist kein Behälter, sondern ein **Etikett**, das an einem Objekt klebt.
`b = a` klebt ein zweites Etikett an dasselbe Objekt. Kopiert wird dabei nichts.

## Warum das für dich wichtig ist

In R gilt *copy-on-modify*: Schreibst du `b <- a` und änderst dann `b`, bekommt `b` eine eigene Kopie.
`a` bleibt unberührt, und du musst nie darüber nachdenken.
In Python musst du das. Viele subtile Bugs in ML-Code gehen genau darauf zurück: Configs, die sich
„von selbst“ ändern, oder Feature-Listen, die plötzlich eine Spalte mehr haben.

## 1a: Namen sind Etiketten

```text
a = [1, 2, 3]        a ──┐
b = a                    ├──▶ [1, 2, 3]
                     b ──┘
```

- `==` fragt: *Haben beide den gleichen Inhalt?*
- `is` fragt: *Ist es dasselbe Objekt?* In der Praxis siehst du `is` fast nur als `x is None`.

## 1b: Veränderlich und unveränderlich

| unveränderlich (immutable) | veränderlich (mutable) |
|---|---|
| `int`, `float`, `bool`, `str`, `tuple`, `None` | `list`, `dict`, `set`, die meisten eigenen Klassen |

Bei unveränderlichen Objekten ist das Etiketten-Modell harmlos: Jede „Änderung“ erzeugt ein neues Objekt.
Gefährlich wird es erst bei veränderlichen Objekten.

- Falle: `a = a + [3]` baut eine neue Liste, `a += [3]` verändert die bestehende.
- Ein Tupel ist unveränderlich, aber eine Liste *im* Tupel bleibt veränderbar.

## 1c: Lesestrategie „Verändert es, oder gibt es etwas Neues zurück?“

Stell dir diese Frage bei jedem Methodenaufruf.

| verändert das Objekt, Rückgabe `None` | gibt ein neues Objekt zurück |
|---|---|
| `liste.append(x)`, `liste.extend(...)`, `liste.sort()` | `sorted(liste)`, `liste + [x]` |
| `dict.update(...)`, `set.add(x)` | `text.strip()`, `text.upper()`, `text.replace(...)` |
| | fast alle Polars-Methoden |

Warnsignale beim Lesen:
- `x = x.sort()` → danach ist `x` gleich `None`. Bug.
- `name.strip()` ohne Zuweisung → wirkungslos. Bug oder toter Code.

## 1d: Funktionen bekommen das Objekt, keine Kopie

Beim Aufruf bekommt die Funktion ein weiteres Etikett auf **dasselbe** Objekt.
- Verändert die Funktion das Objekt (`.append`), sieht der Aufrufer die Änderung.
- Klebt die Funktion ihr Etikett um (`features = ...`), betrifft das nur sie selbst.

Eine R-Funktion kann ihre Argumente nie verändern, eine Python-Funktion schon.
Frag beim Lesen deshalb: **Hat diese Funktion Nebenwirkungen auf ihre Argumente?**

**Die berühmteste Falle** sind veränderliche Defaults wie `def f(x=[])` oder `def f(x={})`.
Der Default wird *einmal* erzeugt und dann bei jedem Aufruf geteilt. Die übliche Lösung:

```python
def log_metric(value, history=None):
    if history is None:
        history = []
    history.append(value)
    return history
```

Siehst du `=[]` oder `={}` in einer Funktionssignatur in einem PR: nachfragen.

## 1e: Bewusst kopieren

- **Flache Kopie:** `a.copy()`, `list(a)`, `dict(d)`. Neuer äußerer Container, der Inhalt wird geteilt.
- **Tiefe Kopie:** `copy.deepcopy(a)`. Alles wird rekursiv kopiert.

Typischer ML-Fall: Eine verschachtelte Config wird für ein Experiment „kopiert“ und angepasst.
Mit `.copy()` ändern sich die inneren Listen im Original mit.

## 1f: Transfer. Polars verhält sich (fast) wie R

Polars-Methoden wie `with_columns`, `filter` oder `sort` verändern den DataFrame **nicht**,
sondern geben einen neuen zurück. Es gibt wenige Ausnahmen, etwa `insert_column`.
Deshalb sieht Polars-Code fast immer so aus:

```python
df = df.with_columns(...)

# oder als Kette:
result = (
    df
    .filter(...)
    .with_columns(...)
    .group_by(...)
    .agg(...)
)
```

Die äußeren Klammern erlauben Zeilenumbrüche. Das ist Pythons Gegenstück zur R-Pipe `|>`.

**Warnsignal:** Ein Polars-Aufruf, dessen Ergebnis nicht zugewiesen wird, bewirkt nichts.

pandas ist anders: `df["neu"] = ...` verändert den DataFrame direkt. In pandas-Code gilt die
Etiketten-Logik deshalb voll.

## Merksätze

1. Eine Zuweisung kopiert nie.
2. Bei jedem Methodenaufruf fragen: Verändert es, oder gibt es etwas Neues zurück?
3. Python-Funktionen können ihre Argumente verändern, R-Funktionen nicht.
4. `def f(x=[])` ist fast immer ein Bug.
5. Polars-Methoden geben neue DataFrames zurück. Das Ergebnis muss zugewiesen werden.
