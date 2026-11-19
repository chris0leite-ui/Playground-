# Spickzettel: dplyr ↔ Polars

Voraussetzung: `import polars as pl`. Geprüft mit Polars 2.1.

**Die wichtigste Umstellung:** In dplyr schreibst du Spaltennamen nackt (`a > 1`).
In Polars baust du **Ausdrücke** mit `pl.col("a") > 1`. Ein Ausdruck ist eine Rechenvorschrift,
die erst innerhalb von `select`, `with_columns`, `filter` oder `agg` auf Daten angewendet wird.

## Verben

| dplyr | Polars |
|---|---|
| `select(a, b)` | `df.select("a", "b")` |
| `select(-b)` | `df.drop("b")` oder `df.select(pl.exclude("b"))` |
| `filter(a > 1, b == "x")` | `df.filter(pl.col("a") > 1, pl.col("b") == "x")` |
| `mutate(c = a * 2)` | `df.with_columns((pl.col("a") * 2).alias("c"))` |
| ebenso | `df.with_columns(c=pl.col("a") * 2)` |
| `rename(neu = alt)` | `df.rename({"alt": "neu"})` |
| `arrange(desc(a))` | `df.sort("a", descending=True)` |
| `arrange(g, desc(a))` | `df.sort(["g", "a"], descending=[False, True])` |
| `distinct(g)` | `df.select("g").unique()` |
| `slice_head(n = 5)` | `df.head(5)` |
| `slice(2:3)` | `df.slice(1, 2)` (Start 0-basiert, dann Anzahl) |
| `slice_sample(n = 2)` | `df.sample(n=2, seed=1)` |
| `pull(a)` | `df["a"]` oder `df.get_column("a")` |
| `glimpse(df)` | `df.glimpse()` |
| `summary(df)` | `df.describe()` |

## Gruppieren und Zusammenfassen

| dplyr | Polars |
|---|---|
| `group_by(g) \|> summarise(m = mean(a), n = n())` | `df.group_by("g").agg(pl.col("a").mean().alias("m"), n=pl.len())` |
| `count(g)` | `df.group_by("g").len()` |
| `n_distinct(g)` | `pl.col("g").n_unique()` |
| `group_by(g) \|> mutate(z = a - mean(a))` | `df.with_columns((pl.col("a") - pl.col("a").mean().over("g")).alias("z"))` |
| `summarise(across(where(is.numeric), mean))` | `import polars.selectors as cs` → `df.select(cs.numeric().mean())` |

Fensterfunktionen gibt es in Polars ohne `group_by`. Stattdessen hängt man `.over("g")` an einen Ausdruck.

## Spaltenlogik

| dplyr | Polars |
|---|---|
| `if_else(a > 1, "hoch", "tief")` | `pl.when(pl.col("a") > 1).then(pl.lit("hoch")).otherwise(pl.lit("tief"))` |
| `case_when(...)` | mehrere `.when(...).then(...)` hintereinander, dann `.otherwise(...)` |
| `is.na(a)` | `pl.col("a").is_null()` |
| `replace_na(a, 0)` | `pl.col("a").fill_null(0)` |
| `drop_na()` | `df.drop_nulls()` |
| `a %in% c("x", "y")` | `pl.col("a").is_in(["x", "y"])` |
| `str_detect(b, "x")` | `pl.col("b").str.contains("x")` |
| `as.numeric(a)` | `pl.col("a").cast(pl.Float64)` |
| `lag(a)` | `pl.col("a").shift(1)` |
| `cumsum(a)` | `pl.col("a").cum_sum()` |
| `row_number()` | `df.with_row_index("row")` |

## Kombinieren und Umformen

| dplyr / tidyr | Polars |
|---|---|
| `left_join(df2, by = "id")` | `df.join(df2, on="id", how="left")` |
| `bind_rows(df1, df2)` | `pl.concat([df1, df2])` |
| `pivot_longer(cols = a, ...)` | `df.unpivot(index="id", on=["a"])` |
| `pivot_wider(names_from = b, values_from = a)` | `df.pivot(on="b", index="g", values="a")` |

## Einlesen

| readr / arrow | Polars sofort (eager) | Polars faul (lazy) |
|---|---|---|
| `read_csv("f.csv")` | `pl.read_csv("f.csv")` | `pl.scan_csv("f.csv")` |
| `read_parquet("f.parquet")` | `pl.read_parquet("f.parquet")` | `pl.scan_parquet("f.parquet")` |

**Lazy** heißt: `scan_*` liest noch nichts, sondern sammelt alle Schritte. Erst `.collect()` führt
den optimierten Plan aus, ähnlich wie bei `dbplyr` mit `collect()`. → Lektion 12
