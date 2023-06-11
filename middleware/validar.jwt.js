const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {
    const token = req.header('authorization');
    if (!token) {
        return res.status(401).json({ mensaje: 'Error: no estás autorizado' });
    }
    try {
        const payload = jwt.verify(token, '123456');
        req.payload = payload;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ mensaje: 'Error: no estás autorizado' });
    }
};

module.exports = {
    validarJWT
};
