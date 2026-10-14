const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

type PhotoError = 'type' | 'size' | 'read';

/** Validate and read a local prototype photo without uploading it. */
export function readPhoto(
  file: File | undefined,
  onLoad: (image: string) => void,
  onError: (error: PhotoError) => void,
) {
  if (!file) return;
  if (!file.type.startsWith('image/')) { onError('type'); return; }
  if (file.size > MAX_IMAGE_BYTES) { onError('size'); return; }

  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === 'string') onLoad(reader.result);
    else onError('read');
  };
  reader.onerror = () => onError('read');
  reader.readAsDataURL(file);
}
