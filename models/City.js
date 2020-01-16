const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    name: {
        type: String, 
        required: true,
    },
    region: {
        _id: { 
            type: Types.ObjectId,
            auto: true,
        },
        name: { 
            type: String,
        },
        country: {
            type: Types.ObjectId,
        },
    },
});

module.exports = model('City', schema);