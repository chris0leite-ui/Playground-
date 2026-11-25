# Fortschritt

_Gedächtnis zwischen den Sessions. Claude aktualisiert diese Datei am Ende jeder Session._

## Aktueller Stand

- **Lektion:** 02 Datenstrukturen (Tempo: gründlich bei R-Fallen)
- **Erledigt:** Einstufung (Ü1–Ü9)
- **Erledigt in Lektion 01:** Häppchen 1a (Ü1–Ü3 + Modify), 1b (Ü4–Ü7 + Transfer), 1c (Ü8–Ü10 + 2× Modify), 1d (Ü11–Ü13 + Modify), 1e (Ü14–Ü15 + Modify + Transfer), 1f (Ü16–Ü18). **Lektion 01 abgeschlossen.**
- **Erledigt in Lektion 02:** 2a (Ü1–Ü3 + Modify), 2b (Ü4–Ü6), 2c (Ü7–Ü8 + Modify), 2d (Ü9–Ü11)
- **Nächstes Häppchen:** 2e (Ü12–Ü14): Tupel auspacken.
- **Tempo (vereinbart 2026-11-25):** 03 auf ein Häppchen straffen, 05 nicht als eigene Lektion, sondern in andere Lektionen einstreuen; 04 gründlich. Ziel: in ~2 Wochen Phase 2 (Klassen, Übungsprojekt). Lektion 02 hat 2a–2f (Ü1–Ü16)

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
| `x = [10, 20, 30]`: Was liefert `x[-1]`? Was würde `x[-1]` in R tun? | 2 | 2026-11-23 |
| `x = [10, 20, 30, 40, 50]`: Was liefert `x[1:3]`? Begründe die Anzahl der Elemente. | 2 | 2026-11-25 |
| `a = [1, 2, 3]`, `b = a`, `b.append(4)`: Was ist `a`? | 1 | 2026-11-21 |
| Was gibt `d.get("x", "fehlt")` zurück, wenn `"x"` nicht im dict ist? Und `d["x"]`? | 1 | 2026-11-23 |
| Was ergibt `[1, 2, 3] * 2` in Python? Wie bekommt man `[2, 4, 6]`? | 2 | 2026-11-23 |
| `def scale(x, factor=2, offset=0)`: Welcher Parameter bekommt die `10` bei `scale(3, 10)`? | 2 | 2026-11-25 |
| Warum braucht `df.group_by(...).agg(...)` in Polars oft ein `.sort(...)` danach? | 1 | 2026-11-22 |
| Funktion oder Methode: Was ist der Unterschied, woran erkennt man es beim Lesen? | 1 | 2026-11-22 |
| `x = 10`, `y = x`, `y = y + 1`: Was ist `x`? Warum anders als bei `b.append(4)`? | 1 | 2026-11-21 |
| Bei Listen: Was ist der Unterschied zwischen `a = a + [3]` und `a += [3]`? Und bei Zahlen? | 2 | 2026-11-23 |
| Eine Funktion endet. Was verschwindet: der lokale Name, das Objekt, oder beides? | 1 | 2026-11-21 |
| `t = ("a", [1])`: Was passiert bei `t[1].append(2)`, was bei `t[0] = "b"`? | 1 | 2026-11-22 |
| `sorted(x)` vs. `x.sort()`: Was verändert sich, was wird jeweils zurückgegeben? | 1 | 2026-11-26 |
| `name.strip()` steht allein in einer Zeile. Was passiert mit `name`, und warum? | 2 | 2026-11-28 |
| Warum schreibt man `def f(x, history=None)` statt `history=[]`? Wann wird der Default erzeugt? | 1 | 2026-11-21 |
| Kann eine Funktion ein übergebenes Objekt außen sichtbar verändern? Und in R? | 1 | 2026-11-21 |
| `grid2 = grid.copy()`, dann `grid2["lr"].append(0.1)`: Ändert sich `grid`? Und bei `grid2["lr"] = [0.1]`? | 2 | 2026-11-28 |
| Was macht `df.with_columns(...)` allein in einer Zeile mit `df`? Was gibt es zurück? | 1 | 2026-11-23 |
| `prices = [52.1, 48.3, 61.0]`: Was liefern `prices[1:10]`, `prices[10]` und `prices[5:10]`? | 1 | 2026-11-26 |
| `prices = [50.0, 40.0]`: Was ergeben `prices + 5` und `prices > 45`? Wie filtert man stattdessen? | 1 | 2026-11-26 |
| `d = {"wind": 12.4}`: Was liefert `for k in d`? Was ergeben `"wind" in d` und `12.4 in d`? | 1 | 2026-11-26 |
| Was ergibt `["DE", "FR"] == ["FR", "DE"]` in Python, was `c("DE","FR") == c("FR","DE")` in R? | 1 | 2026-11-26 |
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
- **2026-11-19, L01 Ü5:** `a += [3]` wie `a = a + [3]` erwartet. Richtig geraten, aber nur wegen suggestiver Frage. Bei Listen ist `+=` in-place.
- **2026-11-19, L01 Ü6:** Tupel als komplett unveränderlich angenommen. Die Liste darin bleibt aber veränderbar.
- **2026-11-19, L01 Ü7:** Erwartet, dass die verbotene Änderung still ignoriert wird. Python wirft einen `TypeError`.
- **2026-11-25, L02 Ü10:** `temp` übersehen, zweite Differenzmenge als leer erwartet (Flüchtigkeitsfehler).
- **2026-11-25, L02 Ü11:** `==` bei Listen unbekannt (Fehler oder Unique-Vergleich geraten). Richtig: elementweise in Reihenfolge, ein einziges `False`.
- **2026-11-25, L02 Ü7/Ü8:** Schleife über Dict als Schleife über Werte erwartet, `12.4 in d` als Fehler. Richtig: beides betrifft nur die Schlüssel (`False`, kein Fehler).
- **2026-11-25, Karte:** `b = scores.sort()` als sortierte Liste erwartet. Richtig: `None`.
- **2026-11-25, L02 Ü4:** `prices + 5` als elementweise Addition erwartet (R-Vektor). Richtig: `TypeError`.
- **2026-11-25, L02 Ü6:** `prices > 45` nach R-Logik erwartet, Fehler nur wegen suggestiver Frage geraten.
- **2026-11-25, L02 Ü3:** `prices[1:10]` bei 3 Elementen als „Element 2, 3 und 4“ gelesen. Listenlänge übersehen.
- **2026-11-25, L02 Modify:** Leerer Slice als `None` vermutet. Richtig: `[]`, ein Slice gibt immer eine Liste zurück.
- **2026-11-22, Karte:** `d["x"]` bei fehlendem Schlüssel als `None` geraten. Richtig: `KeyError`. `None` liefert nur `d.get("x")`.
- **2026-11-22, L01 Ü16/Ü17:** `with_columns` als in-place angenommen, daher `None` für `df2` erwartet. Logik folgerichtig, Prämisse falsch: Polars gibt immer Neues zurück.
- **2026-11-22, L01 Ü16:** `df.columns` als Ausgabe des DataFrames gelesen. Es liefert nur die Spaltennamen.
- **2026-11-20, L01 Ü15:** `.copy()` bei verschachteltem Dict als vollständige Kopie erwartet. Flache Kopie: innere Listen bleiben gemeinsam.
- **2026-11-20, L01 Ü8/Ü9:** Genau vertauscht: `sorted()` als in-place, `.sort()` als Rückgabe gelesen. `None` als Rückgabe unbekannt.
- **2026-11-20, L01 Ü10:** `name.strip()` ohne Zuweisung als in-place erwartet. Strings sind unveränderlich, Rückgabe verfällt.
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
- Merkt suggestive Fragen sofort. Hinweise neutral formulieren.
- Fragt von sich aus nach Gültigkeitsbereichen („features lebt nur in der Funktion“). Namen lokal, Objekte nicht: in 1d vertiefen.
- Karten-Antworten oft nur zur Hälfte (R-Teil, Zahlen-Teil fehlten). Bei Karten auf alle Teilfragen achten.
- Flüchtigkeitsfehler beim Durchgehen von Werten (L02 Ü6 `50.0`, Ü10 `temp`). Lesestrategie „jedes Element abhaken“ betonen.
- Möchte bald zu Software-Design und komplexeren Fällen kommen.
- Keine Ankündigungen wie „zwei der drei Fallen“: verrät, dass noch eine kommt (L02 Ü6).
- Kartentexte dürfen die Antwort nicht verraten (alte Karte „warum genau zwei Elemente“ umformuliert).
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
| 2026-11-19 | 1b Ü4 richtig (sauber begründet), Ü5 geraten | `+=` bei Listen in-place |
| 2026-11-19 | 1b Transfer (`BASE_FEATURES += extra`): richtig, mit guter Frage zu lokalen Namen | Namen lokal, Objekte nicht |
| 2026-11-19 | 1b Ü6–Ü7 falsch (Tupel). Häppchen 1b abgeschlossen | Unveränderlich = Plätze fest, Inhalt evtl. veränderbar |
| 2026-11-20 | Karten: 3 von 3 richtig (Box 2). 1c Ü8/Ü9 vertauscht, Modify `scores = scores.sort()` richtig | in-place-Methode gibt `None` zurück |
| 2026-11-20 | 1c Ü10 falsch (`strip` ohne Zuweisung), Modify Verkettung richtig. Häppchen 1c abgeschlossen | Strings unveränderlich; Transfer: Polars gibt immer Neues zurück |
| 2026-11-20 | 1d Ü11–Ü13 und Modify (`history=None`) alles richtig. Häppchen 1d abgeschlossen | Einstufungs-Stolperstein Ü8 behoben; Scope vs. Veränderung präzisiert |
| 2026-11-20 | Ab jetzt nur noch auf den Standard-Branch pushen | Wunsch des Lernenden |
| 2026-11-20 | 1e Ü14 richtig, Ü15 halb (flache Kopie), Modify richtig. Häppchen 1e abgeschlossen | Transfer: `base_config.copy()` in Experiment-Schleifen |
| 2026-11-22 | 1f Ü16/Ü17 falsch (in-place angenommen), Ü18 richtig. **Lektion 01 abgeschlossen** | Polars verändert nie in-place |
| 2026-11-22 | Karten: Slice und Positionsargument richtig (Box 2), `d["x"]` falsch (Box 1) | `KeyError` vs. `.get()` |
| 2026-11-22 | Lektion 02 geschrieben (6 Häppchen, 16 Übungen) | Slices, Liste ≠ Vektor, dict, set, Auspacken, Polars-Series |
| 2026-11-25 | 2a Ü1–Ü2 richtig, Ü3 halb (Listenlänge), Modify halb (`None` statt `[]`). Häppchen 2a abgeschlossen | Karten heute übersprungen (Session lief schon) |
| 2026-11-25 | Karten: `strip`, flache Kopie richtig (Box 2), `.sort()`-Rückgabe falsch. 2b: Ü4 halb, Ü5 richtig, Ü6 halb. Häppchen 2b abgeschlossen | Liste + Zahl und Liste > Zahl sind Fehler |
| 2026-11-25 | 2c Ü7/Ü8 falsch (Werte statt Schlüssel), Modify richtig. Häppchen 2c abgeschlossen | Dict wird über Schlüssel angesprochen |
| 2026-11-25 | 2d Ü9 richtig, Ü10 halb (`temp` übersehen), Ü11 halb (Listenvergleich). Häppchen 2d abgeschlossen | Tempo-Vorschlag gemacht, Antwort offen |
| 2026-11-25 | Tempo vereinbart: Phase 1 straffen. Karte zur Mengendifferenz auf Wunsch gestrichen | |
