/* eslint-disable eqeqeq */
/* eslint-disable no-useless-escape */
const fs = require('fs')
const path = require('path')

const createFolders = (buffer, dni, name, status, type) => {
  const folderBasePath = type === 'p12' ? '../documents/certifies' : '../documents/ImageSignin'
  const folderName = path.join(__dirname, folderBasePath, dni)
  const fileName = `${dni}-${name}.${type}`
  const filePath = path.join(folderName, fileName)

  if (status === 'created' || status === 'update') {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName, { recursive: true })
    }

    if (fs.existsSync(folderName) && status === 'update' && type === 'p12') {
      const files = fs.readdirSync(folderName, { recursive: true })
      files.forEach(file => {
        const structure = file.split('-')
        const typefile = file.split('.')
        if (structure[0] === String(dni) && typefile[1] === 'p12') {
          fs.unlinkSync(path.join(folderName, `${file}`))
        }
      })
    }

    if (fs.existsSync(folderName) && status === 'update' && type !== 'p12') {
      const files = fs.readdirSync(folderName, { recursive: true })
      files.forEach(file => {
        const structure = file.split('-')
        if (structure[0] === String(dni)) {
          fs.unlinkSync(path.join(folderName, `${file}`))
        }
      })
    }

    if (type === 'p12' || (type === 'png' || type === 'jpg' || type === 'jpeg')) {
      let base64Data = buffer
      if (type !== 'p12') {
        base64Data = buffer.replace(new RegExp(`^data:image/${type === ('jpg' || 'jpeg') ? 'jpeg' : 'png'};base64,`), '')
      }
      const fileBuffer = Buffer.from(base64Data, 'base64')
      fs.writeFileSync(filePath, fileBuffer)
      return true
    }
  }
  return false
}

const searchDocuments = (dni, name, type) => {
  const folderBasePath1 = type.cert === 'p12' ? '../documents/certifies' : ''
  const folderBasePath2 = type.sig === 'image' && '../documents/ImageSignin'
  const folderNameImage = path.join(__dirname, folderBasePath2, dni)
  const folderNNameP12 = path.join(__dirname, folderBasePath1, dni)

  if (fs.existsSync(folderNameImage) && fs.existsSync(folderNNameP12)) {
    const filesp12 = fs.readdirSync(folderNNameP12, { recursive: true })
    const formatFile = filesp12?.[0].split('.')?.[1]
    const filesimage = fs.readdirSync(folderNameImage, { recursive: true })
    const formatfilesImage = filesimage?.[0].split('.')?.[1]
    return {
      cert: {
        format: formatFile,
        data: fs.readFileSync(path.join(folderNNameP12, filesp12[0]))
      },
      sign: {
        format: formatfilesImage,
        data: fs.readFileSync(path.join(folderNameImage, filesimage[0]))
      }
    }
  }

  if (fs.existsSync(folderNameImage) && type.sig === 'image' && type.cert === '') {
    const files = fs.readdirSync(folderNameImage, { recursive: true })
    const formatFile = files?.[0].split('.')?.[1]
    return {
      sign: {
        format: formatFile,
        data: fs.readFileSync(path.join(folderNameImage, files[0]))
      }
    }
  }
}

module.exports = {
  createFolders,
  searchDocuments
}
