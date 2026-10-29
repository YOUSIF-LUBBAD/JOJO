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

Every level now runs **25% faster** and lasts **five seconds longer** than the previous version. A clean run takes roughly **122 seconds** of gameplay, plus the celebrations between levels.

| Level | Previous time | New running time |
| --- | ---: | ---: |
| 1 | 22.76 seconds | 27.76 seconds |
| 2 | 20.83 seconds | 25.83 seconds |
| 3 | 19.20 seconds | 24.20 seconds |
| 4 | 17.81 seconds | 22.81 seconds |
| 5 | 16.61 seconds | 21.61 seconds |

There are more gaps and cracked tiles in every level. Later levels have more frequent gaps. Starts, finishes, and landing tiles stay safe, and every row has a route around its hazards.

Collect **three hearts without falling** to activate a **five-second heart magnet**. It picks up nearby hearts and favorite things. The score card shows the countdown, and the ending shows your best heart streak. Pausing or reaching a level celebration pauses the bonus timer too. A White Peach save keeps your streak; an unprotected fall resets it.

Toolbar buttons now return keyboard focus to the game. A music error arriving before playback or after Pause no longer opens the music controls by itself. Simple comments explain the main parts of the HTML, styling, game code, and tests.

## Smoother drawing and an Arabic ending

The renderer keeps a steady drawing schedule on 60, 90, 120, and 144 Hz displays. Smooth mode limits the canvas size on large screens and automatically lowers drawing detail if the device is struggling. Repeated resize events and unchanged score text no longer rebuild the same content. The tunnel uses reusable letter shapes and draws fewer distant tiles.

After the final win, **بحبك يا روحي** appears in the top bar between the tagline and the music controls. On narrow screens it sits on its own centered row. Going home or restarting hides it again.

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

The checks simulate complete runs at 30, 60, and 120 steps per second, and verify checkpoints, retries, safe floor boundaries, landing tiles, collectible placement, heart streaks, and magnet timing. The UI checks cover frame pacing, drawing size limits, resize reuse, automatic graphics scaling, and the Arabic ending, using a simulated browser and music player. These checks do not verify real browser layout or streamed music.


## Rights

© 2026 Yousif Lubbad, for original copyrightable contributions owned by Yousif Lubbad. See [LICENSE](LICENSE) for the permission to play and limits on reuse.

Third-party artwork, brands, and recordings are excluded. Their credits and known permission limits are in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). This is a rights notice, not a registration or a commercial-use clearance.
