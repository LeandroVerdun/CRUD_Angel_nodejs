const express = require('express');
const router = express.Router();
const Angel = require('../models/angel.model');

// MIDDLEWARE

const getAngel = async (req, res, next) => {
    let angel;
    const { id } = req.params;

    console.log('ID recibido:', id); // Verificar que el ID se recibe

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({
            message: 'El ID del ángel no es válido'
        });
    }

    try {
        angel = await Angel.findById(id);
        console.log('Ángel encontrado:', angel); // Verificar si el ángel se encuentra
        if (!angel) {
            return res.status(404).json({
                message: 'El ángel no fue convocado'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }

    res.angel = angel;
    next(); // next es para seguir, después de hacer el proceso en middleware y configurar el ángel continúa el programa
}

// Obtener los ángeles [GET ALL]
router.get('/', async (req, res) => {
    try {
        const angels = await Angel.find();
        console.log('GET ALL', angels);
        if (angels.length == 0) {
            return res.status(204).json([]);
        }
        res.json(angels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Crear un nuevo ángel (recurso) [POST]
router.post('/', async (req, res) => {
    const { name, hierarchy, Attributes, Domain, Symbols } = req.body;
    if (!name || !hierarchy || !Attributes || !Domain || !Symbols) {
        return res.status(400).json({
            message: 'Los campos nombre, jerarquía, atributo, dominio y símbolos son obligatorios'
        });
    }

    const angel = new Angel({
        name,
        hierarchy,
        Attributes,
        Domain,
        Symbols
    });

    try {
        const newAngel = await angel.save();
        console.log(newAngel);
        res.status(201).json(newAngel);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// Obtener un ángel por ID [GET]
router.get('/:id', getAngel, (req, res) => {
    res.json(res.angel);
});

// Actualizar un ángel por ID [PUT]
router.put('/:id', getAngel, async (req, res) => {
    try {
        const angel = res.angel;
        angel.name = req.body.name || angel.name;
        angel.hierarchy = req.body.hierarchy || angel.hierarchy;
        angel.Attributes = req.body.Attributes || angel.Attributes;
        angel.Domain = req.body.Domain || angel.Domain;
        angel.Symbols = req.body.Symbols || angel.Symbols;

        const updatedAngel = await angel.save();
        res.json(updatedAngel);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

router.patch('/:id', getAngel, async (req, res) => {

    if(!req.body.name && !req.body.hierarchy && !req.body.Attributes && !req.body.Domain && !req.body.Symbols) {
        res.status(400).json({
            message: 'Al menos un atributo tiene que ser enviado'
        })
    }

    try {
        const angel = res.angel;
        angel.name = req.body.name || angel.name;
        angel.hierarchy = req.body.hierarchy || angel.hierarchy;
        angel.Attributes = req.body.Attributes || angel.Attributes;
        angel.Domain = req.body.Domain || angel.Domain;
        angel.Symbols = req.body.Symbols || angel.Symbols;

        const updatedAngel = await angel.save();
        res.json(updatedAngel);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

router.delete('/:id', getAngel, async (req, res) => {
    try {
        const angel = res.angel
        await angel.deleteOne({
            _id: angel._id
        })
        res.json({
            message: `El angel ${angel.name} fue desterrado correctamente`
        })
    } catch(error) {
        res.status(500).json({
            message: error.message
        })
    }
});

module.exports = router;
