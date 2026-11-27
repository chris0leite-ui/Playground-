# Lektion 06: Übungen. Klassen und Objekte

Für jede Übung gilt: **Erst vorhersagen, was ausgegeben wird**, dann ausführen lassen.
Lösungen in [loesungen.md](loesungen.md), Erklärungen zum Nachlesen in [README.md](README.md).

Alle Daten sind synthetisch. Mengen in MWh, Preise in EUR/MWh.

## Häppchen 6a: Klasse, Objekt, `self`

### Ü1
```python
class Position:
    def __init__(self, area, volume):
        self.area = area
        self.volume = volume

p1 = Position("DE", 10.0)
p2 = Position("FR", -5.0)
print(p1.area, p2.volume)
```

### Ü2
```python
class Position:
    def __init__(self, area, volume):
        self.area = area
        self.volume = volume

p1 = Position("DE", 10.0)
p2 = p1
p2.volume = 0.0
print(p1.volume)
```

## Häppchen 6b: Methoden

### Ü3
```python
class Position:
    def __init__(self, area, volume):
        self.area = area
        self.volume = volume

    def close(self):
        self.volume = 0.0

    def value(self, price):
        return self.volume * price

p = Position("DE", 10.0)
print(p.value(80.0))
print(p.close())
print(p.value(80.0))
```

### Ü4
```python
class Position:
    def __init__(self, area, volume):
        self.area = area
        self.volume = volume

    def describe(self):
        return f"{self.area}: {volume} MWh"

print(Position("DE", 10.0).describe())
```

### Ü5
```python
class Book:
    trades = []

    def __init__(self, name):
        self.name = name

    def add(self, volume):
        self.trades.append(volume)

a = Book("day_ahead")
b = Book("intraday")
a.add(10)
b.add(-3)
print(a.trades)
```

## Häppchen 6c: Vererbung

### Ü6
`class WindForecast(Forecast)` heißt: `WindForecast` erbt alles von `Forecast`.
`super().mean()` ruft die `mean` der Elternklasse auf.
```python
class Forecast:
    def __init__(self, values):
        self.values = values

    def mean(self):
        return sum(self.values) / len(self.values)

    def describe(self):
        return f"{type(self).__name__}: mean={self.mean()}"

class WindForecast(Forecast):
    def mean(self):
        return round(super().mean(), 1)

print(Forecast([1.0, 2.0, 2.5]).describe())
print(WindForecast([1.0, 2.0, 2.5]).describe())
```

## Häppchen 6d: Das Muster aus scikit-learn

### Ü7
```python
class MeanModel:
    def fit(self, y):
        self.mean_ = sum(y) / len(y)
        return self

    def predict(self, n):
        return [self.mean_] * n

model = MeanModel().fit([50.0, 70.0])
print(model.predict(3))
```

### Ü8
```python
class MeanModel:
    def fit(self, y):
        self.mean_ = sum(y) / len(y)
        return self

    def predict(self, n):
        return [self.mean_] * n

model = MeanModel()
print(model.predict(2))
```
