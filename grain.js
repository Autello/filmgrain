const imageCanvas = document.getElementById('imageCanvas');
const grainCanvas = document.getElementById('grainCanvas');
const imageCtx = imageCanvas.getContext('2d');
const grainCtx = grainCanvas.getContext('2d');

const grainAmountSlider = document.getElementById('grainAmount');
const grainScaleSlider = document.getElementById('grainScale');

let grainAmount = parseFloat(grainAmountSlider.value);
let grainScale = parseFloat(grainScaleSlider.value);

let image = new Image();

function resizeCanvasToImage(img) {
  imageCanvas.width = img.width;
  imageCanvas.height = img.height;
  grainCanvas.width = img.width;
  grainCanvas.height = img.height;
}

function drawImage(img) {
  resizeCanvasToImage(img);
  imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
  imageCtx.drawImage(img, 0, 0, imageCanvas.width, imageCanvas.height);
}

function drawFilmGrain() {
  const width = grainCanvas.width;
  const height = grainCanvas.height;
  const imageData = grainCtx.createImageData(width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
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

  grainCtx.putImageData(imageData, 0, 0);
}

function animateGrain() {
  if (image.src) drawFilmGrain();
  requestAnimationFrame(animateGrain);
}
animateGrain();

document.getElementById('imageUpload').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    image.onload = () => drawImage(image);
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
});

grainAmountSlider.addEventListener('input', () => {
  grainAmount = parseFloat(grainAmountSlider.value);
});
grainScaleSlider.addEventListener('input', () => {
  grainScale = parseFloat(grainScaleSlider.value);
});
