const { Router } = require('express');

const Tipo = require('../models/Tipo')

const { validationResult, check } = require('express-validator')

const {validarJWT} = require('../middleware/validar-jwt');
const {validarRolAdmin} = require('../middleware/validar-rol-admin');

const router = Router();

//Listar tipos

router.get('/',[validarJWT,validarRolAdmin], async function (req, res) {

    try {
        const tipos = await Tipo.find();
        res.send(tipos)

    } catch (error) {
        console.log(error)
        res.status(500).send("Ocurrrio un error")
    }

});

//Post tipos

router.post('/',[validarJWT,validarRolAdmin], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
], async function (req, res) {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json({ mensaje: errors.array() });
        }

        const existeTipo = await Tipo.findOne({ nombre: req.body.nombre })

        if (existeTipo) {
            return res.status(400).send("Tipo ya existe");
        }

        let tipo = new Tipo();

        tipo.nombre = req.body.nombre;
        tipo.descripcion = req.body.descripcion;
        tipo.fechaCreacion = new Date;
        tipo.fechaActualizacion = new Date;

        tipo = await tipo.save();

        res.send(tipo);


    } catch (error) {
        console.log(error)
        res.status(500).send("Ocurrrio un error")
    }
});


router.put('/:tipoId',
    [   validarJWT,
        validarRolAdmin,
        check('nombre', 'invalid.nombre').not().isEmpty(),
    ]
    , async function (req, res) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {

                return res.status(400).json({ mensaje: errors.array() });
            }

            let tipo = await Tipo.findById(req.params.tipoId);
            if (!tipo) {

                return res.status(400).send('tipo no existe');


            }

            tipo.nombre = req.body.nombre;
            tipo.descripcion = req.body.descripcion;
            tipo.fechaActualizacion = new Date;

            tipo = await tipo.save();

            res.send(tipo);


        } catch (error) {
            console.log(error)
            res.status(500).send("Ocurrrio un error")
        }
    })


router.delete('/:tipoId', [validarJWT,validarRolAdmin],async function (req, res) {

    try {

        let tipo = await Tipo.findById(req.params.tipoId);

        if (!tipo) {
            return res.status(400).send('tipo no existe');
        }


        await Tipo.deleteOne({ _id: req.params.tipoId });
        res.send("tipo eliminado");


    } catch (error) {
        console.log(error)
        res.status(500).send("Ocurrrio un error")
    }
})
module.exports = router;
