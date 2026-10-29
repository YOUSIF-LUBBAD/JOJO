// Copyright (c) 2026 Yousif Lubbad. See LICENSE.
'use strict';

// This checks the buttons without downloading pictures or songs.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(match => match[1]);
let document;
function element(id, tagName = 'DIV') {
  const events = new Map(), classes = new Set();
  return {
    id, tagName, hidden: false, open: false, textContent: '', value: '', style: {}, dataset: {}, attributes: {},
    addEventListener(type, listener) { const list = events.get(type) || []; list.push(listener); events.set(type, list); },
    dispatch(type, extra = {}) { for (const fn of events.get(type) || []) fn({target: this, preventDefault() {}, ...extra}); },
    setAttribute(key, value) { this.attributes[key] = value; },
    focus() { document.activeElement = this; },
    showModal() { this.open = true; },
    close() { this.open = false; this.dispatch('close'); },
    querySelector() { return nodes['home-button']; },
    classList: {add(name) {classes.add(name);}, remove(name) {classes.delete(name);}, toggle(name, on) {if(on)classes.add(name);else classes.delete(name);}},
  };
}
const nodes = Object.fromEntries([...html.matchAll(/<([a-z][a-z0-9]*)\b[^>]*\bid="([^"]+)"[^>]*>/gi)].map(match => {
  const node = element(match[2], match[1].toUpperCase());
  node.hidden = /\bhidden\b/.test(match[0]);
  return [match[2], node];
}));
const gradient = {addColorStop() {}};
const paint = new Proxy({}, {get(target, name) {
  if (name in target) return target[name];
  if (name === 'createRadialGradient' || name === 'createLinearGradient') return () => gradient;
  return () => {};
}});
nodes.game.getBoundingClientRect = () => ({width: 1200, height: 680});
nodes.game.getContext = () => paint;
const videos = ['title', 'title', 'celebration', 'celebration'].map((dance, i) => ({
  dataset: {dance, clip: i === 1 ? 'cradles' : 'original'}, paused: true,
  pause() {this.paused = true;}, play() {this.paused = false; return Promise.resolve();}
}));
const favoritesButtons = [element('favorites1', 'BUTTON'), element('favorites2', 'BUTTON')];
const restartButtons = [element('restart1', 'BUTTON'), element('restart2', 'BUTTON')];
const tools = [], storage = new Map(), timers = new Map();
let timerId = 0, raf, player;
document = Object.assign(element('document'), {
  hidden: false, body: element('body'), head: {appendChild() {}}, activeElement: null,
  getElementById(id) {return nodes[id];},
  createElement(tag) {return element(tag, tag.toUpperCase());},
  querySelectorAll(selector) {
    if(selector === 'video[data-dance]') return videos;
    if(selector === '.favorites-button') return favoritesButtons;
    if(selector === '.restart-button') return restartButtons;
    return [];
  },
  modelContext: {registerTool(tool) {tools.push(tool);}}
});
const window = Object.assign(element('window'), {
  matchMedia() {return {matches: false};}, devicePixelRatio: 1,
  location: {protocol: 'https:', origin: 'https://yousif-lubbad.github.io'},
  YT: {Player: function (id, options) {
    this.events = options.events; this.pauseVideo = () => this.events.onStateChange({data: 2});
    this.playVideo = () => {}; this.loadVideoById = () => {};
    this.setVolume = () => {}; this.unMute = () => {};
    this.getIframe = () => nodes['song-player']; player = this;
  }}
});
window.AudioContext = function () {
  this.currentTime = 0; this.resume = () => Promise.resolve(); this.destination = {};
  this.createOscillator = () => ({frequency:{setValueAtTime(){}, exponentialRampToValueAtTime(){}},connect(){},disconnect(){},start(){},stop(){}});
  this.createGain = () => ({gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}});
};
const context = vm.createContext({window, document, console, AbortController,
  localStorage: {getItem(key) {return storage.get(key) || null;}, setItem(key, value) {storage.set(key, value);}},
  Image: function () {}, requestAnimationFrame(fn) {raf = fn;},
  setTimeout(fn) {timers.set(++timerId, fn); return timerId;}, clearTimeout(id) {timers.delete(id);}
});
vm.runInContext(scripts[0], context);
vm.runInContext(scripts[1], context);
vm.runInContext(scripts[2], context);
player.events.onReady();
let gameState;
const makeState = context.JojoCore.makeState;
context.JojoCore.makeState = () => { gameState = makeState(); return gameState; };
vm.runInContext(scripts[3], context);
const read = tools.find(tool => tool.name === 'read_jojo_game').execute;

// A failed song must not open a panel before someone asks for music.
player.events.onError({data: 101});
assert.equal(nodes['music-panel'].hidden, true, 'An idle music error must leave the panel closed.');

nodes['play-button'].dispatch('click');
assert.equal(read({}).mode, 'playing');
player.events.onStateChange({data: 1});

// Clicking these buttons should leave the arrow keys ready to use.
for (const id of ['quality-button', 'sound-button', 'music-button']) {
  nodes[id].focus(); nodes[id].dispatch('click');
  assert.equal(document.activeElement, nodes.game, id + ' should return focus to the game.');
}

// A song error that arrives after Pause should stay quiet.
nodes['music-play'].dispatch('click');
nodes['close-music'].dispatch('click');
player.events.onError({data: 101});
assert.equal(nodes['music-panel'].hidden, true, 'A late song error must not reopen closed controls.');
nodes['music-play'].dispatch('click');
player.events.onError({data: 101});
assert.equal(nodes['music-panel'].hidden, false, 'A requested song should explain a real playback failure.');
assert.equal(nodes['song-link'].hidden, false);

// Switching tabs pauses the run, and Resume starts it again.
document.hidden = true; document.dispatch('visibilitychange');
assert.equal(read({}).mode, 'paused');
document.hidden = false; document.dispatch('visibilitychange');
nodes['resume-button'].dispatch('click');
assert.equal(read({}).mode, 'playing');

// The score card shows the bonus and stops its timer while paused.
gameState.magnetTime = 4.9; gameState.heartStreak = 3;
for (let frame = 0; frame < 12; frame++) raf(frame * 1000 / 60);
assert.match(nodes['streak-status'].textContent, /Heart magnet · 5s/);
nodes['pause-button'].dispatch('click');
const remainingBonus = gameState.magnetTime;
for (let frame = 12; frame < 24; frame++) raf(frame * 1000 / 60);
assert.equal(gameState.magnetTime, remainingBonus);
nodes['home-button'].dispatch('click');
assert.equal(read({}).mode, 'title');
assert.equal(read({}).heartStreak, 0);
assert.equal(read({}).magnetTime, 0);
assert.equal(nodes['streak-status'].textContent, '0 / 3 · heart magnet');
assert.equal(nodes['win-screen'].hidden, true);
assert.equal(nodes['title-screen'].hidden, false);
nodes['choose-golubi'].dispatch('click');
nodes['play-button'].dispatch('click');
assert.equal(read({}).level, 1);
assert.equal(read({}).character, 'golubi');
console.log('PASS: toolbar focus, music errors, tab pause/resume, bonus display, and home/replay.');
