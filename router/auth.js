const { Router } = require('express');
const Usuario = require('../models/User');
const { validationResult, check } = require('express-validator');
const bycript = require('bcryptjs')

const {generarJWT} = require('../helper/jwt');


const router = Router();



router.post('/', [
    check('email', 'invalid.email').isEmail(),
    check('password', 'invalid.password').not().isEmpty(),
], async function (req, res) {

    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) { //validaciones.length > 0)
            return res.status(400).json({
                mensaje: errors.array()
            });
        }

    //validamos email

        const existeUsuario = await Usuario.findOne({ email: req.body.email });
        if (!existeUsuario) {
            return res.status(400).send('User not Found');
        }

    //validar password
        const esIgual = bycript.compareSync(req.body.password,existeUsuario.password)

        if(!esIgual){
            return res.status(400).json("User not Found")
        }
    //generar token

    const token = generarJWT(existeUsuario)
        res.json({
            _id:existeUsuario._id, nombre:existeUsuario.nombre,
            rol: existeUsuario.rol, email:existeUsuario.email,
            access_token:token
        })

    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrrio un error al crear usuario');
    }

});



module.exports = router;