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
      files,
      dni,
      patLastName,
      matLastName,
      birthdate,
      gender,
      description,
      codeCmp,
      codeRne,
      specialty,
      userAccountId,
      userRegisterId
    } = req.body
    const ress = await createFolders(files, dni, name, 'created')
    console.log(req.body)
    const client = new Client({ connectionString })
    await client.connect()
    const response = await client.query('call sp_insert_medic ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [name, patLastName, matLastName, dni, birthdate.replace(/"/g, "'"), gender, description, codeCmp, codeRne, ress, specialty, userAccountId, userRegisterId])
    // call sp_insert_result_exam ($1, $2, $3, $4, $5)
    console.log(response)
    const createMedic = await client.query('select * from medic where medic_id = $1', [response.rows[0].medic_id])
    await client.end()
    res
      .status(200)
      .json({
        message: 'result added successfully',
        body: {
          medic: [] // createMedic.rows[0]
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
      medicId,
      name,
      patLastName,
      matLastName,
      dni,
      age,
      birthdate,
      gender,
      description,
      codeCmp,
      codeRne,
      signature,
      specialtyId,
      status,
      files,
      userAccountId
    } = req.body
    await createFolders(files, dni, name, 'updated')
  } catch (err) {

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
