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
  const grainAmount = parseInt(grainAmountSlider.value, 10); // now 0–300
  const grainScale = parseInt(grainScaleSlider.value, 10);

  const gCanvas = document.createElement('canvas');
  const gctx = gCanvas.getContext('2d');
  const scaledWidth = Math.floor(canvas.width / grainScale);
  const scaledHeight = Math.floor(canvas.height / grainScale);

  gCanvas.width = scaledWidth;
  gCanvas.height = scaledHeight;

  const imageData = gctx.createImageData(scaledWidth, scaledHeight);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const grain = (Math.random() - 0.5) * grainAmount;

    // Clamp to 0–255 to avoid overflow
    const r = Math.min(255, Math.max(0, 128 + grain * 0.9));
    const g = Math.min(255, Math.max(0, 128 + grain));
    const b = Math.min(255, Math.max(0, 128 + grain * 1.1));
    const a = Math.min(255, Math.max(0, 40 + Math.random() * 50));

    imageData.data[i]     = r;
    imageData.data[i + 1] = g;
    imageData.data[i + 2] = b;
    imageData.data[i + 3] = a;
  }

  gctx.putImageData(imageData, 0, 0);

  ctx.globalAlpha = 1.0;
  ctx.globalCompositeOperation = 'overlay';
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(gCanvas, 0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'source-over';
}


  // Scale up the grain canvas and overlay
  ctx.globalAlpha = 1.0;
  ctx.globalCompositeOperation = 'overlay';
  ctx.imageSmoothingEnabled = false; // keeps grain pixelated when scaled
  ctx.drawImage(gCanvas, 0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'source-over';
}
