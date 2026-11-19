"""Führt Code-Blöcke aus einer Markdown-Datei aus.

Jeder ```python-Block in einer uebungen.md ist eine Übung, durchnummeriert ab 1.
Jeder Block läuft in einem eigenen, frischen Python-Prozess.

Beispiele:
    python3 tools/snippet.py lektionen/01_namen_und_objekte/uebungen.md 3
    python3 tools/snippet.py lektionen/01_namen_und_objekte/uebungen.md --all
"""

import argparse
import re
import subprocess
import sys
from pathlib import Path

CODE_BLOCK = re.compile(r"```python\n(.*?)```", re.DOTALL)


def extract_blocks(markdown: str) -> list[str]:
    """Gibt alle Python-Code-Blöcke in der Reihenfolge zurück, in der sie vorkommen."""
    return CODE_BLOCK.findall(markdown)


def run(code: str) -> str:
    """Führt Code in einem neuen Python-Prozess aus und gibt Ausgabe + Fehler zurück."""
    result = subprocess.run(
        [sys.executable, "-c", code],
        capture_output=True,
        text=True,
    )
    return result.stdout + result.stderr


def main() -> None:
    parser = argparse.ArgumentParser(description="Übungen aus Markdown ausführen")
    parser.add_argument("file", type=Path, help="Pfad zur Markdown-Datei")
    parser.add_argument("number", nargs="?", type=int, help="Nummer der Übung (ab 1)")
    parser.add_argument("--all", action="store_true", help="alle Übungen ausführen")
    args = parser.parse_args()

    blocks = extract_blocks(args.file.read_text(encoding="utf-8"))

    if args.all:
        selected = range(1, len(blocks) + 1)
    elif args.number is not None:
        selected = [args.number]
    else:
        parser.error("Nummer der Übung oder --all angeben")

    for n in selected:
        print(f"--- Ü{n} ---")
        print(run(blocks[n - 1]), end="")


if __name__ == "__main__":
    main()
