# Lektion 00: Einstufung

Neun kurze Code-Stücke, von leicht bis knifflig. Sag zu jedem voraus, **was ausgegeben wird**.
Raten ist ausdrücklich erlaubt. „Keine Ahnung“ ist auch eine nützliche Antwort.

Es gibt keine Note. Die Einstufung zeigt nur, welche Lektionen wir zügig durchgehen können
und wo wir gründlich werden. Die Lösungen stehen in [loesungen.md](loesungen.md). Schau erst danach rein.

## Block A

### Ü1
```python
x = [10, 20, 30, 40, 50]
print(x[1], x[-1], x[1:3])
```

### Ü2
```python
a = [1, 2, 3]
b = a
b.append(4)
print(a)
```

### Ü3
```python
scores = {"anna": 0.91, "ben": 0.87}
scores["cara"] = 0.78
print(len(scores), scores.get("dora", "fehlt"))
```

## Block B

### Ü4
```python
nums = [1, 2, 3, 4, 5, 6]
print([n * 10 for n in nums if n % 2 == 0])
```

### Ü5
```python
def scale(x, factor=2, offset=0):
    return x * factor + offset

print(scale(3), scale(3, offset=1), scale(3, 10))
```

### Ü6
```python
values = [1, 2, 3]
print(values * 2)
```

## Block C

### Ü7
```python
class Counter:
    def __init__(self):
        self.n = 0

    def add(self, k=1):
        self.n += k
        return self

c = Counter()
c.add().add(5)
print(c.n)
```

### Ü8
```python
def add_item(item, bucket=[]):
    bucket.append(item)
    return bucket

print(add_item("a"))
print(add_item("b"))
```

### Ü9
```python
import polars as pl

df = pl.DataFrame({"team": ["a", "b", "a"], "val": [1, 2, 3]})
out = df.group_by("team").agg(pl.col("val").sum()).sort("team")
print(out)
```
