# Fortschritt

_Gedächtnis zwischen den Sessions. Claude aktualisiert diese Datei am Ende jeder Session._

## Aktueller Stand

- **Lektion:** 01 Namen und Objekte
- **Erledigt:** Einstufung (Ü1–Ü9)
- **Erledigt in Lektion 01:** Häppchen 1a (Ü1–Ü3 + Modify)
- **Nächstes Häppchen:** 1b (Ü4–Ü7): Veränderlich oder nicht?

### Tempo nach Einstufung

Muster: Struktur lesen klappt gut (Comprehension, Klasse, Polars). Alle Fehler kommen aus dem R-Denkmodell.

| Lektion | Tempo | Grund |
|---|---|---|
| 01 Namen und Objekte | **gründlich** | Ü2 und Ü8 falsch: Referenzsemantik unbekannt |
| 02 Datenstrukturen | **gründlich bei R-Fallen** | Ü1 (negative Indizes, Slices), Ü6 (Liste ≠ Vektor) |
| 03 Comprehensions | zügig | Ü4 auf Anhieb richtig |
| 04 Funktionen | mittel | Ü5: Positionsargumente; Defaults kommen schon in 01 |
| 06 Klassen | zügig bei Grundlagen | Ü7 inkl. `self` und Verkettung richtig |
| Phase 3 Polars | zügig | Ü9: dplyr-Wissen überträgt sich sehr gut |

## Wiederholungskarten

Box 1 = täglich · Box 2 = alle 3 Tage · Box 3 = wöchentlich

| Frage | Box | fällig |
|---|---|---|
| `x = [10, 20, 30]`: Was liefert `x[-1]`? Was würde `x[-1]` in R tun? | 1 | 2026-11-20 |
| `x = [10, 20, 30, 40, 50]`: Was liefert `x[1:3]`, und warum genau zwei Elemente? | 1 | 2026-11-21 |
| `a = [1, 2, 3]`, `b = a`, `b.append(4)`: Was ist `a`? | 1 | 2026-11-20 |
| Was gibt `d.get("x", "fehlt")` zurück, wenn `"x"` nicht im dict ist? Und `d["x"]`? | 1 | 2026-11-21 |
| Was ergibt `[1, 2, 3] * 2` in Python? Wie bekommt man `[2, 4, 6]`? | 1 | 2026-11-20 |
| `def scale(x, factor=2, offset=0)`: Welcher Parameter bekommt die `10` bei `scale(3, 10)`? | 1 | 2026-11-21 |
| Warum braucht `df.group_by(...).agg(...)` in Polars oft ein `.sort(...)` danach? | 1 | 2026-11-22 |
| Funktion oder Methode: Was ist der Unterschied, woran erkennt man es beim Lesen? | 1 | 2026-11-22 |
| `x = 10`, `y = x`, `y = y + 1`: Was ist `x`? Warum anders als bei `b.append(4)`? | 1 | 2026-11-21 |
| Was fragt `==`, was fragt `is`? Wofür benutzt man `is` in der Praxis fast ausschließlich? | 2 | 2026-11-22 |

## Stolpersteine

_Wo eine Vorhersage danebenlag. Daraus werden Wiederholungskarten._

- **2026-11-19, Ü1:** `x[-1]` als „alle außer dem ersten“ gelesen (R-Semantik). In Python ist es das letzte Element.
- **2026-11-19, Ü1:** `x[1:3]` als „Elemente 2 bis 4“ gelesen. Richtig: Position 1 und 2, das Ende ist exklusiv.
- **2026-11-19, Ü2:** `b = a` als Kopie verstanden (R: copy-on-modify). → Kernthema von Lektion 01.
- **2026-11-19, Ü3:** zweites Argument von `.get()` unbekannt (geraten: „leer“).
- **2026-11-19, Ü5:** `scale(3, 10)` → 16 statt 30. Zweites Positionsargument `offset` statt `factor` zugeordnet.
- **2026-11-19, Ü6:** `[1, 2, 3] * 2` als vektorisierte Multiplikation gelesen (R-Vektor). Liste wird aber wiederholt.
- **2026-11-19, Ü8:** Veränderlicher Default `bucket=[]`: erwartet `['a']`, `['b']`, tatsächlich `['a']`, `['a', 'b']`. → Lektion 01, Häppchen 1d.
- **2026-11-19, L01 Ü2:** `11 11` erwartet. `y = x` richtig als Referenz erkannt, aber `y = y + 1` als Änderung des gemeinsamen Objekts gelesen. Tatsächlich: neues Objekt, Etikett umgeklebt.
- **2026-11-19, Ü8:** `add_item` als „Methode“ bezeichnet. Es ist eine Funktion. Methode = Funktion an einem Objekt, `obj.methode()`.

## Beobachtungen

- Data Science Team Lead, R-Hintergrund, Grundkenntnisse in Python.
- Berufsfeld: kurzfristiger Stromhandel. Abschlussprojekt in dieser Domäne (Phase 5).
- Stack: Polars. PyTorch bewusst gestrichen.
- Code läuft nur über Claude. Übt täglich ein bisschen, ohne festen Plan.
- `x[1]` → 20 richtig: 0-basierte Indizes sind bekannt. Negative Indizes und Slices noch R-geprägt.
- Referenzsemantik (`b = a`) noch unbekannt. Lektion 01 gründlich durchgehen.
- Rät offen und sagt, wenn es geraten ist. Gut so, weiter ermutigen.
- List Comprehension (Ü4) auf Anhieb richtig gelesen.
- Denkt mathematisch („affin lineare Funktion“). Mathematische Analogien nutzen.
- Möchte bei Auflösungen die Aufgabe noch einmal sehen.
- Sagt „b zeigt auf a“. Präziser: Namen zeigen immer auf Objekte, nie auf andere Namen. Darauf achten.

## Sessionlog

| Datum | Was | Notizen |
|---|---|---|
| 2026-11-19 | Repo neu aufgesetzt, Lernpfad festgelegt | Polars-Fokus, täglich kurz |
| 2026-11-19 | PyTorch gestrichen, Phase 5 Stromhandel ergänzt, `main` angelegt | |
| 2026-11-19 | Einstufung Block A: Ü1 und Ü3 teilweise richtig, Ü2 falsch | R-Fallen bei `x[-1]`, Slices, `b = a` |
| 2026-11-19 | Einstufung Block B: Ü4 richtig, Ü5 zwei von drei, Ü6 falsch | Positionsargumente, Liste ≠ Vektor |
| 2026-11-19 | Einstufung Block C: Ü7 und Ü9 richtig, Ü8 falsch. Einstufung abgeschlossen | Tempo festgelegt, siehe oben |
| 2026-11-19 | Lernstand auf den Standard-Branch übertragen (Spiel-Branch überschrieben) | Neue Sessions starten jetzt direkt hier |
| 2026-11-19 | Lektion 01 gestartet, 1a: Ü1 richtig, Ü2 falsch (`11 11`) | Zuweisung vs. Veränderung |
| 2026-11-19 | 1a Modify (`b = [9, 9]`): richtig | Regel „Zuweisung klebt um“ sitzt |
| 2026-11-19 | 1a Ü3 (`==` vs. `is`): richtig, sehr klar begründet. Häppchen 1a abgeschlossen | Etiketten-Modell sitzt |
