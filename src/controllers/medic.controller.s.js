/* eslint-disable no-const-assign */
/* eslint-disable no-unused-vars */
const { Client } = require('pg')
const connectionString = require('../database/database')
const { createFolders, searchDocuments } = require('../utils/createFolders')
const { passwordCrypt, passwordDecrypt } = require('../utils/encryptPassword')

const getMedic = async (req, res) => {
  try {
    const client = new Client({ connectionString })
    await client.connect()
    const result = await Promise.all([client.query('select*from medic'), client.query('select*from specialty')])
    await client.end()
    res.status(200).json({ medic: result[0].rows, specialty: result[1].rows })
  } catch (error) {
    console.error(error)
    res.status(500).json(error)
  }
}

const createMedic = async (req, res) => {
  try {
    const {
      name,
      certificate,
      dni,
      patLastName,
      matLastName,
      birthdate,
      gender,
      description,
      signature,
      codeCmp,
      password,
      codeRne,
      specialty,
      userAccountId,
      userRegisterId
    } = req.body

    let resultSignature = false
    let resultCertificate = false

    if (signature.imageBase64) {
      resultSignature = await createFolders(signature.imageBase64, dni, name, 'created', signature?.type)
    }

    if (certificate.certificateBase64) {
      resultCertificate = await createFolders(certificate.certificateBase64, dni, name, 'created', certificate?.type)
    }

    const newPassword = password ? passwordCrypt(password) : ''

    const client = new Client({ connectionString })
    await client.connect()
    await client.query('call sp_insert_medic ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)', [name, patLastName, matLastName, dni, birthdate.replace(/"/g, "'"), gender, description, codeCmp, codeRne, resultSignature, resultCertificate, newPassword, specialty, userAccountId, userRegisterId])
    const response = await client.query('select*from medic order by medic_id desc limit 1')
    await client.end()
    res
      .status(200)
      .json({
        message: 'result added successfully',
        body: {
          medic: response.rows[0]
        }
      })
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const updateMedic = async (req, res) => {
  try {
    const {
      name,
      certificate,
      dni,
      patLastName,
      matLastName,
      birthdate,
      gender,
      description,
      signature,
      codeCmp,
      password,
      codeRne,
      specialty,
      userAccountId,
      userRegisterId,
      medicId
    } = req.body

    const client = new Client({ connectionString })
    await client.connect()
    let resultSignature = false
    let resultCertificate = false
    let passwordMedic = ''

    // si el request no trar ni una firma o certificado se debe mantener lo mismo
    const searchInfo = await client.query('select password, signature, certificate from medic where medic_id = $1', [medicId])
    resultSignature = searchInfo.rows[0].signature
    resultCertificate = searchInfo.rows[0].certificate
    passwordMedic = searchInfo.rows[0].password

    if (signature.imageBase64) {
      resultSignature = await createFolders(signature.imageBase64, dni, name, 'update', signature?.type)
      resultSignature = true
    }

    if (certificate.certificateBase64) {
      resultCertificate = await createFolders(certificate.certificateBase64, dni, name, 'update', certificate?.type)
      passwordMedic = passwordCrypt(password)
      resultSignature = true
    }

    await client.query('call sp_update_medic ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)', [name, patLastName, matLastName, dni, birthdate.replace(/"/g, "'"), gender, description, codeCmp, codeRne, resultSignature, resultCertificate, passwordMedic, specialty, userAccountId, userRegisterId, medicId])
    const resultMedic = await client.query('select * from medic where medic_id = $1', [medicId])
    const updateMedic = [{ ...resultMedic.rows[0], password: resultMedic.rows[0].password.length > 0 ? resultMedic.rows[0].password : '' }]
    await client.end()
    res
      .status(200)
      .json({
        message: 'medic updated successfully',
        body: {
          medic: updateMedic
        }
      })
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const deleteMedic = async (req, res) => {
  try {
    const {
      medicId,
      status,
      userAccountId
    } = req.body

    const client = new Client({ connectionString })
    await client.connect()
    await client.query('call sp_disable_medic ($1, $2, $3)', [medicId, status, userAccountId])
    const resultMedic = await client.query('select * from medic where medic_id = $1', [medicId])
    const updateMedic = [{ ...resultMedic.rows[0], password: resultMedic.rows[0].password.length > 0 ? resultMedic.rows[0].password : '' }]
    await client.end()
    res
      .status(200)
      .json({
        message: 'result disabled successfully',
        body: {
          medic: updateMedic
        }
      })
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const searchMedicSignatureCert = async (req, res) => {
  try {
    const { medic } = req.query
    const client = new Client({ connectionString })
    await client.connect()
    const resultMedic = await client.query('select name, certificate, signature, password from medic where dni = $1', [medic])
    const cert = resultMedic.rows[0].certificate === true ? 'p12' : ''
    const sig = resultMedic.rows[0].signature === true ? 'image' : ''
    const file = searchDocuments(medic, resultMedic.rows[0].name, { cert, sig })
    const passDecrypt = cert === 'p12' ? passwordDecrypt(resultMedic.rows[0].password) : ''
    res
      .status(200)
      .json({
        message: 'result search successfully',
        body: {
          ...file,
          password: passDecrypt
        }
      })
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

module.exports = {
  getMedic,
  createMedic,
  updateMedic,
  deleteMedic,
  searchMedicSignatureCert
}
