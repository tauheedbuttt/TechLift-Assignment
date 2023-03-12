const mongoose = require('mongoose');

const tollSchema = new mongoose.Schema({
    entryPoint: String,
    exitPoint: String,
    day: Number,
    numberPlate: String,
    distance: {
        type: Number,
        default: 0
    },
    cost: {
        type: Number,
        default: 20
    }
});

mongoose.model('Toll', tollSchema)