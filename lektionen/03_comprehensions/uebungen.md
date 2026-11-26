# Lektion 03: Übungen. Comprehensions

Für jede Übung gilt: **Erst vorhersagen, was ausgegeben wird**, dann ausführen lassen.
Lösungen in [loesungen.md](loesungen.md), Erklärungen zum Nachlesen in [README.md](README.md).

Gestrafft auf ein Häppchen, weil einfache Comprehensions schon sitzen.
Alle Daten sind synthetisch. Preise in EUR/MWh (im Stromhandel können sie negativ sein).

## Häppchen 3a: Comprehensions lesen

### Ü1
```python
prices = [50.0, -5.0, 75.0, -12.0]
a = [p for p in prices if p > 0]
b = [p if p > 0 else 0.0 for p in prices]
print(a)
print(b)
```

### Ü2
```python
areas = ["DE", "FR", "AT"]
prices = [89.5, 95.0, 91.2]
lookup = {a: p for a, p in zip(areas, prices)}
print(lookup["FR"])
print({a: p for a, p in lookup.items() if p > 90})
```

### Ü3
`range(a, b)` erzeugt die ganzen Zahlen von `a` bis `b`, nach denselben Regeln wie ein Slice.
```python
hours = [17, 18]
cols = [f"price_h{h}_q{q}" for h in hours for q in range(1, 3)]
print(cols)
```

### Ü4
```python
prices = [50.0, -5.0, 75.0]
print(any(p < 0 for p in prices), sum(p for p in prices if p > 0))
```
