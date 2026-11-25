# Python lesen lernen

Ein Lernpfad, um Python-Code, besonders ML-Code, lesen und verstehen zu können.
Tutor: Claude. Methode: **vorhersagen → ausführen → verstehen**.

## So funktioniert's

Starte eine neue Session in diesem Repo und sag einfach **„weiter“**. Claude

1. fragt 1–3 Wiederholungskarten ab,
2. zeigt dir ein Stück Code, und du sagst voraus, was passiert,
3. führt den Code aus und bespricht mit dir, wo deine Vorhersage abwich,
4. hält deinen Fortschritt in [`PROGRESS.md`](PROGRESS.md) fest.

Ein Häppchen dauert 10–15 Minuten. Jeden Tag ein kleines Häppchen bringt mehr als einmal pro Woche drei Stunden.
Du kannst jederzeit eigenen Code mitbringen: „Erklär mir, was diese Funktion macht.“

## Lernpfad

⬜ offen · 🟡 läuft · ✅ abgeschlossen

### Phase 1: Fundament. Wie Python denkt

| # | Lektion | Status |
|---|---|---|
| 00 | [Einstufung: Was kann ich schon?](lektionen/00_einstufung/uebungen.md) | ✅ |
| 01 | [Namen und Objekte: Warum `b = a` keine Kopie ist](lektionen/01_namen_und_objekte/) | ✅ |
| 02 | [Datenstrukturen: list, tuple, dict, set (und wo R-Vektoren geblieben sind)](lektionen/02_datenstrukturen/) | 🟡 |
| 03 | Kontrollfluss und Comprehensions | ⬜ |
| 04 | Funktionen: Argumente, Defaults, `*args`/`**kwargs`, `lambda` | ⬜ |
| 05 | Fehlermeldungen (Tracebacks) lesen (keine eigene Lektion, wird in die anderen eingestreut) | ⬜ |

### Phase 2: Struktur. Wie Code zusammenhängt

| # | Lektion | Status |
|---|---|---|
| 06 | Klassen und Objekte: `self`, `__init__`, Methoden, Vererbung | ⬜ |
| 07 | Module, Imports, Pakete | ⬜ |
| 08 | Type Hints und Dataclasses | ⬜ |
| 09 | Decorators, Context Manager (`with`), Generatoren | ⬜ |

### Phase 3: Polars

| # | Lektion | Status |
|---|---|---|
| 10 | Polars aus dplyr-Sicht: DataFrame, Series, Expressions | ⬜ |
| 11 | In Expressions denken: `select`, `with_columns`, `filter`, `group_by`/`agg`, `when`/`then` | ⬜ |
| 12 | Lazy API: `LazyFrame`, `scan_*`, `collect`, Query-Plan lesen | ⬜ |
| 13 | Joins, Reshaping, Fensterfunktionen (`over`) | ⬜ |
| 14 | Zeitreihen: Datetime, Zeitzonen und Zeitumstellung, `group_by_dynamic`, `join_asof` | ⬜ |
| 15 | Polars in ML-Pipelines: Feature Engineering, Übergabe an Modelle | ⬜ |

### Phase 4: Projekte lesen

| # | Lektion | Status |
|---|---|---|
| 16 | Projektaufbau: `pyproject.toml`, `src`-Layout, Einstiegspunkte, Config | ⬜ |
| 17 | Sich in fremdem Code orientieren: Aufrufketten verfolgen | ⬜ |
| 18 | Tests lesen (pytest) | ⬜ |
| 19 | KI-generierten Code reviewen: typische Fehlerbilder | ⬜ |

### Phase 5: Anwendung. ML-Projekt zum kurzfristigen Stromhandel

Ein durchgängiges Projekt aus deinem Berufsfeld, zum Beispiel eine Preisprognose für Day-Ahead
oder Intraday: Daten laden, Features bauen (Last, Wind- und PV-Prognosen, Kalender), Modell
trainieren, auswerten. Den genauen Zuschnitt legen wir gemeinsam fest, wenn es so weit ist.
Das Übungsprojekt aus Phase 2–4 spielt schon in dieser Domäne (mit synthetischen Daten).

Lektionen werden erst kurz vor ihrem Einsatz geschrieben, damit sie zu deinem Stand passen.

## Ordner

| Pfad | Inhalt |
|---|---|
| `lektionen/` | Pro Lektion: `README.md` zum Nachlesen, `uebungen.md`, `loesungen.md` |
| `cheatsheets/` | [R ↔ Python](cheatsheets/r_vs_python.md), [dplyr ↔ Polars](cheatsheets/dplyr_vs_polars.md) |
| `tools/snippet.py` | Führt Übungen genau so aus, wie sie in der Datei stehen |
| `PROGRESS.md` | Stand, Wiederholungskarten, Stolpersteine, Sessionlog |
| `CLAUDE.md` | Anweisungen an Claude als Tutor |
