const { Router } = require('express')
const {createLogin} = require('../controllers/auth')

const router = Router()

// crear
router.post('/', createLogin)

module.exports = router;