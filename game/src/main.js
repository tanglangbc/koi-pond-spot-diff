// main.js — game state for Koi Pond Spot the Difference.
// Three rounds (one scene each), seven differences a round, two minutes a
// round. Found: +100. Wrong click: -10 and a red flash. Hint (H): -25,
// three a round, and it pulses a gold ring around one difference you have
// not found yet. Finish a round with time left for a time bonus; finish all
// three rounds for the victory screen and a star rating.
//
// ?shot=cover|round2|round3|hint stages a fixed frame for screenshots:
// the timer is frozen and a few differences are already ringed.

import { SCENES, PANEL_W, PANEL_H } from './scenes.js';
import { drawPanel, drawWrongFlash } from './render.js';
import { scenePoint, hitDifference, bindKeyboard } from './input.js';
import { playFound, playWrong, playHint, playRoundClear, playTick, unlockAudio } from './audio.js';

const ROUND_SECONDS = 120;
const HINTS_PER_ROUND = 3;
const SHOTS = {
  cover: { scene: 0, found: [0, 2, 4], hint: null, timeLeft: 97, message: null },
  round2: { scene: 1, found: [1, 5], hint: null, timeLeft: 72, message: null },
  round3: { scene: 2, found: [0, 1, 3, 5, 6], hint: 2, timeLeft: 41, message: null },
  hint: { scene: 0, found: [0, 2], hint: 5, timeLeft: 88, message: null },
};

const $ = (id) => document.getElementById(id);

const state = {
  round: 0,
  found: new Set(),
  score: 0,
  timeLeft: ROUND_SECONDS,
  hintsLeft: HINTS_PER_ROUND,
  hintId: null,
  over: false,
  roundDone: false,
  frozen: false,
  muted: false,
  lastTickSecond: -1,
  totalFound: 0,
};

let timerId = null;
let pulseStart = performance.now();

function scene() {
  return SCENES[state.round];
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

function render() {
  const now = performance.now();
  drawPanel($('panel-left'), scene(), 'left', state.found, state.hintId, now - pulseStart);
  drawPanel($('panel-right'), scene(), 'right', state.found, state.hintId, now - pulseStart);
  $('counter').textContent = `Found ${state.found.size} / ${scene().diffs.length}`;
  $('score').textContent = `Score ${state.score}`;
  $('timer').textContent = formatTime(Math.max(0, state.timeLeft));
  $('timer').classList.toggle('urgent', state.timeLeft <= 10 && !state.roundDone);
  $('round-label').textContent = `Round ${state.round + 1} of ${SCENES.length} — ${scene().name}`;
  $('hints').textContent = `Hints ${state.hintsLeft}  (H)`;
  $('scene-intro').textContent = scene().intro;
  if (state.roundDone) {
    $('overlay').classList.remove('hidden');
    $('overlay-title').textContent = state.over ? 'Time is up!' : 'Round clear!';
    $('overlay-text').textContent = state.over
      ? `You found ${state.found.size} of ${scene().diffs.length} differences. Press R to try this round again.`
      : `All ${scene().diffs.length} differences found — nice eyes! Time bonus +${state.timeLeft * 5}. Press Enter for the next round.`;
  } else {
    $('overlay').classList.add('hidden');
  }
  if (state.victory) {
    $('victory').classList.remove('hidden');
    $('final-score').textContent = `Final score: ${state.score}`;
    const stars = state.score >= 2400 ? '★★★' : state.score >= 2000 ? '★★☆' : '★☆☆';
    $('final-stars').textContent = stars;
  } else {
    $('victory').classList.add('hidden');
  }
}

function startTimer() {
  stopTimer();
  if (state.frozen) return;
  timerId = window.setInterval(() => {
    if (state.roundDone || state.victory) return;
    state.timeLeft -= 1;
    if (state.timeLeft <= 10 && state.timeLeft > 0 && state.timeLeft !== state.lastTickSecond) {
      state.lastTickSecond = state.timeLeft;
      if (!state.muted) playTick();
    }
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      state.over = true;
      state.roundDone = true;
      stopTimer();
    }
    render();
  }, 1000);
}

function stopTimer() {
  if (timerId !== null) {
    window.clearInterval(timerId);
    timerId = null;
  }
}

function startRound(index) {
  state.round = index;
  state.found = new Set();
  state.timeLeft = ROUND_SECONDS;
  state.hintsLeft = HINTS_PER_ROUND;
  state.hintId = null;
  state.over = false;
  state.roundDone = false;
  pulseStart = performance.now();
  startTimer();
  render();
}

function onPanelClick(event) {
  if (state.roundDone || state.victory) return;
  unlockAudio();
  const canvas = event.currentTarget;
  const { x, y } = scenePoint(canvas, event);
  const hit = hitDifference(scene(), state.found, x, y);
  if (hit >= 0) {
    state.found.add(hit);
    state.totalFound += 1;
    state.score += 100;
    state.hintId = null;
    if (!state.muted) playFound();
    if (state.found.size === scene().diffs.length) {
      state.score += state.timeLeft * 5;
      state.roundDone = true;
      stopTimer();
      if (!state.muted) playRoundClear();
    }
  } else {
    state.score = Math.max(0, state.score - 10);
    if (!state.muted) playWrong();
    drawWrongFlash(canvas, x, y);
    window.setTimeout(render, 450);
  }
  render();
}

function onHint() {
  if (state.roundDone || state.victory) return;
  if (state.hintsLeft <= 0 || state.hintId !== null) return;
  const remaining = scene().diffs.map((d, i) => i).filter((i) => !state.found.has(i));
  if (remaining.length === 0) return;
  state.hintsLeft -= 1;
  state.score = Math.max(0, state.score - 25);
  state.hintId = remaining[Math.floor(Math.random() * remaining.length)];
  pulseStart = performance.now();
  if (!state.muted) playHint();
  render();
}

function onRestart() {
  if (state.victory) {
    state.score = 0;
    state.totalFound = 0;
    state.victory = false;
    startRound(0);
    return;
  }
  startRound(state.round);
}

function onAdvance() {
  if (state.victory) {
    onRestart();
    return;
  }
  if (!state.roundDone) return;
  if (state.over) {
    startRound(state.round);
    return;
  }
  if (state.round + 1 < SCENES.length) {
    startRound(state.round + 1);
  } else {
    state.victory = true;
    render();
  }
}

function applyShot(name) {
  const shot = SHOTS[name];
  if (!shot) return false;
  state.round = shot.scene;
  state.found = new Set(shot.found);
  state.score = shot.found.length * 100;
  state.timeLeft = shot.timeLeft;
  state.hintsLeft = HINTS_PER_ROUND - (shot.hint !== null ? 1 : 0);
  state.hintId = shot.hint;
  state.frozen = true;
  state.roundDone = false;
  state.over = false;
  pulseStart = performance.now();
  return true;
}

function init() {
  const left = $('panel-left');
  const right = $('panel-right');
  left.width = PANEL_W;
  left.height = PANEL_H;
  right.width = PANEL_W;
  right.height = PANEL_H;
  left.addEventListener('click', onPanelClick);
  right.addEventListener('click', onPanelClick);
  $('hint-btn').addEventListener('click', () => { unlockAudio(); onHint(); });
  $('restart-btn').addEventListener('click', () => { unlockAudio(); onRestart(); });
  $('next-btn').addEventListener('click', () => { unlockAudio(); onAdvance(); });
  $('mute-btn').addEventListener('click', () => {
    state.muted = !state.muted;
    $('mute-btn').textContent = state.muted ? 'Sound off' : 'Sound on';
  });
  bindKeyboard({ onHint, onRestart, onAdvance, onMute: () => $('mute-btn').click() });
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  if (shot && applyShot(shot)) {
    render();
    return;
  }
  startRound(0);
}

document.addEventListener('DOMContentLoaded', init);
