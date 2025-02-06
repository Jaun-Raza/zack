import { createCanvas, loadImage } from 'canvas';
import GIFEncoder from 'gifencoder';
import { PassThrough } from 'stream';

async function addAnimatedBorder(imagePath, color1, color2) {
    // Load the image
    const image = await loadImage(imagePath);

    // Create canvas to draw animated border
    const borderWidth = 6; // Adjust the border width
    const canvas = createCanvas(image.width + 2 * borderWidth, image.height + 2 * borderWidth);
    const ctx = canvas.getContext('2d');

    // Create GIF encoder
    const encoder = new GIFEncoder(canvas.width, canvas.height);
    const stream = new PassThrough();
    encoder.createReadStream().pipe(stream); // Pipe encoder stream to the PassThrough stream
    encoder.start();
    encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
    encoder.setDelay(100);  // Frame delay in ms

    // Draw each frame with an animated gradient border
    const numFrames = 360; // Use 360 frames for a smooth circular motion
    for (let frame = 0; frame < numFrames; frame++) {
        ctx.fillStyle = 'white'; // Replace 'white' with the background color of your image
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, borderWidth, borderWidth, image.width, image.height);

        const angle = (frame / numFrames) * 2 * Math.PI; // Calculate angle

        // Calculate gradient position based on angle
        const gradient1PositionX = (0.5 + 0.5 * Math.cos(angle)) * canvas.width;
        const gradient1PositionY = (0.5 + 0.5 * Math.sin(angle)) * canvas.height;
        const gradient2PositionX = (0.5 + 0.5 * Math.cos(angle + Math.PI)) * canvas.width;
        const gradient2PositionY = (0.5 + 0.5 * Math.sin(angle + Math.PI)) * canvas.height;

        // Create linear gradient
        const gradient = ctx.createLinearGradient(gradient1PositionX, gradient1PositionY, gradient2PositionX, gradient2PositionY);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = borderWidth;
        ctx.strokeRect(borderWidth / 2, borderWidth / 2, canvas.width - borderWidth, canvas.height - borderWidth);

        // Get the canvas's content in raw pixel data format and add it as a frame
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        encoder.addFrame(imageData.data, true); // Add frame with transparency
    }

    // Finish encoding
    encoder.finish();

    // Return the stream
    return stream;
}

export default addAnimatedBorder;
