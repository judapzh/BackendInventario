const Usuario = require('../models/usuario');
const { request, response } = require('express');
const { validationResult, check } = require('express-validator');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const createLogin = async (req = request, res = response) => {
  try {
    await check('email', 'invalid.email').isEmail().run(req);
    await check('contrasena', 'invalid.contrasena').not().isEmpty().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ mensaje: errors.array() });
    }

    const usuario = await Usuario.findOne({ email: req.body.email });
    if (!usuario) {
      return res.status(400).send({ mensaje: 'user not found' });
    }
    const esIgual = bcrypt.compareSync(req.body.contrasena, usuario.contrasena);
    if (!esIgual) {
      return res.status(400).send({ mensaje: 'user not found' });
    }

    const token = generarJWT(usuario);

    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      rol: usuario.rol,
      email: usuario.email,
      access_token: token
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: 'internal server error' });
  }
}

module.exports = { createLogin };
