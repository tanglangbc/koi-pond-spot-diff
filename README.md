# koi-pond-spot-diff

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/tanglangbc/koi-pond-spot-diff/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/tanglangbc/koi-pond-spot-diff/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Koi Pond — Spot the Difference. Two near-identical pictures side by side, seven real differences per round, three hand-drawn procedural scenes (Koi Pond at Dusk, Night Bookshop, Mountain Tea House). Click a difference on either picture to ring it; wrong clicks cost 10 points, hints cost 25, and each round runs on a 2-minute timer with a time bonus. No libraries, no network at run time — plain canvas and ES modules, with sounds synthesised by WebAudio.

## Run it

```sh
python3 -m http.server 8080 --directory game
```

Then open http://localhost:8080 in a desktop browser. Click a difference to ring it, press H for a hint, R to restart, Enter to continue.

## Layout

- `game/index.html` — page, HUD and panels
- `game/src/scenes.js` — the three scenes and their seven differences each
- `game/src/render.js` — panel drawing, found rings, hint pulse
- `game/src/input.js` — pointer hit-testing and keyboard
- `game/src/audio.js` — WebAudio chimes and ticks
- `game/src/main.js` — rounds, timer, scoring, screenshot staging (`?shot=`)
- `main.ts` — hands game/ and screenshots/ in as the entry (writes dossier.json)

---

<sub>Entered on [make.fun](https://make.fun/?ref=NVRADX&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
