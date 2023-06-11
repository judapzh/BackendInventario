
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()

const app = express()


// middlewares
app.use(express.json())
app.use(express.urlencoded({extended: false}))
const mongoConn = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        })
        console.log('Conexión correcta a Mongo')
    }catch(e){
        console.log('Error', e)
        throw new Error('Error conectando a Mongo')
    }
}

const conn = mongoConn()

const TipoEquipoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'Nombre requerido']
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    fechaCreacion: {
        type: Date,
        default: new Date()
    },
    fechaActualizacion: {
        type: Date,
        default: new Date()
    }
})
const TipoEquipo = mongoose.model('TipoEquipo', TipoEquipoSchema)

app.post('/api/tiposequipos', async (req, res) => {
    try{
        const nombre = req.body.nombre 
            ? req.body.nombre.toUpperCase()
            : ''
        const tipoEquipoDB = await TipoEquipo.findOne({nombre})//select * from tipoEquipo where nombre=?
        
        if(tipoEquipoDB){
            return res.status(400).json({msg: 'Ya existe'})
        }
        const data = {
            nombre  // nombre: nombre
        }
        const tipoEquipo = new TipoEquipo(data)
        console.log(tipoEquipo)
        await tipoEquipo.save()
        return res.status(201).json(tipoEquipo)
    }catch(e){
        return res.status(500).json({
            msg: 'Error general ' + e
        })
    }
})

app.get('/api/tiposequipos', async (req, res) => {
        try{
            const { estado } = req.query
            const tipoEquiposDB = await TipoEquipo.find({estado})//select * from tipoEquipo where estado=?
            return res.json(tipoEquiposDB)
        }catch(e){
            return res.status(500).json({
                msg: 'Error general ' + e
            })
        }
})

app.set('port', process.env.PORT || 3000)

app.listen(app.get('port'), () => {
    console.log(`arrancó por puerto: ${app.get('port')}`)
})