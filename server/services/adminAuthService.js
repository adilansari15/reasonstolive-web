import bcrypt from "bcryptjs";
import crypto from "crypto";
import AdminConfig from "../models/AdminConfig.js";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function getSecret() {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) throw new Error("ADMIN_SECRET is not set in environment variables.");
  return secret;
}

/**
 * Sign a payload into a token: base64(payload).HMAC
 */
function signToken(payload) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto
    .createHmac("sha256", getSecret())
    .update(encodedPayload)
    .digest("hex");
  return `${encodedPayload}.${sig}`;
}

/**
 * Verify a token. Returns decoded payload or null.
 */
export function verifyToken(token) {
  try {
    const [encodedPayload, sig] = token.split(".");
    if (!encodedPayload || !sig) return null;

    const expectedSig = crypto
      .createHmac("sha256", getSecret())
      .update(encodedPayload)
      .digest("hex");

    // Timing-safe comparison
    if (!crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expectedSig, "hex"))) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString());
    if (Date.now() > payload.exp) return null; // expired

    return payload;
  } catch {
    return null;
  }
}

/**
 * Ensure the admin password document exists in DB.
 * Called once on server startup.
 */
export async function initAdminPassword() {
  const existing = await AdminConfig.findOne({ key: "admin" });
  if (!existing) {
    const initialPassword = process.env.ADMIN_PASSWORD || "admin2026";
    const hash = await bcrypt.hash(initialPassword, 12);
    await AdminConfig.create({ key: "admin", passwordHash: hash });
    console.log(`🔐 Admin password initialised from ADMIN_PASSWORD env var.`);
  }
}

/**
 * Login: verify password against stored hash. Returns signed token or null.
 */
export async function loginAdmin(password) {
  const config = await AdminConfig.findOne({ key: "admin" });
  if (!config) return null;

  const match = await bcrypt.compare(password, config.passwordHash);
  if (!match) return null;

  const token = signToken({
    role: "admin",
    iat: Date.now(),
    exp: Date.now() + TOKEN_TTL_MS,
  });

  return token;
}

/**
 * Change admin password. Requires correct current password.
 */
export async function changeAdminPassword(currentPassword, newPassword) {
  const config = await AdminConfig.findOne({ key: "admin" });
  if (!config) throw new Error("Admin config not found.");

  const match = await bcrypt.compare(currentPassword, config.passwordHash);
  if (!match) throw new Error("Current password is incorrect.");

  if (!newPassword || newPassword.length < 8) {
    throw new Error("New password must be at least 8 characters.");
  }

  const hash = await bcrypt.hash(newPassword, 12);
  config.passwordHash = hash;
  await config.save();
}

