import Hashids from 'hashids';

/**
 * Standard Hashids configuration with private salt and 8-character minimum length.
 * Encodes sequential IDs (1, 2, 3...) into clean, YouTube-style alphanumeric hashes.
 * Example:
 *   1 -> "2xvLgRO3"
 */
const SALT = 'havin-dev-portfolio-secure-salt-2026';
const MIN_LENGTH = 8;

const hashids = new Hashids(SALT, MIN_LENGTH);

/**
 * Encodes numeric project ID into a secure hash token using Hashids
 * @param {number|string} id 
 * @returns {string} Alphanumeric Hashids token
 */
export function encodeProjectId(id) {
  const num = parseInt(id, 10);
  if (isNaN(num) || num <= 0) return '';
  return hashids.encode(num);
}

/**
 * Decodes a Hashids token back into the numeric project ID
 * @param {string} token 
 * @returns {number|null} Original integer ID or null if invalid
 */
export function decodeProjectId(token) {
  if (!token) return null;
  const str = String(token).trim();

  // Legacy fallback: if already a numeric string, support it directly
  if (/^\d+$/.test(str)) {
    return parseInt(str, 10);
  }

  const decoded = hashids.decode(str);
  if (decoded && decoded.length > 0) {
    return Number(decoded[0]);
  }

  return null;
}

export default hashids;
