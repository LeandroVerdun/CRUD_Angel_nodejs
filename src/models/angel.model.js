const mongoose = require('mongoose')

const angelSchema = new mongoose.Schema(
    {
        name: String,
        hierarchy: String,
        Attributes: String,
        Domain: String,
        Symbols: String


    }
)

module.exports = mongoose.model('Angel', angelSchema) //asi se exporta el mongoose