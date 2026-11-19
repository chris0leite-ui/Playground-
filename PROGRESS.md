# Fortschritt

_Gedächtnis zwischen den Sessions. Claude aktualisiert diese Datei am Ende jeder Session._

## Aktueller Stand

- **Lektion:** 00 Einstufung
- **Erledigt:** Block A (Ü1–Ü3)
- **Nächstes Häppchen:** Einstufung Block B (Ü4–Ü6), danach Block C (Ü7–Ü9)
- **Tempo für Phase 1:** offen, wird nach der Einstufung festgelegt

## Wiederholungskarten

Box 1 = täglich · Box 2 = alle 3 Tage · Box 3 = wöchentlich

| Frage | Box | fällig |
|---|---|---|
| `x = [10, 20, 30]`: Was liefert `x[-1]`? Was würde `x[-1]` in R tun? | 1 | 2026-11-20 |
| `x = [10, 20, 30, 40, 50]`: Was liefert `x[1:3]`, und warum genau zwei Elemente? | 1 | 2026-11-20 |
| `a = [1, 2, 3]`, `b = a`, `b.append(4)`: Was ist `a`? | 1 | 2026-11-20 |
| Was gibt `d.get("x", "fehlt")` zurück, wenn `"x"` nicht im dict ist? Und `d["x"]`? | 1 | 2026-11-21 |

## Stolpersteine

_Wo eine Vorhersage danebenlag. Daraus werden Wiederholungskarten._

- **2026-11-19, Ü1:** `x[-1]` als „alle außer dem ersten“ gelesen (R-Semantik). In Python ist es das letzte Element.
- **2026-11-19, Ü1:** `x[1:3]` als „Elemente 2 bis 4“ gelesen. Richtig: Position 1 und 2, das Ende ist exklusiv.
- **2026-11-19, Ü2:** `b = a` als Kopie verstanden (R: copy-on-modify). → Kernthema von Lektion 01.
- **2026-11-19, Ü3:** zweites Argument von `.get()` unbekannt (geraten: „leer“).

## Beobachtungen

- Data Science Team Lead, R-Hintergrund, Grundkenntnisse in Python.
- Berufsfeld: kurzfristiger Stromhandel. Abschlussprojekt in dieser Domäne (Phase 5).
- Stack: Polars. PyTorch bewusst gestrichen.
- Code läuft nur über Claude. Übt täglich ein bisschen, ohne festen Plan.
- `x[1]` → 20 richtig: 0-basierte Indizes sind bekannt. Negative Indizes und Slices noch R-geprägt.
- Referenzsemantik (`b = a`) noch unbekannt. Lektion 01 gründlich durchgehen.
- Rät offen und sagt, wenn es geraten ist. Gut so, weiter ermutigen.

## Sessionlog

| Datum | Was | Notizen |
|---|---|---|
| 2026-11-19 | Repo neu aufgesetzt, Lernpfad festgelegt | Polars-Fokus, täglich kurz |
| 2026-11-19 | PyTorch gestrichen, Phase 5 Stromhandel ergänzt, `main` angelegt | |
| 2026-11-19 | Einstufung Block A: Ü1 und Ü3 teilweise richtig, Ü2 falsch | R-Fallen bei `x[-1]`, Slices, `b = a` |
