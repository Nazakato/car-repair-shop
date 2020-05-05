const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true},
    description: { type: String, required: true},
    prices: {
        type: Map,
        of: Number
    }
});

module.exports = mongoose.model('Service', serviceSchema);