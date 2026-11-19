# Lektion 01: Übungen. Namen und Objekte

Für jede Übung gilt: **Erst vorhersagen, was ausgegeben wird**, dann ausführen lassen.
Lösungen in [loesungen.md](loesungen.md), Erklärungen zum Nachlesen in [README.md](README.md).

Ein Häppchen ist eine Tagesportion.

## Häppchen 1a: Namen sind Etiketten

### Ü1
```python
a = [1, 2, 3]
b = a
b.append(4)
print(a)
```

### Ü2
```python
x = 10
y = x
y = y + 1
print(x, y)
```

### Ü3
```python
a = [1, 2, 3]
b = a
c = [1, 2, 3]
print(a == c, a is c, a is b)
```

## Häppchen 1b: Veränderlich oder nicht?

### Ü4
```python
a = [1, 2]
b = a
a = a + [3]
print(b)
```

### Ü5
```python
a = [1, 2]
b = a
a += [3]
print(b)
```

### Ü6
```python
config = ("adam", [0.01, 0.001])
config[1].append(0.0001)
print(config)
```

### Ü7
```python
config = ("adam", [0.01, 0.001])
config[0] = "sgd"
print(config)
```

## Häppchen 1c: Verändert es, oder gibt es etwas Neues zurück?

### Ü8
```python
scores = [0.7, 0.9, 0.8]
ranked = sorted(scores)
print(scores)
print(ranked)
```

### Ü9
```python
scores = [0.7, 0.9, 0.8]
ranked = scores.sort()
print(scores)
print(ranked)
```

### Ü10
```python
name = "  churn_model  "
name.strip()
print(f"[{name}]")
```

## Häppchen 1d: Funktionen und Objekte

### Ü11
```python
def add_bias(features):
    features.append("bias")
    return len(features)

cols = ["age", "income"]
n = add_bias(cols)
print(n, cols)
```

### Ü12
```python
def add_bias(features):
    features = features + ["bias"]
    return len(features)

cols = ["age", "income"]
n = add_bias(cols)
print(n, cols)
```

### Ü13
```python
def log_metric(value, history=[]):
    history.append(value)
    return history

print(log_metric(0.5))
print(log_metric(0.7))
```

## Häppchen 1e: Bewusst kopieren

### Ü14
```python
a = [1, 2, 3]
b = a.copy()
b.append(4)
print(a, b)
```

### Ü15
```python
grid = {"lr": [0.1, 0.01], "depth": [3, 5]}
grid2 = grid.copy()
grid2["lr"].append(0.001)
grid2["depth"] = [7]
print(grid)
```

## Häppchen 1f: Transfer zu Polars

### Ü16
```python
import polars as pl

df = pl.DataFrame({"x": [1, 2, 3]})
df.with_columns((pl.col("x") * 10).alias("x10"))
print(df.columns)
```

### Ü17
```python
import polars as pl

df = pl.DataFrame({"x": [1, 2, 3]})
df2 = df.with_columns((pl.col("x") * 10).alias("x10"))
print(df.columns, df2.columns)
```

### Ü18
```python
import polars as pl

df = pl.DataFrame({"x": [3, 1, 2]})
result = df.sort("x").filter(pl.col("x") > 1)
print(df["x"].to_list(), result["x"].to_list())
```
