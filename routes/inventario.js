const { Router } = require('express')
const { createInventario, getInventarios} =
 require('../controllers/inventario')

const router = Router()

// crear
router.post('/', createInventario)

// consultar todos
router.get('/', getInventarios)

module.exports = router;