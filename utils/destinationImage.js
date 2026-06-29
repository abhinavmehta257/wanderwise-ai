import OpenAI from "openai";
import { normalizeLocation } from "./location";
import {
  blobHead,
  blobPut,
  getBlobServeUrl,
  isBlobConfigured,
} from "./vercelBlob";

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });
const IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1-mini";
const FALLBACK_IMAGE = "/traveller.jpeg";

function extractLocationTerms(location) {
  const full = String(location || "").trim();
  const primary = full.split(",")[0].trim();
  return { full, primary };
}

function buildImagePrompt(location) {
  const { full, primary } = extractLocationTerms(location);
  const place = full || primary;

  return [
    `A breathtaking wide landscape travel photograph of ${place}.`,
    "Show iconic scenery, architecture, or natural landmarks that represent the destination.",
    "Golden hour lighting, cinematic composition, photorealistic, vibrant colors.",
    "No text, no watermarks, no logos, no collage.",
  ].join(" ");
}

function locationToPathname(location) {
  const slug = normalizeLocation(location)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `trip-destinations/${slug || "destination"}.webp`;
}

async function blobExists(pathname) {
  if (!isBlobConfigured()) {
    return false;
  }

  try {
    await blobHead(pathname);
    return true;
  } catch {
    return false;
  }
}

async function generateAndStoreImage(location) {
  const prompt = buildImagePrompt(location);
  const pathname = locationToPathname(location);

  const response = await openai.images.generate({
    model: IMAGE_MODEL,
    prompt,
    size: "1536x1024",
    quality: "medium",
    output_format: "webp",
    n: 1,
  });

  const imageData = response.data?.[0]?.b64_json;
  if (!imageData) {
    throw new Error("OpenAI image generation returned no image data");
  }

  const buffer = Buffer.from(imageData, "base64");

  await blobPut(pathname, buffer, {
    contentType: "image/webp",
    addRandomSuffix: false,
    allowOverwrite: true,
  });

  return getBlobServeUrl(pathname);
}

export async function getDestinationImage(location, aiDestination) {
  const searchLocation = location || aiDestination;

  if (!searchLocation) {
    return FALLBACK_IMAGE;
  }

  const pathname = locationToPathname(searchLocation);

  if (await blobExists(pathname)) {
    return getBlobServeUrl(pathname);
  }

  if (!process.env.OPEN_AI_KEY) {
    console.warn("OPEN_AI_KEY missing, cannot generate destination image");
    return FALLBACK_IMAGE;
  }

  if (!isBlobConfigured()) {
    console.warn(
      "BLOB_READ_WRITE_TOKEN missing, cannot store destination image in Vercel Blob"
    );
    return FALLBACK_IMAGE;
  }

  try {
    return await generateAndStoreImage(searchLocation);
  } catch (error) {
    console.error(
      `Destination image generation failed for "${searchLocation}":`,
      error.message
    );
    return FALLBACK_IMAGE;
  }
}
