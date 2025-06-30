const imageLoader = document.getElementById('imageLoader');
const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
const grainAmountSlider = document.getElementById('grainAmount');
const animateGrainCheckbox = document.getElementById('animateGrain');

let baseImage = null;
let animationFrame = null;

imageLoader.addEventListener('change', handleImage, false);
grainAmountSlider.addEventListener('input', drawImageWithGrain);
animateGrainCheckbox.addEventListener('change', () => {
  if (animateGrainCheckbox.checked) {
    animateGrain();
  } else {
    cancelAnimationFrame(animationFrame);
  }
});

function handleImage(e) {
  const reader = new FileReader();
  reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      baseImage = img;
      drawImageWithGrain();
    }
    img.src = event.target.result;
  }
  reader.readAsDataURL(e.target.files[0]);
}

function drawImageWithGrain() {
  if (!baseImage) return;
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  applyFilmGrain();
}

function applyFilmGrain() {
  const grainAmount = parseInt(grainAmountSlider.value, 10) / 100;
  const grainCanvas = document.createElement('canvas');
  const gctx = grainCanvas.getContext('2d');
  grainCanvas.width = canvas.width;
  grainCanvas.height = canvas.height;

  const imageData = gctx.createImageData(canvas.width, canvas.height);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 255 * grainAmount;

    // Film-style RGB shift and low alpha for realism
    imageData.data[i]     = 128 + grain * 0.9; // R
    imageData.data[i + 1] = 128 + grain;       // G
    imageData.data[i + 2] = 128 + grain * 1.1; // B
    imageData.data[i + 3] = 20 + Math.random() * 35;
  }

  gctx.putImageData(imageData, 0, 0);

  ctx.globalAlpha = 1.0;
  ctx.globalCompositeOperation = 'overlay';
  ctx.drawImage(grainCanvas, 0, 0);
  ctx.globalCompositeOperation = 'source-over';
}

function animateGrain() {
  drawImageWithGrain();
  animationFrame = requestAnimationFrame(animateGrain);
}
