const dropZone = document.getElementById('drop-zone');
const imageInput = document.getElementById('image-input');
const compressBtn = document.getElementById('compress-btn');
const progressBar = document.getElementById('progress');
const compressedImage = document.getElementById('compressed-image');
const downloadLink = document.getElementById('download-link');
const browseLink = document.getElementById('browse-link');
const originalSize = document.getElementById('original-size');
const compressedSize = document.getElementById('compressed-size');
const compressionPercentage = document.getElementById('compression-percentage');

let originalFileSize = 0;

// Drag and Drop
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.background = 'rgba(255, 255, 255, 0.2)';
});

dropZone.addEventListener('dragleave', () => {
    dropZone.style.background = 'rgba(255, 255, 255, 0.1)';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.background = 'rgba(255, 255, 255, 0.1)';
    const file = e.dataTransfer.files[0];
    handleFile(file);
});

// Browse File
browseLink.addEventListener('click', () => imageInput.click());
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    handleFile(file);
});

// Handle File
function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) {
        alert('Please upload a valid image file.');
        return;
    }
    compressBtn.disabled = false;
    originalFileSize = (file.size / 1024).toFixed(2); // Size in KB
    originalSize.textContent = `${originalFileSize} KB`;

    const reader = new FileReader();
    reader.onload = (e) => {
        compressedImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Compress Image
compressBtn.addEventListener('click', () => {
    const compressionLevel = parseFloat(document.getElementById('compression-level').value);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
        // Resize image dimensions to reduce file size
        const maxWidth = 800; // Max width for compressed image
        const scale = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Show progress
        progressBar.style.width = '50%';

        canvas.toBlob((blob) => {
            progressBar.style.width = '100%';
            const compressedImageUrl = URL.createObjectURL(blob);
            compressedImage.src = compressedImageUrl;
            downloadLink.href = compressedImageUrl;
            downloadLink.style.display = 'inline-block';

            // Calculate compressed file size
            const compressedFileSize = (blob.size / 1024).toFixed(2); // Size in KB
            compressedSize.textContent = `${compressedFileSize} KB`;

            // Calculate compression percentage
            const percentage = ((1 - (blob.size / (originalFileSize * 1024))) * 100;
            compressionPercentage.textContent = `${percentage.toFixed(2)}%`;
        }, 'image/jpeg', compressionLevel);
    };

    img.src = compressedImage.src;
});