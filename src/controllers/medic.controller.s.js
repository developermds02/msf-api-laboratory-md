const { Client } = require('pg')
const connectionString = require('../database/database')

const getMedic = async (req, res) => {
  try {
    const client = new Client({ connectionString })
    await client.connect()
    const result = await Promise.all([client.query('select*from medic'), client.query('select*from specialty')])
    // const responseMedic = await client.query('select*from medic')
    // const responseEspecility = await client.query('select*from specialty')
    // console.log(responseEspecility.rows)
    await client.end()
    res.status(200).json({ medic: result[0].rows, specialty: result[1].rows })
  } catch (error) {
    console.error(error)
  }
}

const createMedic = async (req, res) => {
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
      userAccountId
    } = req.body
    const client = new Client({ connectionString })
    await client.connect()
    const response = await client.query('select*from medic')
  } catch (error) {
    res.status(500).json(error)
  }
}

const updateMedic = (req, res) => {
  console.log('update medic')
}

const deleteMedic = (req, res) => {

}

module.exports = {
  getMedic,
  createMedic,
  updateMedic,
  deleteMedic
}
