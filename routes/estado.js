const { Router } = require('express')
const {createEstado, getEstados,  updateEstado} =
 require('../controllers/estado')

const router = Router()

// crear
router.post('/', createEstado)

// consultar todos
router.get('/', getEstados)
router.put('/:id',  updateEstado)

module.exports = router;