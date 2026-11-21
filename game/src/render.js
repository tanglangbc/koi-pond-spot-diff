// render.js — draws one panel of a scene and paints the markers on top.
// The left panel runs the scene's base drawing plus every diff's left()
// drawing; the right panel runs the base plus every diff's right() drawing.
// Found differences get a green ring; a hint pulses a gold ring; a wrong
// click flashes a red cross for a moment.

export function drawPanel(canvas, scene, side, found, hintId, pulse) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  ctx.save();
  scene.draw(ctx);
  for (const diff of scene.diffs) {
    if (side === 'left') diff.left(ctx);
    else diff.right(ctx);
  }
  ctx.restore();
  // markers for differences already found
  ctx.save();
  ctx.lineWidth = 4;
  for (const id of found) {
    const diff = scene.diffs[id];
    if (!diff) continue;
    ctx.strokeStyle = '#2ecc71';
    ctx.beginPath();
    ctx.ellipse(diff.x, diff.y, diff.r + 4, diff.r * 0.82 + 4, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(diff.x, diff.y, diff.r + 8, diff.r * 0.82 + 8, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 4;
  }
  // pulsing hint ring on one unfound difference
  if (hintId !== null && hintId !== undefined) {
    const diff = scene.diffs[hintId];
    const breathe = 1 + 0.12 * Math.sin(pulse / 220);
    ctx.strokeStyle = '#ffd94d';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(diff.x, diff.y, (diff.r + 6) * breathe, (diff.r * 0.82 + 6) * breathe, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawWrongFlash(canvas, x, y) {
  const ctx = canvas.getContext('2d');
  ctx.save();
  ctx.strokeStyle = '#e74c3c';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x - 12, y - 12);
  ctx.lineTo(x + 12, y + 12);
  ctx.moveTo(x + 12, y - 12);
  ctx.lineTo(x - 12, y + 12);
  ctx.stroke();
  ctx.restore();
}
