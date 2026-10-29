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

## October 29, 2026 update

The route is now **20% longer**, with the same five levels and speed progression. A clean run takes roughly **97 seconds** of gameplay, plus the celebrations between levels. The earlier version took about 81 seconds.

| Level | Approximate running time |
| --- | ---: |
| 1 | 23 seconds |
| 2 | 21 seconds |
| 3 | 19 seconds |
| 4 | 18 seconds |
| 5 | 17 seconds |

Toolbar buttons now return keyboard focus to the game. A music error arriving before playback or after Pause no longer opens the music controls by itself. Simple comments explain the main parts of the HTML, styling, game code, and tests.

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
- **tests/ui.test.cjs** checks toolbar focus, music errors, pause/resume, and returning home.
- **LICENSE** and **THIRD_PARTY_NOTICES.md** describe the rights notice and asset credits.

GitHub Pages publishes the game from the repository's main branch.
For future updates, make a focused change, check it, and commit it with a message describing that change.

## Run the game checks

With Node.js installed, run this command from the repository folder:

```sh
node tests/game-core.test.cjs
node tests/ui.test.cjs
```

The checks simulate complete runs at 30, 60, and 120 steps per second, and verify checkpoints, retries, safe floor boundaries, landing tiles, and collectible placement. The UI checks use a simulated browser and music player. These checks do not verify real browser layout or streamed music.


## Rights

© 2026 Yousif Lubbad, for original copyrightable contributions owned by Yousif Lubbad. See [LICENSE](LICENSE) for the permission to play and limits on reuse.

Third-party artwork, brands, and recordings are excluded. Their credits and known permission limits are in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). This is a rights notice, not a registration or a commercial-use clearance.
