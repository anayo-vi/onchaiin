/**
 * Utility to compress and resize high-resolution images on client-side
 * before sending over network to prevent Vercel / server payload limits (413 errors).
 * Handles images up to 50MB smoothly while preserving high visual quality.
 */
export async function compressImageFile(
  file: File,
  maxDimension = 2048,
  quality = 0.85
): Promise<File> {
  // If not an image or file is already under 500KB, no compression needed
  if (!file.type.startsWith('image/') || file.size < 500 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Downscale while maintaining aspect ratio if image exceeds maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const newName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
            const compressedFile = new File([blob], newName, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });

            console.log(
              `📸 Image compressed from ${(file.size / (1024 * 1024)).toFixed(2)}MB -> ${(
                compressedFile.size / (1024 * 1024)
              ).toFixed(2)}MB`
            );

            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}
