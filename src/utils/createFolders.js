const fs = require('fs')
const path = require('path')

const createFolders = (image, dni, name, status) => {
  const folderName = path.join(__dirname, `../ImageSignin/${dni}`)
  const base64Data = image.replace(/^data:image\/png;base64,/, '')
  const imageBuffer = Buffer.from(base64Data, 'base64')
  if (!fs.existsSync(folderName) && status === 'created') {
    fs.mkdirSync(folderName, { recursive: true })
    fs.writeFileSync(path.join(__dirname, `../ImageSignin/${dni}/${dni}-${name}.png`), imageBuffer)
    return true
  } else if (status === 'updated') {
    const files = fs.readdirSync(folderName, { recursive: true })
    // recorremos y eliminamos el archivo
    files.forEach(file => {
      const structure = file.split('_')
      if (structure[0] === String(dni) && structure[1] === String(name)) {
        fs.unlinkSync(`${folderName}/${file}`)
      }
    })
    fs.writeFileSync(path.join(__dirname, `../ImageSignin/${dni}/${dni}-${name}.png`), imageBuffer)
    return true
  }
}

module.exports = {
  createFolders
}
