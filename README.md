# JOJO ♡

A little pink universe for JOJO, from Yousif.

**[Play JOJO](https://yousif-lubbad.github.io/JOJO/)**

## Play

- Move around the tunnel with **Left / Right** or **A / D**.
- Jump with **Space** or **Up**.
- Use the on-screen movement and jump buttons on a phone.
- Collect hearts and favorite things, jump over gaps, and keep moving on cracked floors.
- Each of the five levels gets faster. Falling restarts the current level with unlimited retries.
- After the final win, choose **Back to home ♡** to pick a runner and play again.

## October 20, 2026 update

Each level now has **32 floor rows**, up from 28: about **14% longer** at the same speed.
A clean run takes roughly **81 seconds** of gameplay, plus the celebrations between levels.

| Level | Approximate running time |
| --- | ---: |
| 1 | 19 seconds |
| 2 | 17 seconds |
| 3 | 16 seconds |
| 4 | 15 seconds |
| 5 | 14 seconds |

The route still has safe starting and finishing sections, landing tiles after gaps, and a checkpoint at every level.

## Included

- Eight selectable runners.
- Hearts, pink sparkle effects, personal favorites, and J + Y details.
- A black Challenger with a red interior and two home-screen dance clips.
- A custom pink music player with twelve songs.
- Five levels, breakaway floors, retries, and the ending **I Love You JOJO**.

Music requires an internet connection and may need an initial tap on Play. Availability of individual recordings depends on YouTube.

## Files and updates

- **index.html** is the complete game. Artwork, dance clips, styling, and game scripts are embedded in it.
- **tests/game-core.test.cjs** checks the engine inside that same HTML file.

GitHub Pages publishes the game from the repository's main branch.
For future updates, make a focused change, check it, and commit it with a message describing that change.

## Run the game checks

With Node.js installed, run this command from the repository folder:

```sh
node tests/game-core.test.cjs
```

The checks simulate complete runs at 30, 60, and 120 steps per second, and verify checkpoints, retries, safe floor boundaries, landing tiles, and collectible placement. These are engine checks; they do not test browser rendering or streamed music.
