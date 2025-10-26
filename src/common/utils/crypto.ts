// encrypt-decrypt.ts
import crypto from 'crypto';

type EncryptedPayload = {
  // all fields are base64-encoded strings
  salt: string;
  iv: string;
  tag: string;
  ciphertext: string;
};

const SALT_BYTES = 16; // PBKDF2 salt size
const IV_BYTES = 12; // recommended for GCM
const KEY_BYTES = 32; // 256-bit key
const PBKDF2_ITER = 100_000; // iterations (tune as appropriate)
const PBKDF2_DIGEST = 'sha256';

/**
 * Derive a symmetric key from a master secret (e.g., APP_MASTER_KEY).
 * @param masterSecret - secret from env/secret manager
 * @param salt - Buffer salt
 */
function deriveKey(masterSecret: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(
    Buffer.from(masterSecret, 'utf8'),
    salt,
    PBKDF2_ITER,
    KEY_BYTES,
    PBKDF2_DIGEST,
  );
}

/**
 * Encrypt a plaintext string (app password) using AES-256-GCM.
 * Returns a compact JSON object encoded as base64 string for storage.
 * @param masterSecret - secret used to derive encryption key (keep safe!)
 * @param plaintext - string to encrypt (e.g., "smtp-app-password-abc123")
 */
export function encryptAppPassword(
  masterSecret: string,
  plaintext: string,
): string {
  const salt = crypto.randomBytes(SALT_BYTES);
  const iv = crypto.randomBytes(IV_BYTES);
  const key = deriveKey(masterSecret, salt);

  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  const payload: EncryptedPayload = {
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    ciphertext: ciphertext.toString('base64'),
  };

  // You can store the JSON string or encode it again as base64 for DB
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

/**
 * Decrypt a base64-encoded JSON payload produced by encryptAppPassword.
 * @param masterSecret - same secret used to encrypt
 * @param blob - base64 string returned by encryptAppPassword
 */
export function decryptAppPassword(masterSecret: string, blob: string): string {
  const json = Buffer.from(blob, 'base64').toString('utf8');
  const payload = JSON.parse(json) as EncryptedPayload;

  const salt = Buffer.from(payload.salt, 'base64');
  const iv = Buffer.from(payload.iv, 'base64');
  const tag = Buffer.from(payload.tag, 'base64');
  const ciphertext = Buffer.from(payload.ciphertext, 'base64');

  const key = deriveKey(masterSecret, salt);

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);

  const plaintext = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]).toString('utf8');
  return plaintext;
}

/* ===== Example usage =====
(async () => {
  const MASTER = process.env.APP_MASTER_KEY || "change_this_to_secure_value";
  const secret = "smtp-app-password-very-secret-123";

  const blob = encryptAppPassword(MASTER, secret);
  console.log("Encrypted blob:", blob);

  const recovered = decryptAppPassword(MASTER, blob);
  console.log("Recovered:", recovered);
})();
*/

export const CryptoUtils = {
  encryptAppPassword,
  decryptAppPassword,
};
