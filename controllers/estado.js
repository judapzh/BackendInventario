const Estado = require('../models/estado');
const { request, response } = require('express');
const { validarJWT } = require('../middleware/validar.jwt');
const { validarRolAdmin } = require('../middleware/validar-rol-admin');

// Crear estado
const createEstado = [
  validarJWT,
  validarRolAdmin,
  async (req = request, res = response) => {
    try {
      const nombre = req.body.nombre ? req.body.nombre.toUpperCase() : '';
      const estadoDB = await Estado.findOne({ nombre });

      if (estadoDB) {
        return res.status(400).json({ msg: 'Ya existe' });
      }

      const data = {
        nombre,
      };

      const estado = new Estado(data);
      await estado.save();

      return res.status(201).json(estado);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ msg: 'Error general ' + e });
    }
  }
];

// Listar todos los estados
const getEstados = [
  validarJWT,
  validarRolAdmin,
  async (req = request, res = response) => {
    try {
      const { estado } = req.query;
      const estadosDB = await Estado.find({ estado });
      return res.json(estadosDB);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ msg: 'Error general ' + e });
    }
  }
];

// Actualizar estado
const updateEstado = [
  validarRolAdmin,
  validarJWT,
  async (req = request, res = response) => {
    try {
      const data = req.body;
      const id = req.params.id;
      data.fechaActualizacion = new Date();

      const estado = await Estado.findByIdAndUpdate(id, data, { new: true });

      return res.json(estado);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ msg: e });
    }
  }
];

module.exports = { createEstado, getEstados, updateEstado };
