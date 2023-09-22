/* eslint-disable no-useless-escape */
const fs = require('fs')
const path = require('path')

const createFolders = (buffer, dni, name, status, type) => {
  const folderBasePath = type === 'p12' ? '../certifies' : '../ImageSignin'
  const folderBasePathDelete = type === 'p12' ? path.join(__dirname, '../ImageSignin', dni) : path.join(__dirname, '../certifies', dni)
  const folderName = path.join(__dirname, folderBasePath, dni)
  const fileName = `${dni}-${name}.${type}`
  const filePath = path.join(folderName, fileName)

  if (status === 'created' || status === 'update') {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName, { recursive: true })
    }

    if (fs.existsSync(folderBasePathDelete)) { // comprobar que existe en la carpeta de imagenes para borrar ya que va hacer el cambio de certificado a imagen
      console.log('comprobar si existe en certificado para eliminarlo')
      const files = fs.readdirSync(folderBasePathDelete, { recursive: true })
      files.forEach(file => {
        // const typeFile = file.split('.')  //45784578-jose.p12'
        const structure = file.split('-')
        if (structure[0] === String(dni)) {
          fs.unlinkSync(path.join(folderBasePathDelete, file))
        }
      })
    }

    if (fs.existsSync(filePath) && status === 'update') {
      const files = fs.readdirSync(folderName, { recursive: true })
      files.forEach(file => {
        const structure = file.split('_')
        if (structure[0] === String(dni) && structure[1] === String(name)) {
          fs.unlinkSync(path.join(folderName, file))
        }
      })
    }

    if (type === 'p12' || (type === 'png' || type === 'jpg' || type === 'jpeg')) {
      let base64Data = buffer
      if (type !== 'p12') {
        base64Data = buffer.replace(new RegExp(`^data:image/${type};base64,`), '')
      }
      const fileBuffer = Buffer.from(base64Data, 'base64')
      fs.writeFileSync(filePath, fileBuffer)
      return true
    }
  }
  return false
}
module.exports = {
  createFolders
}
