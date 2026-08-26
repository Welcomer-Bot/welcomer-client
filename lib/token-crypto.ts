import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import "server-only";

import { requireEnv } from "@/lib/env";
import { AppError, ErrorCode } from "@/lib/error";

/**
 * AES-256-GCM encryption for values persisted at rest in Postgres —
 * currently `Session.accessToken` and `Session.refreshToken`.
 *
 * Exported as `encryptToken`/`decryptToken` rather than the more obvious
 * `encrypt`/`decrypt`: `lib/session.ts` already exports `encrypt`/`decrypt`
 * for the JWT session cookie, and `lib/dal/session.ts` already does
 * `import { decrypt } from "@/lib/session"`. Reusing the bare names here
 * would force an alias at any call site that needs both, and a missed or
 * careless alias is exactly how you end up "decrypting the wrong thing" —
 * running a JWT payload through the token cipher, or vice versa. Distinct
 * names make the two unmistakable without relying on import discipline.
 */

const IV_LENGTH = 12; // bytes — see the comment in encryptToken for why 12
const AUTH_TAG_LENGTH = 16; // bytes, standard GCM tag size
const KEY_LENGTH = 32; // bytes, required for AES-256
const VERSION_PREFIX = "v1:";

/**
 * Read and validate `TOKEN_ENCRYPTION_KEY`.
 *
 * Deliberately called from inside `encryptToken`/`decryptToken` rather than
 * evaluated at module top-level. Compare `lib/session.ts:12`, which calls
 * `requireEnv("SESSION_SECRET")` at top level — that line runs the instant
 * Next.js's `next build` page-data collection imports the module, which is
 * exactly why `SESSION_SECRET` had to be threaded into the Dockerfile
 * builder stage as a BuildKit secret. A lazy read here means
 * `TOKEN_ENCRYPTION_KEY` never needs to exist at build time: no Dockerfile
 * change, no GitHub Actions secret — it's runtime-only.
 */
function getKey(): Buffer {
  const raw = requireEnv("TOKEN_ENCRYPTION_KEY");
  // `Buffer.from(str, "base64")` never throws on invalid input in Node — it
  // silently drops characters that aren't valid base64 instead of raising an
  // error. That means only the resulting byte length can be validated here;
  // a garbled-but-32-byte string still passes this check. That's inherent to
  // symmetric key validation and isn't fixable without a MAC-of-known-value
  // scheme, which is deliberately out of scope for this helper.
  const key = Buffer.from(raw, "base64");
  if (key.length !== KEY_LENGTH) {
    throw new AppError(
      `TOKEN_ENCRYPTION_KEY must decode to exactly ${KEY_LENGTH} bytes, but got ${key.length}. Generate a valid value with: openssl rand -base64 32`,
      ErrorCode.INTERNAL_SERVER_ERROR,
      500,
      { env: "TOKEN_ENCRYPTION_KEY" },
    );
  }
  return key;
}

/**
 * Build the single, fixed-message error thrown for every decryption
 * failure. Routing every failure through one helper (rather than throwing
 * distinct `AppError`s at each site) guarantees the message never varies —
 * see the requirement documented on {@link decryptToken}.
 */
function decryptionFailedError(): AppError {
  return new AppError(
    "Failed to decrypt stored token",
    ErrorCode.INTERNAL_SERVER_ERROR,
    500,
  );
}

/**
 * Encrypt a plaintext string (an OAuth access/refresh token) for storage.
 *
 * Output format: `v1:` + base64(iv[12] ‖ authTag[16] ‖ ciphertext).
 * - `v1:` is a literal version prefix so a future key-rotation scheme can
 *   introduce a `v2:` format and dispatch on the prefix. This is NOT a
 *   rotation scheme by itself — there is no multi-key support and no
 *   re-encryption job here, just the minimal hook a real one would need.
 * - Everything after the prefix is ONE base64 blob rather than three
 *   colon-joined base64 fields: the IV and tag lengths are fixed and known
 *   ahead of time, so decoding is a byte-offset slice with no field-count
 *   ambiguity to parse. Base64 is also plain ASCII, so the whole value
 *   stores in a Postgres TEXT column with no escaping concerns.
 */
export function encryptToken(plaintext: string): string {
  const key = getKey();
  // 12-byte IV, freshly random per call: 96 bits is the size GCM is
  // designed around (NIST SP 800-38D) — a 12-byte IV is used directly with
  // an internal 32-bit counter, whereas any other length is first run
  // through GHASH, which is slower and non-standard. `randomBytes` (rather
  // than `webcrypto`) matches the rest of this repo's crypto
  // (`lib/security.ts`) and keeps this function synchronous.
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv("aes-256-gcm", key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  const payload = Buffer.concat([iv, authTag, ciphertext]);
  return VERSION_PREFIX + payload.toString("base64");
}

/**
 * Decrypt a value previously produced by {@link encryptToken}.
 *
 * @throws AppError with a single fixed, log-safe message — never containing
 *   the input string, decoded bytes, plaintext, or ciphertext — for any of:
 *   a missing/unknown version prefix, a payload shorter than IV + auth tag,
 *   or a tampered ciphertext (GCM auth tag verification failure from
 *   `decipher.final()`). AGENTS.md forbids logging tokens, and
 *   `reportError` forwards 500-level `AppError`s to Sentry, so this message
 *   must be safe to log regardless of which failure triggered it.
 */
export function decryptToken(stored: string): string {
  if (!stored.startsWith(VERSION_PREFIX)) {
    throw decryptionFailedError();
  }

  const key = getKey();
  const payload = Buffer.from(stored.slice(VERSION_PREFIX.length), "base64");
  if (payload.length < IV_LENGTH + AUTH_TAG_LENGTH) {
    throw decryptionFailedError();
  }

  const iv = payload.subarray(0, IV_LENGTH);
  const authTag = payload.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = payload.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  try {
    const decipher = createDecipheriv("aes-256-gcm", key, iv, {
      authTagLength: AUTH_TAG_LENGTH,
    });
    decipher.setAuthTag(authTag);
    const plaintext = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);
    return plaintext.toString("utf8");
  } catch {
    // Covers a wrong/tampered auth tag (decipher.final() throws) as well as
    // any other decrypt-time failure — all collapse to the same safe error.
    throw decryptionFailedError();
  } 
}
