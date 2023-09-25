const express = require('express')
const { createMedic, deleteMedic, getMedic, updateMedic, searchMedicSignatureCert } = require('../controllers/medic.controller.s')
const router = express.Router()

router.get('/medic', getMedic)
router.post('/medic', createMedic)
router.put('/medic', updateMedic)
router.delete('/medic', deleteMedic)
router.get('/search', searchMedicSignatureCert)

module.exports = router
