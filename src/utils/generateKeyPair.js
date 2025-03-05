const CryptoJS = require("crypto-js");

function generateKeyPair() {
  const privateKey = CryptoJS.lib.WordArray.random(32); // 256 bit

  const privateKeyHex = privateKey.toString(CryptoJS.enc.Hex);

  return {privateKey: privateKeyHex};
}

module.exports = {
  generateKeyPair,
};
