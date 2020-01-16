const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    name: {
        type: String, 
        required: true,
    },
    full_name: {
        type: String,
        required: true,
    },
    numcode: {
        type: Number,
        required: true,
    },
    alfa3: {
        type: String,
        required: true,
    },
    alfa2: {
        type: String,
        required: true,
    },
    sort: {
        type: Number,
        required: true,
    },
});

module.exports = model('Country', schema);