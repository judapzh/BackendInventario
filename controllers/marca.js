const Marca = require('../models/marca');
const { request, response } = require('express');
const { validarJWT } = require('../middleware/validar.jwt');
const { validarRolAdmin } = require('../middleware/validar-rol-admin');

// Crear una nueva marca
const createMarca = [
  validarJWT,
  validarRolAdmin,
  async (req = request, res = response) => {
    try {
      const nombre = req.body.nombre ? req.body.nombre.toUpperCase() : '';
      const marcaDB = await Marca.findOne({ nombre });

      if (marcaDB) {
        return res.status(400).json({ msg: 'Ya existe' });
      }

      const data = {
        nombre,
      };

      const marca = new Marca(data);
      await marca.save();

      return res.status(201).json(marca);
    } catch (e) {
      return res.status(500).json({
        msg: 'Error general ' + e,
      });
    }
  },
];

// Obtener todas las marcas
const getMarcas = [
  validarJWT,
  validarRolAdmin,
  async (req = request, res = response) => {
    try {
      const { estado } = req.query;
      const marcasDB = await Marca.find({ estado });
      return res.json(marcasDB);
    } catch (e) {
      return res.status(500).json({
        msg: 'Error general ' + e,
      });
    }
  },
];

// Actualizar una marca existente
const updateMarca = [
  validarJWT,
  validarRolAdmin,
  async (req = request, res = response) => {
    try {
      const data = req.body;
      const id = req.params.id;

      data.fechaActualizacion = new Date();

      const marca = await Marca.findByIdAndUpdate(id, data, { new: true });

      if (!marca) {
        return res.status(404).json({ msg: 'Marca no encontrada' });
      }

      return res.json(marca);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ msg: 'Error general ' + e });
    }
  },
];

module.exports = { createMarca, getMarcas, updateMarca };
