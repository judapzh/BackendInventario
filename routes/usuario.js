const { Router } = require('express')
const {createUsuario, getUsuarios, updateUsuario} =
 require('../controllers/usuario')

const router = Router()

// crear
router.post('/', createUsuario)

// consultar todos
router.get('/', getUsuarios)
router.put('/:id',updateUsuario)

module.exports = router;