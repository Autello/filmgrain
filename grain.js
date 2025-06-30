const canvas = document.getElementById('grainCanvas');
const ctx = canvas.getContext('2d');
let grainAmount = parseFloat(document.getElementById('grainAmount').value);
let grainScale = parseFloat(document.getElementById('grainScale').value);

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Generate realistic film grain
function drawFilmGrain() {
  const width = canvas.width;
  const height = canvas.height;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    // Organic grain with Perlin-like randomness
    const base = (Math.random() + Math.random() + Math.random() + Math.random()) / 4;
    const value = 128 + (base - 0.5) * 255 * grainAmount;

    const r = value * (0.9 + 0.2 * Math.random());
    const g = value * (0.9 + 0.2 * Math.random());
    const b = value * (0.9 + 0.2 * Math.random());

    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
}

function animateGrain() {
  drawFilmGrain();
  requestAnimationFrame(animateGrain);
}
animateGrain();

// Controls
document.getElementById('grainAmount').addEventListener('input', e => {
  grainAmount = parseFloat(e.target.value);
});
document.getElementById('grainScale').addEventListener('input', e => {
  grainScale = parseFloat(e.target.value);
});
