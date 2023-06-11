const Usuario = require('../models/usuario');
const { request, response } = require('express');
const { validationResult, check } = require('express-validator');
const bycript = require('bcryptjs');
const{validarJWT}= require('../middleware/validar.jwt')
const{validarRolAdmin} = require('../middleware/validar-rol-admin');
// Crear usuario
const createUsuario = async (req = request, res = response) => {

    try {
        await Promise.all([
            check('nombre', 'El nombre es inválido').not().isEmpty().run(req),
            check('email', 'El email es inválido').isEmail().run(req),
            check('rol', 'El rol es inválido').isIn(['ADMIN', 'OBSERVADOR']).run(req),
            check('contrasena', 'La contraseña es inválida').not().isEmpty().run(req)
          ]);
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ mensaje: errors.array() });
      }
  
      const existeUsuario = await Usuario.findOne({ email: req.body.email });
      if (existeUsuario) {
        return res.status(400).send('Email ya existe');
      }
  
      let usuario = new Usuario();
      usuario.nombre = req.body.nombre;
      usuario.email = req.body.email;
      usuario.rol = req.body.rol;
  
      const salt = bycript.genSaltSync();
      const contrasena = bycript.hashSync(req.body.contrasena, salt);
      usuario.contrasena = contrasena;
      usuario.fechaCreacion = new Date();
      usuario.fechaActualizacion = new Date();
  
      usuario = await usuario.save();
  
      res.send(usuario);
    } catch (error) {
      console.log(error);
      res.status(500).json({ mensaje: 'Internal server error' });
    }
  };
  
  // Aplicar validación del JWT en la función createUsuario
  const createUsuarioWithJWTValidation = [validarJWT, validarRolAdmin, createUsuario];
//validarJWT, validarRolAdmin
// Listar todos los usuarios
const getUsuarios = [validarJWT, async (req = request, res = response) => {
  try {
    const { estado } = req.query;
    const usuariosDB = await Usuario.find({ estado });
    return res.json(usuariosDB);
  } catch (e) {
    return res.status(500).json({
      msg: 'Error general ' + e,
    });
  }
}];

/// Actualizar usuario
const updateUsuario = [
  validarJWT,
  validarRolAdmin,
  async (req = request, res = response) => {
    try {
      console.log(req.body);
      console.log(req.params);
      const data = req.body;
      const { id } = req.params;

      data.fechaActualizacion = new Date();

      const usuario = await Usuario.findByIdAndUpdate(id, data, { new: true });

      if (!usuario) {
        return res.json({ msg: 'No existe el usuario' });
      }

      return res.json(usuario);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ msg: e });
    }
  }
];

module.exports = { createUsuario: createUsuarioWithJWTValidation, getUsuarios, updateUsuario };


