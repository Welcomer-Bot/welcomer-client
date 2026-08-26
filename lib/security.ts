import { createHash, timingSafeEqual } from "node:crypto";
import "server-only";

/**
 * Constant-time comparison for secrets/tokens, safe against timing attacks.
 *
 * `crypto.timingSafeEqual` requires two buffers of equal length and throws
 * otherwise, which would leak the expected length via a thrown/caught branch
 * if callers special-cased mismatched lengths. Hashing both sides first
 * produces fixed-length digests (32 bytes, SHA-256) so the buffers passed to
 * `timingSafeEqual` are always the same length, regardless of the inputs'
 * actual length.
 *
 * @param provided Untrusted value from the request (header, form field...).
 *   `null`/`undefined` is treated as "absent" and always returns `false`.
 * @param expected The known-good secret to compare against.
 */
export function timingSafeEqualString(
  provided: string | null | undefined,
  expected: string,
): boolean {
  if (!provided) return false;
  const providedDigest = createHash("sha256").update(provided).digest();
  const expectedDigest = createHash("sha256").update(expected).digest();
  return timingSafeEqual(providedDigest, expectedDigest);
}
