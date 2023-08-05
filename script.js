const uploadInput = document.getElementById('upload');
const resultDiv = document.getElementById('result');

uploadInput.addEventListener('change', handleUpload);

function handleUpload(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (readerEvent) {
    const image = new Image();

    image.onload = function () {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = image.width;
      canvas.height = image.height;

      ctx.drawImage(image, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const cartoonData = cartoonifyImage(imageData);

      const resultImage = new Image();
      resultImage.src = getImageDataURL(cartoonData);
      resultDiv.innerHTML = '';
      resultDiv.appendChild(resultImage);
      resultDiv.style.display = 'block';
    };

    image.src = readerEvent.target.result;
  };

  reader.readAsDataURL(file);
}

function cartoonifyImage(imageData) {
  const { data, width, height } = imageData;
  const gray = new Uint8ClampedArray(width * height);
  const edges = new Uint8ClampedArray(width * height);
  const color = new Uint8ClampedArray(width * height * 4);

  // Convert image data to grayscale
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const avg = (r + g + b) / 3;

    gray[i / 4] = avg;
  }

  // Apply edge detection
  // (You can replace this with your edge detection algorithm)
  for (let i = 0; i < gray.length; i++) {
    edges[i] = 255 - gray[i];
  }

  // Apply colorization
  // (You can replace this with your colorization algorithm)
  for (let i = 0; i < color.length; i += 4) {
    const edge = edges[i / 4];

    color[i] = edge;
    color[i + 1] = edge;
    color[i + 2] = edge;
    color[i + 3] = 255;
  }

  return new ImageData(color, width, height);
}

function getImageDataURL(imageData) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}
