import { head, put } from "@vercel/blob";

/**
 * Vercel Blob read-write token from the linked Blob store.
 * @see https://vercel.com/docs/vercel-blob/using-blob-sdk#authentication
 */
export function getBlobReadWriteToken() {
  return process.env.BLOB_READ_WRITE_TOKEN?.trim() || null;
}

export function isBlobConfigured() {
  return Boolean(getBlobReadWriteToken());
}

export function assertBlobReadWriteToken() {
  const token = getBlobReadWriteToken();

  if (!token) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not configured. Link a Vercel Blob store to this project or add the read-write token to your environment."
    );
  }

  return token;
}

export function getBlobServeUrl(pathname) {
  return `/api/blob?pathname=${encodeURIComponent(pathname)}`;
}

export async function blobHead(pathname) {
  const token = assertBlobReadWriteToken();

  return head(pathname, { token });
}

export async function blobPut(pathname, body, options = {}) {
  const token = assertBlobReadWriteToken();

  return put(pathname, body, {
    access: "private",
    ...options,
    token,
  });
}
