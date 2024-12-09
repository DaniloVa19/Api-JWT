const { Router } = require('express');

const Director = require('../models/Director')

const { validationResult, check } = require('express-validator')

const {validarJWT} = require('../middleware/validar-jwt');
const {validarRolAdmin} = require('../middleware/validar-rol-admin');

const router = Router();

//Listar generos

router.get('/',[validarJWT,validarRolAdmin], async function (req, res) {

    try {
        const directores = await Director.find();
        res.send(directores)

    } catch (error) {
        console.log(error)
        res.status(500).send("Ocurrrio un error")
    }

});

//Post generos

router.post('/', [
    validarJWT,validarRolAdmin,
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
], async function (req, res) {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json({ mensaje: errors.array() });
        }

        const existeDirector = await Director.findOne({ nombre: req.body.nombre })

        if (existeDirector) {
            return res.status(400).send("Director ya existe");
        }

        let director = new Director();

        director.nombre = req.body.nombre;
        director.estado = req.body.estado;
        director.fechaCreacion = new Date;
        director.fechaActualizacion = new Date;

        director = await director.save();

        res.send(director);


    } catch (error) {
        console.log(error)
        res.status(500).send("Ocurrrio un error")
    }
});


router.put('/:directorId',
    [validarJWT,validarRolAdmin,
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
    ]
    , async function (req, res) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {

                return res.status(400).json({ mensaje: errors.array() });
            }

            let director = await Director.findById(req.params.directorId);
            if (!director) {

                return res.status(400).send('director no existe');


            }


            director.nombre = req.body.nombre;
            director.estado = req.body.estado;
            director.fechaActualizacion = new Date;

            director = await director.save();

            res.send(director);
        } catch (error) {
            console.log(error)
            res.status(500).send("Ocurrrio un error")
        }
    })


router.delete('/:directorId',[validarJWT,validarRolAdmin], async function (req, res) {

    try {

        let director = await Director.findById(req.params.directorId);

        if (!director) {
            return res.status(400).send('director no existe');
        }


        await Director.deleteOne({ _id: req.params.directorId });

        res.send("director eliminado");

    } catch (error) {
        console.log(error)
        res.status(500).send("Ocurrrio un error")
    }
})
module.exports = router;