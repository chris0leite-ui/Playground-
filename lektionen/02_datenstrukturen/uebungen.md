# Lektion 02: Übungen. Datenstrukturen

Für jede Übung gilt: **Erst vorhersagen, was ausgegeben wird**, dann ausführen lassen.
Lösungen in [loesungen.md](loesungen.md), Erklärungen zum Nachlesen in [README.md](README.md).

Alle Daten sind synthetisch. Preise in EUR/MWh, Prognosen in GW.

## Häppchen 2a: Slices, Teil 2

### Ü1
```python
prices = [52.1, 48.3, 61.0, 75.4, 70.2, 58.9]
print(prices[-2:])
print(prices[:2])
```

### Ü2
Eine dritte Zahl im Slice ist die Schrittweite: `x[start:stop:step]`.
```python
quarters = [52.1, 48.3, 61.0, 75.4, 70.2, 58.9, 55.0, 49.8]
print(quarters[::4])
print(quarters[1::4])
```

### Ü3
```python
prices = [52.1, 48.3, 61.0]
print(prices[1:10])
print(prices[10])
```

## Häppchen 2b: Eine Liste ist kein Vektor

### Ü4
```python
prices = [52.1, 48.3, 61.0]
print(prices + [5])
print(prices + 5)
```

### Ü5
```python
prices = [50.0, 40.0, 75.0]
print(len(prices), max(prices), sum(prices) / len(prices))
```

### Ü6
```python
prices = [50.0, 40.0, 75.0]
high = [p for p in prices if p > 45]
print(high)
print(prices > 45)
```

## Häppchen 2c: Dictionaries

### Ü7
```python
forecast = {"wind": 12.4, "pv": 3.1, "load": 48.0}
for k in forecast:
    print(k)
```

### Ü8
```python
forecast = {"wind": 12.4, "pv": 3.1, "load": 48.0}
print("wind" in forecast, 12.4 in forecast)
```

## Häppchen 2d: Sets

### Ü9
```python
areas = ["DE", "FR", "DE", "AT", "FR"]
print(len(areas), len(set(areas)))
```

### Ü10
```python
expected = ["wind_fc", "pv_fc", "load_fc", "price_lag_96"]
available = ["load_fc", "wind_fc", "temp"]
print(sorted(set(expected) - set(available)))
print(sorted(set(available) - set(expected)))
```

### Ü11
```python
print({"DE", "FR"} == {"FR", "DE"}, ["DE", "FR"] == ["FR", "DE"])
```

## Häppchen 2e: Tupel auspacken

### Ü12
```python
def split_day(prices):
    return prices[:4], prices[4:]

morning, rest = split_day([50, 52, 55, 61, 70, 68])
print(morning)
print(rest)
```

### Ü13
```python
forecast = {"wind": 12.4, "pv": 3.1}
for name, value in forecast.items():
    print(f"{name}: {value} GW")
```

### Ü14
```python
hours = [17, 18, 19]
prices = [89.5, 95.0]
for h, p in zip(hours, prices):
    print(h, p)
```

## Häppchen 2f: Transfer zu Polars

### Ü15
```python
import polars as pl

df = pl.DataFrame({"price": [50.0, 40.0, 75.0]})
print((df["price"] + 5).to_list())
print(df["price"].to_list() + [5])
```

### Ü16
```python
import polars as pl

df = pl.DataFrame({"wind_fc": [1.0], "pv_fc": [2.0], "temp": [3.0]})
features = ["wind_fc", "pv_fc", "load_fc"]
print(set(features) - set(df.columns))
print(df.select([c for c in features if c in df.columns]).columns)
```
