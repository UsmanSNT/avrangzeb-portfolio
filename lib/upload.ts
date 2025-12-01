// Rasm yuklash yordamchi funksiyasi

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

/**
 * Rasmni Supabase Storage ga yuklash
 * @param file - Yuklanadigan fayl
 * @param folder - Papka nomi (book-quotes, gallery, notes)
 * @returns Upload natijasi
 */
export async function uploadImage(file: File, folder: string = 'general'): Promise<UploadResult> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!result.success) {
      return { success: false, error: result.error };
    }

    return {
      success: true,
      url: result.data.url,
      path: result.data.path,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to upload image',
    };
  }
}

/**
 * Rasmni o'chirish
 * @param path - Fayl yo'li
 */
export async function deleteImage(path: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`/api/upload?path=${encodeURIComponent(path)}`, {
      method: 'DELETE',
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return { success: false, error: 'Failed to delete image' };
  }
}

/**
 * Base64 ni File ga aylantirish
 * @param base64 - Base64 string
 * @param filename - Fayl nomi
 * @returns File object
 */
export function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

/**
 * Rasmni siqish
 * @param file - Asl fayl
 * @param maxWidth - Maksimal kenglik
 * @param quality - Sifat (0-1)
 * @returns Siqilgan fayl
 */
export function compressImage(
  file: File,
  maxWidth: number = 1200,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Bir nechta rasmlarni yuklash
 * @param files - Fayllar ro'yxati
 * @param folder - Papka nomi
 * @param onProgress - Progress callback
 * @returns Yuklangan rasmlar URL lari
 */
export async function uploadMultipleImages(
  files: File[],
  folder: string = 'general',
  onProgress?: (current: number, total: number) => void
): Promise<string[]> {
  const urls: string[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const compressedFile = await compressImage(files[i], 1200, 0.8);
    const result = await uploadImage(compressedFile, folder);
    
    if (result.success && result.url) {
      urls.push(result.url);
    }
    
    onProgress?.(i + 1, files.length);
  }
  
  return urls;
}

