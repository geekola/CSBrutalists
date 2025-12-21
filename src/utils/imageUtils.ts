const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;

export interface ImageValidationError {
  type: 'size' | 'format' | 'dimensions' | 'general';
  message: string;
}

export const validateImage = (file: File): ImageValidationError | null => {
  if (file.size > MAX_FILE_SIZE) {
    return {
      type: 'size',
      message: `File size exceeds 5MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`
    };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      type: 'format',
      message: `Invalid file format. Allowed formats: JPEG, JPG, PNG, GIF, WebP`
    };
  }

  return null;
};

export const validateImageDimensions = (
  file: File
): Promise<ImageValidationError | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      if (img.width > MAX_WIDTH || img.height > MAX_HEIGHT) {
        resolve({
          type: 'dimensions',
          message: `Image dimensions exceed maximum allowed (${MAX_WIDTH}x${MAX_HEIGHT}). Current: ${img.width}x${img.height}`
        });
      } else {
        resolve(null);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        type: 'general',
        message: 'Failed to load image for validation'
      });
    };

    img.src = url;
  });
};

export const compressImage = (
  file: File,
  maxWidth: number = MAX_WIDTH,
  maxHeight: number = MAX_HEIGHT,
  quality: number = 0.8
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;
        if (width > height) {
          width = maxWidth;
          height = width / aspectRatio;
        } else {
          height = maxHeight;
          width = height * aspectRatio;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
};

export const convertBlobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert blob to base64'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read blob'));
    reader.readAsDataURL(blob);
  });
};

export const processImage = async (file: File): Promise<string> => {
  const validationError = validateImage(file);
  if (validationError) {
    throw new Error(validationError.message);
  }

  const dimensionError = await validateImageDimensions(file);
  if (dimensionError) {
    throw new Error(dimensionError.message);
  }

  const compressedBlob = await compressImage(file);

  if (compressedBlob.size > MAX_FILE_SIZE) {
    const lowerQualityBlob = await compressImage(file, MAX_WIDTH, MAX_HEIGHT, 0.6);
    return await convertBlobToBase64(lowerQualityBlob);
  }

  return await convertBlobToBase64(compressedBlob);
};
