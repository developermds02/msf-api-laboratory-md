const express = require('express')
const { createMedic, deleteMedic, getMedic, updateMedic } = require('../controllers/medic.controller.s')
const router = express.Router()

router.get('/medic', getMedic)
router.post('/medic', createMedic)
router.put('/medic', updateMedic)
router.delete('/medic', deleteMedic)

module.exports = router
