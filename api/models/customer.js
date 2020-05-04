const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true},
    type: { type: String, required: true},
    description: { type: String, required: true}
});

module.exports = mongoose.model('Customer', customerSchema);