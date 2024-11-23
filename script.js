document.getElementById('upload-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const fileInput = document.getElementById('imageInput');
    const effectSelect = document.getElementById('effectSelect');
    const effect = effectSelect.value;

    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                // Create a canvas to draw the resized image
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;

                // Draw the original image
                ctx.drawImage(img, 0, 0);

                // Get the image data
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                if (effect === 'grayscale') {
                    // Apply Grayscale Effect
                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i];
                        const g = data[i + 1];
                        const b = data[i + 2];
                        const gray = 0.3 * r + 0.59 * g + 0.11 * b;
                        data[i] = data[i + 1] = data[i + 2] = gray;
                    }
                } else if (effect === 'blur') {
                    // Apply Less Intense Blur Effect
                    const blurRadius = 15; // Reduced the blur radius to make the blur less intense
                    for (let y = 1; y < canvas.height - 1; y++) {
                        for (let x = 1; x < canvas.width - 1; x++) {
                            let r = 0, g = 0, b = 0;
                            let count = 0;
                            // Loop through a 3x3 square of pixels
                            for (let ky = -blurRadius; ky <= blurRadius; ky++) {
                                for (let kx = -blurRadius; kx <= blurRadius; kx++) {
                                    const px = x + kx;
                                    const py = y + ky;
                                    if (px >= 0 && py >= 0 && px < canvas.width && py < canvas.height) {
                                        const pixelIndex = (py * canvas.width + px) * 4;
                                        r += data[pixelIndex];
                                        g += data[pixelIndex + 1];
                                        b += data[pixelIndex + 2];
                                        count++;
                                    }
                                }
                            }
                            const newIndex = (y * canvas.width + x) * 4;
                            data[newIndex] = r / count;
                            data[newIndex + 1] = g / count;
                            data[newIndex + 2] = b / count;
                        }
                    }
                }

                // Update the canvas with modified image data
                ctx.putImageData(imageData, 0, 0);

                // Create image element for preview
                const transformedImage = canvas.toDataURL();

                // Store the original and transformed images in sessionStorage
                sessionStorage.setItem('originalImage', img.src);
                sessionStorage.setItem('transformedImage', transformedImage);

                // Redirect to a new page to show the images
                window.location.href = 'result.html';
            };
            img.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }
});
