const express = require('express')
const router = express.Router()
const Angel = require('../models/angel.model')

//empezar aca el middleware mañana


//obtener los angeles [GET ALL]

router.get('/', async (req, res) => {
    try {
        const angel = await Angel.find()
        console.log('GET ALL', angel)
        if(angel.length == 0) {
            return res.status(204).json([])
        }
        res(angel)

    }catch(error) {
        res.status(500).json({ message: error.message })
    }
})


//crear un nuevo angel (recurso) [POST]

router.post('/', async (req, res) => {
    const { name, hierarchy, Attributes, Domain, Symbols } = req?.body
    if(!name || !hierarchy || !Attributes || !Domain || !Symbols) {
        return res.status(400).json({
            message: 'Los campos nombre, gerarquia, atributo, dominio y simbolos son obligatorios'
        })
    }

    const angel = new Angel(
        {
            name,
            hierarchy,
            Attributes,
            Domain,
            Symbols  
        }
    )

    try {
        const newAngel = await angel.save()
        console.log(newAngel)
        res.status(201).json(newAngel)
    }catch(error){
        res.status(400).json({
            message: error.message
        })
    }

})