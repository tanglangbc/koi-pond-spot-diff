// input.js — pointer and keyboard handling for the two panels.
// A click is converted into scene coordinates (both panels share the same
// layout), then tested against every unfound difference's circle. Clicking
// a found difference again does nothing; clicking empty space is a miss.

export function scenePoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

export function hitDifference(scene, found, x, y) {
  let best = -1;
  let bestDist = Infinity;
  for (let i = 0; i < scene.diffs.length; i++) {
    if (found.has(i)) continue;
    const d = scene.diffs[i];
    const dx = x - d.x;
    const dy = (y - d.y) / 0.82;
    const dist = Math.hypot(dx, dy);
    if (dist <= d.r + 8 && dist < bestDist) {
      best = i;
      bestDist = dist;
    }
  }
  return best;
}

export function bindKeyboard(handlers) {
  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (key === 'h' && handlers.onHint) handlers.onHint();
    if (key === 'r' && handlers.onRestart) handlers.onRestart();
    if ((key === 'enter' || key === ' ') && handlers.onAdvance) {
      event.preventDefault();
      handlers.onAdvance();
    }
    if (key === 'm' && handlers.onMute) handlers.onMute();
  });
}
