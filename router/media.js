const { Router } = require('express');

const Media = require('../models/Media')
const Director = require('../models/Director')
const Genero = require('../models/Genero')
const Productora = require('../models/Productora')
const Tipo = require('../models/Tipo')

const { validationResult, check } = require('express-validator')

const {validarJWT} = require('../middleware/validar-jwt');
const {validarRolAdmin} = require('../middleware/validar-rol-admin');


const router = Router();

//Listar toda la media

router.get('/',[validarJWT], async function (req, res) {

    try {
        const medios = await Media.find()
            .populate('director')
            .populate('genero')
            .populate('productora')
            .populate('tipo')

        res.send(medios)

    } catch (error) {
        console.log(error)
        res.status(500).send("Ocurrrio un error")
    }

});

//consulatar individualmente una media

router.get('/:mediaId',[validarJWT], async function (req, res) {

    try {

        const media = await Media.findOne({ _id: req.params.mediaId });

        if (!media) {
            return res.status(400).send("Media no existe");
        }

        
        res.send(media)

    } catch (error) {
        console.log(error)
        res.status(500).send("Ocurrrio un error")
    }

});

//Post media

router.post('/',
    [
    validarJWT,validarRolAdmin,
    check('titulo', 'invalid.titulo').not().isEmpty(),
    check('url', 'invalid.url').not().isEmpty(),
    check('serial', 'invalid.serial').not().isEmpty(),
    check('genero', 'invalid.genero').not().isEmpty(),
    check('director', 'invalid.director').not().isEmpty(),
    check('productora', 'invalid.productora').not().isEmpty(),
    check('tipo', 'invalid.tipo').not().isEmpty(),
], async function (req, res) {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json({ mensaje: errors.array() });
        }

        const existeMedia = await Media.findOne({ serial: req.body.serial })

        if (existeMedia) {
            return res.status(400).send("Media ya existe");
        }

        const directorActivo = await Director.findOne({ _id: req.body.director._id })

        if (directorActivo.estado != "Activo") {
            return res.status(400).send("El director no se encuatra activo");
        }

        const generoActivo = await Genero.findOne({ _id: req.body.genero._id })

        if (generoActivo.estado != "Activo") {
            return res.status(400).send("El genero no se encuatra activo");
        }


        const productoraActivo = await Productora.findOne({ _id: req.body.productora._id })

        if (productoraActivo.estado != "Activo") {
            return res.status(400).send("La Productora no se encuatra activa");
        }

        const tipoActivo = await Tipo.findOne({ _id: req.body.tipo._id })

        if (!tipoActivo) {
            return res.status(400).send("El tipo de media no que intenta vincular no existe");
        }

        let media = new Media();

        media.serial = req.body.serial;
        media.titulo = req.body.titulo;
        media.sinopsis = req.body.sinopsis;
        media.url = req.body.url;
        media.imagenPortada = req.body.imagenPortada;
        media.fechaActualizacion = req.body.fechaActualizacion;
        media.yearEstreno = req.body.yearEstreno;

        media.genero = req.body.genero._id;
        media.director = req.body.director._id;
        media.productora = req.body.productora._id;
        media.tipo = req.body.tipo._id;

        media.fechaCreacion = new Date;
        media.fechaActualizacion = new Date;

        media = await media.save();

        res.send(media);


    } catch (error) {
        console.log(error)
        res.status(500).send("Ocurrrio un error")
    }
});


router.put('/:mediaId',
    [
        validarJWT,validarRolAdmin,
        check('titulo', 'invalid.titulo').not().isEmpty(),
        check('url', 'invalid.url').not().isEmpty(),
        check('serial', 'invalid.serial').not().isEmpty(),
        check('genero', 'invalid.genero').not().isEmpty(),
        check('director', 'invalid.director').not().isEmpty(),
        check('productora', 'invalid.productora').not().isEmpty(),
        check('tipo', 'invalid.tipo').not().isEmpty(),
    ]
    , async function (req, res) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {

                return res.status(400).json({ mensaje: errors.array() });
            }

            let media = await Media.findById(req.params.mediaId);
            if (!media) {

                return res.status(400).send('Media no existe');


            }


            const directorActivo = await Director.findOne({ _id: req.body.director._id })

            if (directorActivo.estado != "Activo") {
                return res.status(400).send("El director no se encuatra activo");
            }

            const generoActivo = await Genero.findOne({ _id: req.body.genero._id })

            if (generoActivo.estado != "Activo") {
                return res.status(400).send("El genero no se encuatra activo");
            }

            const productoraActivo = await Productora.findOne({ _id: req.body.productora._id })

            if (productoraActivo.estado != "Activo") {
                return res.status(400).send("La Productora no se encuatra activa");
            }

            const tipoActivo = await Tipo.findOne({ _id: req.body.tipo._id })

            if (!tipoActivo) {
                return res.status(400).send("El tipo de media no que intenta vincular no existe");
            }


            media.serial = req.body.serial;
            media.titulo = req.body.titulo;
            media.sinopsis = req.body.sinopsis;
            media.url = req.body.url;
            media.imagenPortada = req.body.imagenPortada;
            media.fechaActualizacion = req.body.fechaActualizacion;
            media.yearEstreno = req.body.yearEstreno;

            media.genero = req.body.genero._id;

            media.director = req.body.director._id;
            media.productora = req.body.productora._id;
            media.tipo = req.body.tipo._id;

            media.fechaCreacion = new Date;

            media.fechaActualizacion = new Date;

            media = await media.save();

            res.send(media);
        } catch (error) {
            console.log(error)
            res.status(500).send("Ocurrrio un error")
        }
    })





router.delete('/:mediaId',[validarJWT,validarRolAdmin], async function (req, res) {

    try {

        let media = await Media.findById(req.params.mediaId);

        if (!media) {
            return res.status(400).send('Media no existe');
        }


        await Media.deleteOne({ _id: req.params.mediaId });

        res.send("media eliminada");



    } catch (error) {
        console.log(error)
        res.status(500).send("Ocurrrio un error")
    }
})
module.exports = router;