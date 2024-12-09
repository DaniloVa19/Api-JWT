const { Router } = require('express');

const Genero = require('../models/Genero')

const { validationResult, check } = require('express-validator')

const {validarJWT} = require('../middleware/validar-jwt');
const {validarRolAdmin} = require('../middleware/validar-rol-admin');

const router = Router();

//Listar generos

router.get('/',[validarJWT,validarRolAdmin], async function (req, res) {

    try {
        const generos = await Genero.find();
        res.send(generos)

    } catch (error) {
        console.log(error)
        res.status(500).send("Ocurrrio un error")
    }

});

//Post generos

router.post('/', [
    validarJWT,
    validarRolAdmin,
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
], async function (req, res) {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json({ mensaje: errors.array() });
        }

        const existeGenero = await Genero.findOne({ nombre: req.body.nombre })

        if (existeGenero) {
            return res.status(400).send("Genero ya existe");
        }

        let genero = new Genero();

        genero.nombre = req.body.nombre;
        genero.estado = req.body.estado;
        genero.descripcion = req.body.descripcion;
        genero.fechaCreacion = new Date;
        genero.fechaActualizacion = new Date;

        genero = await genero.save();

        res.send(genero);


    } catch (error) {
        console.log(error)
        res.status(500).send("Ocurrrio un error")
    }
});


router.put('/:generoId',
    [validarJWT,
    validarRolAdmin,
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
    ]
    , async function (req, res) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {

                return res.status(400).json({ mensaje: errors.array() });
            }

            let genero = await Genero.findById(req.params.generoId);
            if (!genero) {

                return res.status(400).send('Genero no existe');


            }


            genero.nombre = req.body.nombre;
            genero.estado = req.body.estado;
            genero.descripcion = req.body.descripcion;
            genero.fechaActualizacion = new Date;

            genero = await genero.save();

            res.send(genero);


        } catch (error) {
            console.log(error)
            res.status(500).send("Ocurrrio un error")
        }
    })

router.delete('/:generoId',[validarJWT,validarRolAdmin], async function (req, res) {

    try {

        let genero = await Genero.findById(req.params.generoId);

        if (!genero) {
            return res.status(400).send('genero no existe');
        }


        await Genero.deleteOne({ _id: req.params.generoId });

        res.send("genero eliminado");

    } catch (error) {
        console.log(error)
        res.status(500).send("Ocurrrio un error")
    }
})
module.exports = router;
