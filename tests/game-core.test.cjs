// Copyright (c) 2026 Yousif Lubbad. See LICENSE.
'use strict';

// Run with: node tests/game-core.test.cjs
// Test the same game file that players open.
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
  const previousSpeeds = [5.4, 5.9, 6.4, 6.9, 7.4];
  const expectedDurations = previousSpeeds.map(speed => 122.88 / speed + 5);
  verify(C.LEVEL_SPEEDS.every((speed, i) => Math.abs(speed / previousSpeeds[i] - 1.25) < 1e-10), 'Every level must be 25 percent faster.');
  // Try the full trip at different frame rates.
  for (const fps of [30, 60, 120]) {
    const state = C.makeState();
    C.reset(state);
    const visited = [state.stage], durations = [];
    let previousTime = 0;
    while (['playing', 'levelup'].includes(state.mode) && state.runTime < 180) {
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
    verify(durations.every((time, i) => Math.abs(time - expectedDurations[i]) < 2 / fps), 'Each level must finish at the expected time.');
    results.push(fps + ' fps: all five levels finished in ' + state.runTime.toFixed(2) + ' seconds.');
  }
  // Check that each retry starts on safe floor.
  for (let stage = 0; stage < C.STAGE_COUNT; stage++) {
    const state = C.makeState();
    C.reset(state);
    state.checkpoint = stage;
    state.mode = 'fallen';
    state.fragile = {1: 1};
    C.retry(state);
    verify(state.mode === 'playing' && state.stage === stage, 'Retry the current level.');
    verify(state.z === C.LEVEL_STARTS[stage], 'Retry at the exact level boundary.');
    verify(state.speed === C.LEVEL_SPEEDS[stage], 'Retry at the correct speed.');
    verify(Object.keys(state.fragile).length === 0, 'Retry repairs broken tiles.');
    const startRow = Math.floor(C.LEVEL_STARTS[stage] / C.ROW);
    const endRow = Math.floor(C.LEVEL_ENDS[stage] / C.ROW);
    const safeRows = [startRow, startRow + 1, startRow + 2, startRow + 3, endRow - 4, endRow - 3, endRow - 2, endRow - 1];
    for (const row of safeRows) {
      for (let lane = 0; lane < C.LANES; lane++) {
        verify(!C.isGap(row, lane) && !C.isFragile(row, lane), 'Every level begins and ends on safe floor.');
      }
    }
  }
  // Every hole needs a safe place to land.
  for (let row = 0; row < C.TOTAL_ROWS; row++) {
    let safeLanes = 0;
    for (let lane = 0; lane < C.LANES; lane++) {
      if (!C.isGap(row, lane)) safeLanes++;
      else verify(!C.isGap(row + 1, lane), 'A gap must be followed by a landing tile.');
    }
    verify(safeLanes > 0, 'Every row needs a safe route.');
  }
  // Make sure all favorites appear and none share an ID.
  const ids = new Set(), kinds = new Set();
  for (let row = 0; row <= C.TOTAL_ROWS; row++) {
    for (const item of C.pickupsFor(row)) {
      verify(!ids.has(item.id), 'Collectibles need unique IDs.');
      verify(item.z >= 0 && item.z < C.TOTAL_DISTANCE, 'Keep collectibles inside the route.');
      ids.add(item.id); kinds.add(item.kind);
    }
  }
  verify(C.TREAT_KINDS.every(kind => kinds.has(kind)) && kinds.has('heart'), 'Keep every favorite and hearts in the adventure.');
  results.push('Checkpoints, safe starts/finishes, gap landings, and collectible placement passed.');
  return results;

}

for (const result of runChecks(moduleScope.exports)) console.log('PASS: ' + result);

