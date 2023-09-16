const { Client } = require('pg')
const connectionString = require('../database/database')

const getMedic = async (req, res) => {
  try {
    const client = new Client({ connectionString })
    await client.connect()
    const response = await client.query('select*from medic')
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

const createMedic = (req, res) => {
  console.log('created medic')
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
