function arrayBufferToDataUrl(buffer, contentType) {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = '';

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return `data:${contentType};base64,${btoa(binary)}`;
}

export function getBlobPathname(imagePath) {
  if (!imagePath) return null;

  const query = imagePath.includes('?') ? imagePath.split('?')[1] : '';
  if (!query) return null;

  const pathname = new URLSearchParams(query).get('pathname');
  return pathname || null;
}

export async function fetchTripHeroBackground(request, { image, pathname }) {
  if (pathname && process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { get } = await import('@vercel/blob');
      const result = await get(pathname, {
        access: 'private',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      if (result?.stream) {
        const buffer = await new Response(result.stream).arrayBuffer();
        const contentType = result.blob?.contentType || 'image/webp';
        return arrayBufferToDataUrl(buffer, contentType);
      }
    } catch (error) {
      console.error('OG blob fetch failed:', error.message);
    }
  }

  if (!image) return null;

  const origin = new URL(request.url).origin;
  const absoluteUrl = image.startsWith('http') ? image : `${origin}${image.startsWith('/') ? image : `/${image}`}`;

  try {
    const response = await fetch(absoluteUrl);
    if (!response.ok) return null;

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    return arrayBufferToDataUrl(buffer, contentType);
  } catch (error) {
    console.error('OG image fetch failed:', error.message);
    return null;
  }
}
