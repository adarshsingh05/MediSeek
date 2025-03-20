const crypto = require("crypto");
const SECRET_KEY = process.env.CHAT_SECRET || "adarsh1234";

// Encrypt message
const encryptMessage = (text) => {
  const cipher = crypto.createCipher("aes-256-cbc", SECRET_KEY);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

// Decrypt message
const decryptMessage = (encryptedText) => {
  const decipher = crypto.createDecipher("aes-256-cbc", SECRET_KEY);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

module.exports = { encryptMessage, decryptMessage };
