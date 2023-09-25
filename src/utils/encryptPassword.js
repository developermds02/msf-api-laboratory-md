const CryptoJS = require('crypto-js')

const passwordCrypt = (message) => {
  return CryptoJS.AES.encrypt(message, process.env.TOKEN_SECRET).toString()
}

const passwordDecrypt = (messageEncrypt) => {
  const bytes = CryptoJS.AES.decrypt(messageEncrypt, process.env.TOKEN_SECRET)
  const originalText = bytes.toString(CryptoJS.enc.Utf8)
  return originalText
}

module.exports = {
  passwordCrypt,
  passwordDecrypt

}
