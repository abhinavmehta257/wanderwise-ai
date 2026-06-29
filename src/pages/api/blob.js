import { get } from "@vercel/blob";
import { Readable } from "stream";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const pathname = req.query.pathname;

  if (!pathname || typeof pathname !== "string") {
    return res.status(400).json({ error: "Missing pathname" });
  }

  try {
    const result = await get(pathname, {
      access: "private",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    if (!result) {
      return res.status(404).send("Not found");
    }

    res.setHeader("Cache-Control", "private, no-cache");
    res.setHeader("Content-Type", result.blob.contentType);
    res.setHeader("X-Content-Type-Options", "nosniff");

    const nodeStream = Readable.fromWeb(result.stream);
    nodeStream.pipe(res);
  } catch (error) {
    console.error("Blob fetch error:", error);
    return res.status(404).send("Not found");
  }
}

export const config = {
  api: {
    responseLimit: false,
  },
};
