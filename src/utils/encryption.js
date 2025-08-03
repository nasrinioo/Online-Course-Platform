const crypto = require("node:crypto");

exports.encrypt = (value) => {
  const iv = crypto.randomBytes(8);
  const salt = crypto.randomBytes(16);

  const key = crypto.pbkdf2Sync(
    process.env.ENCRYPTION_SECRET,
    salt,
    1000,
    32,
    "sha512"
  );

  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(String(value), "utf8"),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return Buffer.concat([salt, iv, tag, encrypted]).toString("hex");
};

exports.decrypt = (value) => {
  const stringValue = Buffer.from(String(value), "hex");

  const salt = stringValue.slice(0, 16);
  const iv = stringValue.slice(16, 24);
  const tag = stringValue.slice(24, 40);
  const encrypted = stringValue.slice(40);

  const key = crypto.pbkdf2Sync(
    process.env.ENCRYPTION_SECRET,
    salt,
    1000,
    32,
    "sha512"
  );

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);

  return decipher.update(encrypted) + decipher.final("utf8");
};
