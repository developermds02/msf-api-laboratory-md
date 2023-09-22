/* eslint-disable no-const-assign */
/* eslint-disable no-unused-vars */
const { Client } = require('pg')
const connectionString = require('../database/database')
const { createFolders } = require('../utils/createFolders')
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
    } else if (certificate.certificateBase64) {
      resultCertificate = await createFolders(certificate.certificateBase64, dni, name, 'created', certificate?.type)
    }

    const client = new Client({ connectionString })
    await client.connect()
    await client.query('call sp_insert_medic ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)', [name, patLastName, matLastName, dni, birthdate.replace(/"/g, "'"), gender, description, codeCmp, codeRne, resultSignature, resultCertificate, password, specialty, userAccountId, userRegisterId])
    const response = await client.query('select medic_id from medic order by medic_id desc limit 1')
    // call sp_insert_result_exam ($1, $2, $3, $4, $5)
    const createMedic = await client.query('select * from medic where medic_id = $1', [response.rows[0].medic_id])
    await client.end()
    res
      .status(200)
      .json({
        message: 'result added successfully',
        body: {
          medic: createMedic.rows[0]
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

    let resultSignature = false
    let resultCertificate = false
    console.log(medicId)
    if (signature.imageBase64) {
      resultSignature = await createFolders(signature.imageBase64, dni, name, 'update', signature?.type)
    } else if (certificate.certificateBase64) {
      resultCertificate = await createFolders(certificate.certificateBase64, dni, name, 'update', certificate?.type)
    }
    const client = new Client({ connectionString })
    await client.connect()
    await client.query('call sp_update_medic ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)', [name, patLastName, matLastName, dni, birthdate.replace(/"/g, "'"), gender, description, codeCmp, codeRne, resultSignature, resultCertificate, password, specialty, userAccountId, userRegisterId, medicId])
    const resultMedic = await client.query('select * from medic where medic_id = $1', [medicId])
    console.log(resultMedic)
    await client.end()
    res
      .status(200)
      .json({
        message: 'medic updated successfully',
        body: {
          medic: [] // resultExam.rows[0]
        }
      })
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const deleteMedic = (req, res) => {

}

module.exports = {
  getMedic,
  createMedic,
  updateMedic,
  deleteMedic
}
