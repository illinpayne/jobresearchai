import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImage(filename: string) {
  if (filename.includes('google')) {
    return filename;
  }
  return `/s3-storage/avatars/${filename}`;
}

export async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<Blob> {
  const image = new Image();
  image.src = imageSrc;
  // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx?.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob as Blob), 'image/webp', 0.8);
  });
}
