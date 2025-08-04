const crypto = require("node:crypto");

const OAUTH2_STATE_BYTES = 32;
const REGEX_PLUS_SIGN = /\+/g;
const REGEX_FORWARD_SLASH = /\//g;
const REGEX_EQUALS_SIGN = /=/g;

/**
 * Generate random bytes using crypto library
 * @param {number} size - The number of random bytes to generate
 * @returns {Buffer} The generated random bytes
 */
exports.generateRandomBytes = (size) => {
  return crypto.randomBytes(size);
};

/**
 * Encode byte buffer into a base64 URL safe string
 * @param {Buffer} bytesToEncode - The bytes to encode
 * @returns {string} The URL safe base64 encoded string
 */
exports.generateBase64UrlEncodedString = (bytesToEncode) => {
  return bytesToEncode
    .toString("base64")
    .replace(REGEX_PLUS_SIGN, "-")
    .replace(REGEX_FORWARD_SLASH, "_")
    .replace(REGEX_EQUALS_SIGN, "");
};

/**
 * Generate OAuth2.0 state for Authorization and Implicit grant flow
 * @returns {string} The URL safe base64 encoded state string
 */
exports.generateClientState = () => {
  return exports.generateBase64UrlEncodedString(
    exports.generateRandomBytes(OAUTH2_STATE_BYTES)
  );
};
