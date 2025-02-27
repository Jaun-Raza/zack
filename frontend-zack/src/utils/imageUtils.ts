function dataURItoBlob(dataURI: string) {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

function createCircularImage(
  file: File,
  callback: (circularFile: File) => void
) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();

  if (!ctx) return;

  img.onload = function () {
    const size = Math.min(img.width, img.height);
    canvas.width = size;
    canvas.height = size;

    ctx.save(); // Save the current state of the context
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.clip();

    // Draw a transparent rectangle to clear the canvas
    ctx.clearRect(0, 0, size, size);

    const x = (size - img.width) / 2;
    const y = (size - img.height) / 2;
    ctx.drawImage(img, x, y, img.width, img.height);

    ctx.restore(); // Restore the saved state (removes the clipping path)

    const circularImage = canvas.toDataURL(); // No need to specify image/jpeg if you want to preserve transparency
    const blob = dataURItoBlob(circularImage);
    const circularFile = new File([blob], file.name, { type: file.type });
    callback(circularFile);
  };

  img.src = URL.createObjectURL(file);
}

function createHexagonImage(file: File, callback: (hexagonFile: File) => void) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();

  if (!ctx) return;

  img.onload = function () {
    const size = Math.min(img.width, img.height);
    canvas.width = size;
    canvas.height = size;

    ctx.save(); // Save the current state of the context
    ctx.beginPath();
    ctx.moveTo(size / 2, 0);
    ctx.lineTo(size, size / 4);
    ctx.lineTo(size, (size * 3) / 4);
    ctx.lineTo(size / 2, size);
    ctx.lineTo(0, (size * 3) / 4);
    ctx.lineTo(0, size / 4);
    ctx.closePath();
    ctx.clip();

    // Draw a transparent rectangle to clear the canvas
    ctx.clearRect(0, 0, size, size);

    const x = (size - img.width) / 2;
    const y = (size - img.height) / 2;
    ctx.drawImage(img, x, y, img.width, img.height);

    ctx.restore(); // Restore the saved state (removes the clipping path)

    const hexagonImage = canvas.toDataURL(); // No need to specify image/jpeg if you want to preserve transparency
    const blob = dataURItoBlob(hexagonImage);
    const hexagonFile = new File([blob], file.name, { type: file.type });
    callback(hexagonFile);
  };

  img.src = URL.createObjectURL(file);
}

function createRoundedImage(file: File, callback: (roundedFile: File) => void) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();

  if (!ctx) return;

  img.onload = function () {
    const size = Math.min(img.width, img.height);
    const borderRadius = size * 0.3;
    canvas.width = size;
    canvas.height = size;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(borderRadius, 0);
    ctx.lineTo(size - borderRadius, 0);
    ctx.arcTo(size, 0, size, borderRadius, borderRadius);
    ctx.lineTo(size, size - borderRadius);
    ctx.arcTo(size, size, size - borderRadius, size, borderRadius);
    ctx.lineTo(borderRadius, size);
    ctx.arcTo(0, size, 0, size - borderRadius, borderRadius);
    ctx.lineTo(0, borderRadius);
    ctx.arcTo(0, 0, borderRadius, 0, borderRadius);
    ctx.closePath();
    ctx.clip();

    ctx.clearRect(0, 0, size, size);
    const x = (img.width - size) / 2;
    const y = (img.height - size) / 2;
    ctx.drawImage(img, x, y, size, size, 0, 0, size, size);

    ctx.restore();

    const roundedSquareImage = canvas.toDataURL();
    const blob = dataURItoBlob(roundedSquareImage);
    const roundedFile = new File([blob], file.name, { type: file.type });
    callback(roundedFile);
  };

  img.src = URL.createObjectURL(file);
}

export { createCircularImage, createHexagonImage, createRoundedImage };
