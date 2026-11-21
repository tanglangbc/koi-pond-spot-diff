// scenes.js — three hand-drawn procedural scenes for the spot-the-difference
// game. Every scene is drawn twice from the same seed, so both panels match
// exactly until a difference is applied. A difference is a spot {x, y, r}
// with a left(ctx) drawing (only on the left panel) and a right(ctx) drawing
// (only on the right panel). A "missing" difference draws on the left only;
// an "extra" one draws on the right only; a "changed" one draws both ways.

import { mulberry32, range } from './rng.js';

const W = 600;
const H = 440;

function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function koi(ctx, x, y, size, body, belly) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = body;
  ellipse(ctx, 0, 0, size, size * 0.42);
  ctx.fillStyle = belly;
  ellipse(ctx, size * 0.15, 0, size * 0.55, size * 0.26);
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(-size * 0.9, 0);
  ctx.lineTo(-size * 1.5, -size * 0.4);
  ctx.lineTo(-size * 1.5, size * 0.4);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#1c2733';
  circle(ctx, size * 0.55, -size * 0.12, size * 0.07);
  ctx.restore();
}

function lilyPad(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0.3, Math.PI * 2 - 0.4);
  ctx.lineTo(x, y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.18)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + r * 0.6, y - r * 0.6);
  ctx.stroke();
}

function lotus(ctx, x, y, s) {
  ctx.fillStyle = '#f7a8c4';
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i - 2) * 0.5;
    ctx.beginPath();
    ctx.ellipse(x + Math.cos(a) * s * 0.45, y + Math.sin(a) * s * 0.45, s * 0.28, s * 0.55, a, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#ffd94d';
  circle(ctx, x, y, s * 0.22);
}

// ---------------------------------------------------------------- scene 1
function drawKoiPond(ctx) {
  const rng = mulberry32(101);
  const sky = ctx.createLinearGradient(0, 0, 0, 200);
  sky.addColorStop(0, '#2b3a67');
  sky.addColorStop(0.55, '#c96f4a');
  sky.addColorStop(1, '#f2b880');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, 200);
  ctx.fillStyle = '#3a2f4d';
  ctx.beginPath();
  ctx.moveTo(0, 200);
  ctx.quadraticCurveTo(150, 130, 320, 185);
  ctx.quadraticCurveTo(470, 225, 600, 165);
  ctx.lineTo(600, 200);
  ctx.closePath();
  ctx.fill();
  // pond
  const water = ctx.createLinearGradient(0, 185, 0, H);
  water.addColorStop(0, '#1d6f6b');
  water.addColorStop(1, '#0d3f4a');
  ctx.fillStyle = water;
  ctx.fillRect(0, 185, W, H - 185);
  ctx.strokeStyle = 'rgba(255,255,255,0.22)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 9; i++) {
    const x = range(rng, 30, 570);
    const y = range(rng, 215, 420);
    ctx.beginPath();
    ctx.ellipse(x, y, 26 + rng() * 22, 6, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  // bridge
  ctx.strokeStyle = '#7a4a2b';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(180, 205);
  ctx.quadraticCurveTo(300, 150, 420, 205);
  ctx.stroke();
  ctx.strokeStyle = '#a06a3f';
  ctx.lineWidth = 4;
  for (let i = 0; i <= 6; i++) {
    const t = i / 6;
    const x = 180 + 240 * t;
    const y = 205 - Math.sin(t * Math.PI) * 42;
    ctx.beginPath();
    ctx.moveTo(x, y - 8);
    ctx.lineTo(x, y + 8);
    ctx.stroke();
  }
  // lily pads and koi
  lilyPad(ctx, 150, 300, 34, '#3f9e4d');
  lilyPad(ctx, 480, 250, 28, '#35884a');
  lilyPad(ctx, 90, 390, 26, '#2f7d44');
  lilyPad(ctx, 330, 390, 30, '#3f9e4d');
  koi(ctx, 250, 320, 30, '#ff8c42', '#ffe3c2');
  koi(ctx, 520, 360, 24, '#f2f2f2', '#ffb199');
  koi(ctx, 110, 250, 22, '#ff5d5d', '#ffffff');
  // reeds on the left bank
  ctx.strokeStyle = '#2e7d32';
  ctx.lineWidth = 4;
  for (const [x, hgt] of [[52, 70], [66, 88], [80, 62]]) {
    ctx.beginPath();
    ctx.moveTo(x, 210);
    ctx.quadraticCurveTo(x + 6, 210 - hgt * 0.6, x - 4, 210 - hgt);
    ctx.stroke();
  }
  ctx.fillStyle = '#6d4c41';
  circle(ctx, 520, 400, 16);
  ctx.fillStyle = '#8d6e63';
  circle(ctx, 516, 396, 6);
  // fireflies
  for (let i = 0; i < 7; i++) {
    const x = range(rng, 40, 560);
    const y = range(rng, 30, 170);
    ctx.fillStyle = 'rgba(255, 236, 140, 0.9)';
    circle(ctx, x, y, 3);
    ctx.fillStyle = 'rgba(255, 236, 140, 0.25)';
    circle(ctx, x, y, 8);
  }
}

const koiDiffs = [
  {
    x: 430, y: 330, r: 34, label: 'a koi fish',
    left(ctx) { koi(ctx, 430, 330, 26, '#ff8c42', '#ffe3c2'); },
    right() {},
  },
  {
    x: 150, y: 300, r: 30, label: 'a pink lotus flower',
    left() {},
    right(ctx) { lotus(ctx, 150, 292, 20); },
  },
  {
    x: 480, y: 70, r: 26, label: 'the colour of the low sun',
    left(ctx) { ctx.fillStyle = '#ffd98a'; circle(ctx, 480, 70, 22); },
    right(ctx) { ctx.fillStyle = '#ff7a3c'; circle(ctx, 480, 70, 22); },
  },
  {
    x: 300, y: 168, r: 22, label: 'an extra plank on the bridge',
    left() {},
    right(ctx) {
      ctx.strokeStyle = '#a06a3f';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(300, 160);
      ctx.lineTo(300, 176);
      ctx.stroke();
    },
  },
  {
    x: 66, y: 160, r: 30, label: 'a tall reed on the bank',
    left(ctx) {
      ctx.strokeStyle = '#2e7d32';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(66, 210);
      ctx.quadraticCurveTo(72, 160, 62, 122);
      ctx.stroke();
      ctx.fillStyle = '#5d4037';
      ellipse(ctx, 62, 118, 5, 12);
    },
    right() {},
  },
  {
    x: 520, y: 400, r: 20, label: 'the colour of the round stone',
    left(ctx) { ctx.fillStyle = '#6d4c41'; circle(ctx, 520, 400, 16); },
    right(ctx) { ctx.fillStyle = '#5d8a4a'; circle(ctx, 520, 400, 16); },
  },
  {
    x: 300, y: 120, r: 18, label: 'a glowing firefly',
    left() {},
    right(ctx) {
      ctx.fillStyle = 'rgba(255, 236, 140, 0.9)';
      circle(ctx, 300, 120, 3);
      ctx.fillStyle = 'rgba(255, 236, 140, 0.25)';
      circle(ctx, 300, 120, 9);
    },
  },
];

// ---------------------------------------------------------------- scene 2
function bookSpine(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillRect(x + 3, y + 6, w - 6, 3);
}

function drawBookshop(ctx) {
  const rng = mulberry32(202);
  ctx.fillStyle = '#101a33';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#ffd97a';
  for (let i = 0; i < 26; i++) {
    circle(ctx, range(rng, 10, 590), range(rng, 8, 120), range(rng, 1, 2.2));
  }
  // shop front
  ctx.fillStyle = '#4a3226';
  ctx.fillRect(60, 90, 480, 250);
  ctx.fillStyle = '#6b4a35';
  ctx.fillRect(60, 90, 480, 18);
  // striped awning
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = i % 2 ? '#f2e3c6' : '#b8433a';
    ctx.fillRect(60 + i * 60, 108, 60, 26);
    ctx.beginPath();
    ctx.moveTo(60 + i * 60, 134);
    ctx.lineTo(60 + i * 60 + 60, 134);
    ctx.lineTo(60 + i * 60 + 50, 148);
    ctx.lineTo(60 + i * 60 + 10, 148);
    ctx.closePath();
    ctx.fill();
  }
  // window with books
  ctx.fillStyle = '#ffdf8e';
  ctx.fillRect(100, 160, 220, 130);
  ctx.fillStyle = '#3a2a1c';
  ctx.fillRect(100, 160, 220, 8);
  ctx.fillRect(100, 282, 220, 8);
  const spineColors = ['#c0392b', '#2471a3', '#1e8449', '#b7950b', '#7d3c98', '#ca6f1e'];
  for (let r = 0; r < 2; r++) {
    const y = 178 + r * 52;
    let x = 112;
    while (x < 300) {
      const w = 14 + Math.floor(rng() * 12);
      bookSpine(ctx, x, y, w, 44, spineColors[Math.floor(rng() * spineColors.length)]);
      x += w + 3;
    }
  }
  // door
  ctx.fillStyle = '#2e4a3a';
  ctx.fillRect(360, 160, 110, 180);
  ctx.fillStyle = '#22402f';
  ctx.fillRect(372, 172, 86, 70);
  ctx.fillStyle = '#ffdf8e';
  ctx.fillRect(372, 172, 86, 70);
  ctx.strokeStyle = '#22402f';
  ctx.lineWidth = 3;
  ctx.strokeRect(372, 172, 86, 70);
  ctx.beginPath();
  ctx.moveTo(415, 172);
  ctx.lineTo(415, 242);
  ctx.stroke();
  // hanging sign
  ctx.strokeStyle = '#d8c49a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(300, 108);
  ctx.lineTo(300, 128);
  ctx.stroke();
  ctx.fillStyle = '#f2e3c6';
  ctx.fillRect(255, 128, 90, 44);
  ctx.strokeStyle = '#6b4a35';
  ctx.lineWidth = 2;
  ctx.strokeRect(255, 128, 90, 44);
  ctx.fillStyle = '#4a3226';
  ctx.font = 'bold 20px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('BOOKS', 300, 157);
  // lantern beside the door
  ctx.strokeStyle = '#d8c49a';
  ctx.beginPath();
  ctx.moveTo(500, 150);
  ctx.lineTo(500, 168);
  ctx.stroke();
  ctx.fillStyle = '#ff9d45';
  ellipse(ctx, 500, 190, 16, 22);
  ctx.fillStyle = 'rgba(255, 180, 80, 0.3)';
  ellipse(ctx, 500, 190, 30, 38);
  // cat on the windowsill
  ctx.fillStyle = '#22242e';
  ellipse(ctx, 450, 282, 34, 16);
  circle(ctx, 474, 262, 12);
  ctx.beginPath();
  ctx.moveTo(466, 254);
  ctx.lineTo(470, 242);
  ctx.lineTo(475, 254);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(478, 252);
  ctx.lineTo(484, 241);
  ctx.lineTo(487, 253);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#22242e';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(420, 284);
  ctx.quadraticCurveTo(398, 276, 404, 258);
  ctx.stroke();
  // crate with stacked books
  ctx.fillStyle = '#7a5a38';
  ctx.fillRect(96, 330, 90, 34);
  bookSpine(ctx, 104, 306, 66, 20, '#2471a3');
  bookSpine(ctx, 110, 288, 54, 16, '#b7950b');
  // cobbled street
  ctx.fillStyle = '#2c2f45';
  ctx.fillRect(0, 364, W, H - 364);
  ctx.fillStyle = '#3d4160';
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 12; col++) {
      const x = 14 + col * 50 + (row % 2) * 22;
      const y = 376 + row * 24;
      ellipse(ctx, x, y, 20, 9);
    }
  }
}

const bookshopDiffs = [
  {
    x: 450, y: 272, r: 34, label: 'the cat on the windowsill',
    left(ctx) {
      ctx.fillStyle = '#22242e';
      ellipse(ctx, 450, 282, 34, 16);
      circle(ctx, 474, 262, 12);
      ctx.beginPath();
      ctx.moveTo(466, 254); ctx.lineTo(470, 242); ctx.lineTo(475, 254);
      ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(478, 252); ctx.lineTo(484, 241); ctx.lineTo(487, 253);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#22242e';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(420, 284);
      ctx.quadraticCurveTo(398, 276, 404, 258);
      ctx.stroke();
    },
    right() {},
  },
  {
    x: 300, y: 138, r: 16, label: 'the little star above the shop sign',
    left(ctx) {
      ctx.fillStyle = '#c0392b';
      ctx.beginPath();
      ctx.arc(300, 138, 7, 0, Math.PI * 2);
      ctx.fill();
    },
    right() {},
  },
  {
    x: 150, y: 200, r: 20, label: 'the colour of one book spine',
    left(ctx) { bookSpine(ctx, 136, 178, 22, 44, '#c0392b'); },
    right(ctx) { bookSpine(ctx, 136, 178, 22, 44, '#1e8449'); },
  },
  {
    x: 140, y: 300, r: 26, label: 'an extra stack of books',
    left() {},
    right(ctx) {
      bookSpine(ctx, 128, 306, 60, 18, '#7d3c98');
      bookSpine(ctx, 134, 290, 48, 15, '#ca6f1e');
    },
  },
  {
    x: 500, y: 190, r: 26, label: 'the lantern beside the door',
    left(ctx) {
      ctx.fillStyle = '#ff9d45';
      ellipse(ctx, 500, 190, 16, 22);
      ctx.fillStyle = 'rgba(255, 180, 80, 0.3)';
      ellipse(ctx, 500, 190, 30, 38);
    },
    right(ctx) {
      ctx.fillStyle = '#5a5a66';
      ellipse(ctx, 500, 190, 16, 22);
    },
  },
  {
    x: 455, y: 320, r: 12, label: 'which side the door knob is on',
    left(ctx) { ctx.fillStyle = '#d8c49a'; circle(ctx, 455, 320, 6); },
    right(ctx) { ctx.fillStyle = '#d8c49a'; circle(ctx, 368, 320, 6); },
  },
  {
    x: 520, y: 400, r: 20, label: 'a cobblestone in the street',
    left(ctx) { ctx.fillStyle = '#3d4160'; ellipse(ctx, 520, 400, 20, 9); },
    right() {},
  },
];

// ---------------------------------------------------------------- scene 3
function drawTeaHouse(ctx) {
  const rng = mulberry32(303);
  const sky = ctx.createLinearGradient(0, 0, 0, 260);
  sky.addColorStop(0, '#f7c873');
  sky.addColorStop(0.6, '#f2a35e');
  sky.addColorStop(1, '#e07a5f');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, 260);
  // red sun
  ctx.fillStyle = '#d64533';
  circle(ctx, 470, 92, 34);
  ctx.fillStyle = 'rgba(214, 69, 51, 0.25)';
  circle(ctx, 470, 92, 46);
  // mountains
  ctx.fillStyle = '#8a6f8e';
  ctx.beginPath();
  ctx.moveTo(0, 260);
  ctx.lineTo(120, 130);
  ctx.lineTo(260, 260);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#6d5570';
  ctx.beginPath();
  ctx.moveTo(180, 260);
  ctx.lineTo(340, 110);
  ctx.lineTo(520, 260);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f7ead7';
  ctx.beginPath();
  ctx.moveTo(340, 110);
  ctx.lineTo(372, 152);
  ctx.lineTo(330, 148);
  ctx.lineTo(308, 152);
  ctx.closePath();
  ctx.fill();
  // birds
  ctx.strokeStyle = '#3a2a33';
  ctx.lineWidth = 2.5;
  for (const [bx, by] of [[150, 80], [210, 110]]) {
    ctx.beginPath();
    ctx.moveTo(bx - 12, by);
    ctx.quadraticCurveTo(bx, by - 8, bx + 12, by);
    ctx.stroke();
  }
  // ground
  ctx.fillStyle = '#5d7d4a';
  ctx.fillRect(0, 260, W, H - 260);
  ctx.fillStyle = '#4c6b3e';
  for (let i = 0; i < 12; i++) {
    ellipse(ctx, range(rng, 10, 590), range(rng, 270, 430), 26, 8);
  }
  // stone path
  ctx.fillStyle = '#cbb89a';
  for (let i = 0; i < 5; i++) {
    ellipse(ctx, 200 + i * 12, 400 - i * 26, 26, 10);
  }
  // tea house
  ctx.fillStyle = '#7a4a2b';
  ctx.fillRect(250, 210, 150, 90);
  ctx.fillStyle = '#a9713f';
  ctx.fillRect(250, 210, 150, 10);
  ctx.fillStyle = '#5d3a22';
  ctx.beginPath();
  ctx.moveTo(230, 212);
  ctx.lineTo(325, 150);
  ctx.lineTo(420, 212);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#c0392b';
  ctx.beginPath();
  ctx.moveTo(222, 214);
  ctx.quadraticCurveTo(325, 176, 428, 214);
  ctx.lineTo(420, 214);
  ctx.lineTo(325, 190);
  ctx.lineTo(230, 214);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffd94d';
  circle(ctx, 325, 176, 7);
  // door and windows
  ctx.fillStyle = '#2e2118';
  ctx.fillRect(305, 240, 40, 60);
  ctx.fillStyle = '#ffdf8e';
  ctx.fillRect(265, 240, 26, 30);
  ctx.fillRect(359, 240, 26, 30);
  // pine tree
  ctx.fillStyle = '#5d4037';
  ctx.fillRect(84, 220, 12, 90);
  ctx.fillStyle = '#2e6b34';
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(90, 150 + i * 34);
    ctx.lineTo(50 - i * 6, 210 + i * 30);
    ctx.lineTo(130 + i * 6, 210 + i * 30);
    ctx.closePath();
    ctx.fill();
  }
  // low table with tea cups
  ctx.fillStyle = '#6b4a35';
  ctx.fillRect(270, 330, 110, 10);
  ctx.fillStyle = '#4a3226';
  ctx.fillRect(280, 340, 8, 34);
  ctx.fillRect(362, 340, 8, 34);
  ctx.fillStyle = '#f2f2f2';
  ellipse(ctx, 300, 326, 16, 7);
  ellipse(ctx, 348, 326, 16, 7);
  ctx.fillStyle = '#7fb069';
  ellipse(ctx, 300, 324, 12, 4);
  ellipse(ctx, 348, 324, 12, 4);
  // steam
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 2;
  for (const sx of [300, 348]) {
    ctx.beginPath();
    ctx.moveTo(sx, 316);
    ctx.quadraticCurveTo(sx + 5, 306, sx - 3, 296);
    ctx.stroke();
  }
  // (The stone lantern by the house is a difference, not part of the base
  // scene: it appears only on the right panel, via teaHouseDiffs.)
}

const teaHouseDiffs = [
  {
    x: 420, y: 80, r: 18, label: 'a bird in the morning sky',
    left(ctx) {
      ctx.strokeStyle = '#3a2a33';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(408, 80);
      ctx.quadraticCurveTo(420, 72, 432, 80);
      ctx.stroke();
    },
    right() {},
  },
  {
    x: 348, y: 326, r: 18, label: 'the second cup of tea',
    left(ctx) {
      ctx.fillStyle = '#f2f2f2';
      ellipse(ctx, 348, 326, 16, 7);
      ctx.fillStyle = '#7fb069';
      ellipse(ctx, 348, 324, 12, 4);
    },
    right() {},
  },
  {
    x: 325, y: 176, r: 14, label: 'the colour of the roof ornament',
    left(ctx) { ctx.fillStyle = '#ffd94d'; circle(ctx, 325, 176, 7); },
    right(ctx) { ctx.fillStyle = '#1e8449'; circle(ctx, 325, 176, 7); },
  },
  {
    x: 60, y: 200, r: 24, label: 'a branch of the pine tree',
    left(ctx) {
      ctx.fillStyle = '#2e6b34';
      ctx.beginPath();
      ctx.moveTo(84, 196);
      ctx.lineTo(44, 214);
      ctx.lineTo(84, 222);
      ctx.closePath();
      ctx.fill();
    },
    right() {},
  },
  {
    x: 470, y: 92, r: 40, label: 'rays around the rising sun',
    left() {},
    right(ctx) {
      ctx.strokeStyle = 'rgba(214, 69, 51, 0.55)';
      ctx.lineWidth = 3;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(470 + Math.cos(a) * 42, 92 + Math.sin(a) * 42);
        ctx.lineTo(470 + Math.cos(a) * 54, 92 + Math.sin(a) * 54);
        ctx.stroke();
      }
    },
  },
  {
    x: 500, y: 330, r: 30, label: 'a stone lantern by the house',
    left() {},
    right(ctx) {
      ctx.fillStyle = '#8d8578';
      ctx.fillRect(492, 330, 16, 40);
      ctx.fillRect(482, 318, 36, 12);
      ctx.beginPath();
      ctx.moveTo(480, 318);
      ctx.lineTo(500, 300);
      ctx.lineTo(520, 318);
      ctx.closePath();
      ctx.fill();
    },
  },
  {
    x: 224, y: 348, r: 20, label: 'the shape of a stepping stone',
    left(ctx) { ctx.fillStyle = '#cbb89a'; ellipse(ctx, 224, 348, 26, 10); },
    right(ctx) {
      ctx.fillStyle = '#cbb89a';
      ctx.fillRect(202, 338, 44, 20);
    },
  },
];

export const SCENES = [
  {
    id: 'koi-pond',
    name: 'Koi Pond at Dusk',
    seed: 101,
    draw: drawKoiPond,
    diffs: koiDiffs,
    intro: 'Seven koi-pond secrets hide between the two pictures. The bridge, the lilies and the low sun are all suspects.',
  },
  {
    id: 'bookshop',
    name: 'Night Bookshop',
    seed: 202,
    draw: drawBookshop,
    diffs: bookshopDiffs,
    intro: 'The bookshop glows after dark — but seven small things changed while you blinked. Mind the cat.',
  },
  {
    id: 'tea-house',
    name: 'Mountain Tea House',
    seed: 303,
    draw: drawTeaHouse,
    diffs: teaHouseDiffs,
    intro: 'Tea is poured at sunrise and seven details drifted with the steam. Count the birds, then count again.',
  },
];

export const PANEL_W = W;
export const PANEL_H = H;
