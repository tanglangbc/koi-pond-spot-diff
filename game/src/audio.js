// audio.js — tiny WebAudio sounds, synthesised in the browser, no files.
// A soft chime for a found difference, a low buzz for a miss, a little
// arpeggio when a round is cleared, and a tick in the last ten seconds.

let audioCtx = null;

function ctx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') void audioCtx.resume();
  return audioCtx;
}

function tone(freq, at, dur, type, vol) {
  const ac = ctx();
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, ac.currentTime + at);
  gain.gain.exponentialRampToValueAtTime(vol, ac.currentTime + at + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + at + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(ac.currentTime + at);
  osc.stop(ac.currentTime + at + dur + 0.05);
}

export function playFound() {
  tone(660, 0, 0.16, 'sine', 0.16);
  tone(990, 0.09, 0.24, 'sine', 0.14);
}

export function playWrong() {
  tone(140, 0, 0.18, 'square', 0.07);
}

export function playHint() {
  tone(520, 0, 0.12, 'triangle', 0.12);
  tone(780, 0.08, 0.16, 'triangle', 0.10);
}

export function playRoundClear() {
  [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.3, 'sine', 0.15));
}

export function playTick() {
  tone(880, 0, 0.06, 'sine', 0.06);
}

export function unlockAudio() {
  try {
    ctx();
  } catch (e) {
    // Audio stays silent until the player interacts; the game plays fine.
  }
}
