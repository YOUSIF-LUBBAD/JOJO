'use strict';

// Run with: node tests/game-core.test.cjs
// Read the exact game shipped to GitHub Pages, so the tests cannot drift from it.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(match => match[1]);
const core = scripts.find(script => script.includes('const LANES =') && script.includes('function makeState()'));
if (!core) throw new Error('Could not find the game engine inside index.html.');
const moduleScope = {exports: {}};
vm.runInNewContext(core, {module: moduleScope}, {timeout: 1000});

function runChecks(C) {

  const verify = (condition, message) => { if (!condition) throw new Error(message); };
  const results = [];
  verify(C.STAGE_COUNT === 5, 'The adventure must have five levels.');
  verify(JSON.stringify(C.LEVEL_SPEEDS) === JSON.stringify([5.4, 5.9, 6.4, 6.9, 7.4]), 'Keep the existing speed progression.');
  for (const fps of [30, 60, 120]) {
    const state = C.makeState();
    C.reset(state);
    const visited = [state.stage], durations = [];
    let previousTime = 0;
    while (['playing', 'levelup'].includes(state.mode) && state.runTime < 120) {
      if (state.mode === 'levelup') {
        durations.push(state.runTime - previousTime);
        previousTime = state.runTime;
        visited.push(state.stage);
        const position = state.z;
        C.step(state, 1 / fps, 1);
        verify(state.z === position, 'The runner must wait during level celebrations.');
        C.nextLevel(state);
      }
      const ahead = Math.floor((state.z + state.speed * 0.21) / C.ROW);
      if ((C.isOpen(state, ahead, state.lane) || C.isFragile(ahead, state.lane)) && state.height === 0) C.jump(state);
      C.step(state, 1 / fps, 0);
    }
    durations.push(state.runTime - previousTime);
    verify(state.mode === 'won', 'The full journey must finish at ' + fps + ' fps.');
    verify(JSON.stringify(visited) === '[0,1,2,3,4]', 'Visit each of the five levels in order.');
    verify(state.checkpoint === 4, 'The final checkpoint must be level five.');
    verify(state.runTime > 80 && state.runTime < 83, 'The longer route should take about 81 seconds without pauses.');
    verify(durations.every(time => time > 13 && time < 20), 'Each level should take about 14–19 seconds.');
    results.push(fps + ' fps: all five levels finished in ' + state.runTime.toFixed(2) + ' seconds.');
  }
  for (let stage = 0; stage < C.STAGE_COUNT; stage++) {
    const state = C.makeState();
    C.reset(state);
    state.checkpoint = stage;
    state.mode = 'fallen';
    state.fragile = {1: 1};
    C.retry(state);
    verify(state.mode === 'playing' && state.stage === stage, 'Retry the current level.');
    verify(state.z === stage * C.STAGE_ROWS * C.ROW, 'Retry at the longer level boundary.');
    verify(state.speed === C.LEVEL_SPEEDS[stage], 'Retry at the correct speed.');
    verify(Object.keys(state.fragile).length === 0, 'Retry repairs broken tiles.');
    for (const offset of [0, 1, 2, 3, C.STAGE_ROWS - 4, C.STAGE_ROWS - 3, C.STAGE_ROWS - 2, C.STAGE_ROWS - 1]) {
      for (let lane = 0; lane < C.LANES; lane++) {
        const row = stage * C.STAGE_ROWS + offset;
        verify(!C.isGap(row, lane) && !C.isFragile(row, lane), 'Every level begins and ends on safe floor.');
      }
    }
  }
  for (let row = 0; row < C.TOTAL_ROWS; row++) {
    let safeLanes = 0;
    for (let lane = 0; lane < C.LANES; lane++) {
      if (!C.isGap(row, lane)) safeLanes++;
      else verify(!C.isGap(row + 1, lane), 'A gap must be followed by a landing tile.');
    }
    verify(safeLanes > 0, 'Every row needs a safe route.');
  }
  const ids = new Set(), kinds = new Set();
  for (let row = 0; row <= C.TOTAL_ROWS; row++) {
    for (const item of C.pickupsFor(row)) {
      verify(!ids.has(item.id), 'Collectibles need unique IDs.');
      verify(item.z >= 0 && item.z < C.TOTAL_ROWS * C.ROW, 'Keep collectibles inside the route.');
      ids.add(item.id); kinds.add(item.kind);
    }
  }
  verify(C.TREAT_KINDS.every(kind => kinds.has(kind)) && kinds.has('heart'), 'Keep every favorite and hearts in the adventure.');
  results.push('Checkpoints, safe starts/finishes, gap landings, and collectible placement passed.');
  return results;

}

for (const result of runChecks(moduleScope.exports)) console.log('PASS: ' + result);
