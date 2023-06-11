const TipoEquipo = require('../models/tipoEquipo');
const { request, response } = require('express');
const { validarJWT } = require('../middleware/validar.jwt');
const { validarRolAdmin } = require('../middleware/validar-rol-admin');

// Crear un tipo de equipo
const createTipoEquipo = async (req = request, res = response) => {
  try {
    const nombre = req.body.nombre ? req.body.nombre.toUpperCase() : '';
    const tipoEquipoDB = await TipoEquipo.findOne({ nombre });

    if (tipoEquipoDB) {
      return res.status(400).json({ msg: 'Ya existe' });
    }

    const data = { nombre };
    const tipoEquipo = new TipoEquipo(data);
    await tipoEquipo.save();
    return res.status(201).json(tipoEquipo);
  } catch (error) {
    return res.status(500).json({
      msg: 'Error general ' + error,
    });
  }
};

// Aplicar validación del JWT en la función createTipoEquipo
const createTipoEquipoWithJWTValidation = [validarJWT, validarRolAdmin, createTipoEquipo];

// Obtener todos los tipos de equipos
const getTipoEquipos = [validarJWT, validarRolAdmin, async (req = request, res = response) => {
  try {
    const { estado } = req.query;
    const tipoEquiposDB = await TipoEquipo.find({ estado });
    return res.json(tipoEquiposDB);
  } catch (error) {
    return res.status(500).json({
      msg: 'Error general ' + error,
    });
  }
}];

// Actualizar un tipo de equipo por su ID
const updateTipoEquipoByID = [validarJWT, validarRolAdmin, async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const tipoEquipoDB = await TipoEquipo.findById(id);
    if (!tipoEquipoDB) {
      return res.json({ msg: 'No existe el tipo de equipo' });
    }

    data.fechaActualizacion = new Date();
    const tipoEquipo = await TipoEquipo.findByIdAndUpdate(id, data, { new: true });
    return res.json(tipoEquipo);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error });
  }
}];

module.exports = {
  createTipoEquipo: createTipoEquipoWithJWTValidation, getTipoEquipos, updateTipoEquipoByID
};
