# Middle-earth: Streets of Minas Tirith

A top-down, GTA-2-style action game set in Gondor. Play a Ranger of the North:
slay orcs, ride Rohirric steeds, gather gold of Erebor, and try not to draw
the ire of the Citadel Guard.

Pure HTML5 Canvas + vanilla JavaScript. No build step, no npm install, no
external assets — every sprite is drawn from rectangles and circles.

## Play

### On a smartphone (recommended)

1. Push this branch to GitHub.
2. On the repo, go to **Settings → Pages**, set source to this branch
   (`claude/lotr-gta-game-0ydf5`) with folder `/ (root)`, and save.
3. Wait a minute for Pages to deploy, then open the provided URL on your
   phone's browser.
4. For the best experience, tap the browser's share menu and **Add to Home
   Screen** — it will launch fullscreen without browser chrome.

### On a desktop

Clone the repo, then either:

```
# Option A: open the file directly (works in most browsers)
open index.html

# Option B: serve locally (avoids any file:// quirks)
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Controls

### Touch (phone)

| Control                         | Action                              |
|---------------------------------|-------------------------------------|
| Virtual joystick (bottom-left)  | Move / steer horse                  |
| Red "Attack" button             | Swing sword                         |
| Green "Mount" button            | Mount or dismount nearest horse     |
| Pause icon (top-right)          | Pause / resume                      |

The joystick re-centers wherever you first press in its zone, so you don't
need to aim your thumb.

### Keyboard (desktop)

| Key                | Action                            |
|--------------------|-----------------------------------|
| W A S D / Arrows   | Move / steer horse                |
| Space              | Sword attack                      |
| E                  | Mount / dismount nearest horse    |
| P                  | Pause / resume                    |
| Enter              | Restart after death               |

## Goal

- **Slay orcs** — each kill earns +50 Renown.
- **Gather gold** — Gold of Erebor pickups give +10 gold and +5 Renown.
- **Eat lembas** — restores health.
- **Mount steeds** — horses roam the streets; riding doubles your speed.
- **Avoid guards** — killing a Citadel Guard raises your wanted level
  (shown as red dots). The more dots, the faster and more aggressive
  the guards become. Wanted level decays over time if you stay peaceful.

There are no "missions" — it's a sandbox. Your score is your Renown.

## Project layout

```
index.html          Canvas, HUD, touch overlay, message dialog
style.css           Fullscreen layout, HUD, touch controls
js/
  config.js         Constants, tile enum, color palette
  util.js           Math helpers, tile lookups
  state.js          Central mutable game state
  map.js            Concentric Minas Tirith map generation + tile rendering
  entities.js       Entity factories + initial spawn
  input.js          Keyboard + touch joystick + action buttons
  player.js         Player movement, attack, mount/dismount, wanted decay
  ai.js             Orc, guard, horse, pickup per-frame updates
  render.js         Procedural entity sprites
  hud.js            DOM HUD + message overlay
  game.js           Main loop, camera, boot
```

All scripts are classic `<script>` tags in dependency order — no ES modules,
no bundler, no transpile. Every script shares the global scope.

## Design notes

- **World**: 40x40 tiles, 32 px each. The city is concentric rings with eight
  radial spoke roads (Minas Tirith-inspired), a wall at the outer ring, the
  Anduin along the east edge, and a Citadel cluster near the top.
- **Rendering**: each sprite is a function of rectangles and circles using a
  locked palette. No image loads, so the game works even opened via
  `file://` with no server.
- **Scaling**: the canvas resizes to the viewport on load / resize /
  orientation change, with `devicePixelRatio` handling for crisp rendering on
  retina phones.
- **Input**: keyboard and touch run in parallel — both write into the same
  `state.stick` / `state.keys` / `state.edge` buffers.

## License

MIT. Do what you like.
