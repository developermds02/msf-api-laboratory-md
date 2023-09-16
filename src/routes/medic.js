const express = require('express')
const { createMedic, deleteMedic, getMedic, updateMedic } = require('../controllers/medic.controller.s')

const router = express.Router()

router.get('/medic', getMedic)
router.post('/create', createMedic)
router.put('/update', updateMedic)
router.delete('/delete', deleteMedic)

module.exports = router
