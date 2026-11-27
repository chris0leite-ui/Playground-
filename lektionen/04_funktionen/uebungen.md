# Lektion 04: Übungen. Funktionen

Für jede Übung gilt: **Erst vorhersagen, was ausgegeben wird**, dann ausführen lassen.
Lösungen in [loesungen.md](loesungen.md), Erklärungen zum Nachlesen in [README.md](README.md).

Alle Daten sind synthetisch. Preise in EUR/MWh, Mengen in MWh.

## Häppchen 4a: Argumente zuordnen

### Ü1
```python
def make_feature(name, lag=1, scale=1.0):
    return f"{name}_lag{lag}_x{scale}"

print(make_feature("price", scale=2.0))
print(make_feature("price", 4, 0.5))
```

### Ü2
```python
def make_feature(name, lag=1, scale=1.0):
    return f"{name}_lag{lag}_x{scale}"

print(make_feature("price"))
print(make_feature(lag=4, "price"))
```

### Ü3
```python
def make_feature(name, lag=1, scale=1.0):
    return f"{name}_lag{lag}_x{scale}"

print(make_feature(lag=4))
```

## Häppchen 4b: Rückgabe oder Ausgabe?

### Ü4
```python
def mean_price(prices):
    print(sum(prices) / len(prices))

result = mean_price([50.0, 70.0])
print(result)
```

### Ü5
```python
def classify(price):
    if price < 0:
        return "negative"
    if price > 100:
        return "spike"
    return "normal"

print([classify(p) for p in [-5.0, 150.0, 80.0, 100.0]])
```

## Häppchen 4c: `*args` und `**kwargs`

### Ü6
```python
def total(*volumes):
    print(type(volumes), volumes)
    return sum(volumes)

print(total(10, 20, 5))
```

### Ü7
```python
def train(model, **params):
    print(model, params)

train("lgbm", lr=0.1, depth=5)
```

### Ü8
```python
def train(model, lr=0.01, depth=3):
    return f"{model}: lr={lr}, depth={depth}"

config = {"lr": 0.1, "depth": 5}
print(train("lgbm", **config))
args = ["ridge", 0.5]
print(train(*args))
```

## Häppchen 4d: Funktionen als Werte, `lambda`

### Ü9
```python
def double(x):
    return x * 2

f = double
g = double(4)
print(f(21), g)
```

### Ü10
```python
prices = {"DE": 89.5, "FR": 95.0, "AT": 91.2}
print(sorted(prices, key=lambda a: prices[a]))
```
