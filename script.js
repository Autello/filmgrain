const imageLoader = document.getElementById('imageLoader');
const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
const grainAmountSlider = document.getElementById('grainAmount');
const grainScaleSlider = document.getElementById('grainScale');

let baseImage = null;

imageLoader.addEventListener('change', handleImage, false);
grainAmountSlider.addEventListener('input', drawImageWithGrain);
grainScaleSlider.addEventListener('input', drawImageWithGrain);

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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  applyFilmGrain();
}

function applyFilmGrain() {
  const grainAmount = parseInt(grainAmountSlider.value, 10) / 100;
  const grainScale = parseInt(grainScaleSlider.value, 10);

  const gCanvas = document.createElement('canvas');
  const gctx = gCanvas.getContext('2d');
  const scaledWidth = Math.floor(canvas.width / grainScale);
  const scaledHeight = Math.floor(canvas.height / grainScale);

  gCanvas.width = scaledWidth;
  gCanvas.height = scaledHeight;

  const imageData = gctx.createImageData(scaledWidth, scaledHeight);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 255 * grainAmount;

    imageData.data[i]     = 128 + grain * 0.9;
    imageData.data[i + 1] = 128 + grain;
    imageData.data[i + 2] = 128 + grain * 1.1;
    imageData.data[i + 3] = 30 + Math.random() * 30;
  }

  gctx.putImageData(imageData, 0, 0);

  // Scale up the grain canvas and overlay
  ctx.globalAlpha = 1.0;
  ctx.globalCompositeOperation = 'overlay';
  ctx.imageSmoothingEnabled = false; // keeps grain pixelated when scaled
  ctx.drawImage(gCanvas, 0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'source-over';
}
