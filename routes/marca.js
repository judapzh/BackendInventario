const { Router } = require('express')
const { createMarca, getMarcas, updateMarca} =
 require('../controllers/marca')

const router = Router()

// crear
router.post('/', createMarca)

// consultar todos
router.get('/', getMarcas)

router.get('/:id', updateMarca)
module.exports = router;