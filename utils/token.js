import crypto from "crypto";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

function getSecret() {
  const secret = process.env.API_SECRET_KEY;
  if (!secret) {
    throw new Error("API_SECRET_KEY is not configured");
  }
  return secret;
}

export function signFormToken(instagramUserId) {
  const payload = {
    instagramUserId,
    exp: Date.now() + TOKEN_TTL_MS,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSecret())
    .update(encoded)
    .digest("base64url");

  return `${encoded}.${signature}`;
}

export function verifyFormToken(token) {
  if (!token || typeof token !== "string") {
    return null;
  }

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) {
    return null;
  }

  const expectedSignature = crypto
    .createHmac("sha256", getSecret())
    .update(encoded)
    .digest("base64url");

  if (
    signature.length !== expectedSignature.length ||
    !crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    );

    if (!payload.instagramUserId || Date.now() > payload.exp) {
      return null;
    }

    return { instagramUserId: payload.instagramUserId };
  } catch {
    return null;
  }
}
