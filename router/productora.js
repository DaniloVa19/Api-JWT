const { Router } = require('express');

const Productora = require('../models/Productora')

const { validationResult, check } = require('express-validator')

const {validarJWT} = require('../middleware/validar-jwt');
const {validarRolAdmin} = require('../middleware/validar-rol-admin');

const router = Router();

//Listar generos

router.get('/',[validarJWT,validarRolAdmin], async function (req, res) {

    try {
        const productoras = await Productora.find();
        res.send(productoras)

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

        const existeProductora = await Productora.findOne({ nombre: req.body.nombre })

        if (existeProductora) {
            return res.status(400).send("Productora ya existe");
        }

        let productora = new Productora();

        productora.nombre = req.body.nombre;
        productora.estado = req.body.estado;
        productora.slogan = req.body.slogan;
        productora.descripcion = req.body.descripcion;
        productora.fechaCreacion = new Date;
        productora.fechaActualizacion = new Date;

        productora = await productora.save();

        res.send(productora);


    } catch (error) {
        console.log(error)
        res.status(500).send("Ocurrrio un error")
    }
});


router.put('/:productoraId',
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

            let productora = await Productora.findById(req.params.productoraId);
            if (!productora) {

                return res.status(400).send('Productora no existe');


            }

            productora.nombre = req.body.nombre;
            productora.estado = req.body.estado;
            productora.slogan = req.body.slogan;
            productora.descripcion = req.body.descripcion;
            productora.fechaActualizacion = new Date;

            productora = await productora.save();

            res.send(productora);

        } catch (error) {
            console.log(error)
            res.status(500).send("Ocurrrio un error")
        }
    })


router.delete('/:productoraId',[validarJWT,validarRolAdmin], async function (req, res) {

    try {

        let productora = await Productora.findById(req.params.productoraId);

        if (!productora) {
            return res.status(400).send('productora no existe');
        }


        await Productora.deleteOne({ _id: req.params.productoraId });

        res.send("productora eliminada");

    } catch (error) {
        console.log(error)
        res.status(500).send("Ocurrrio un error")
    }
})
module.exports = router;