const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    createdDate: { type: mongoose.Schema.Types.Date, required: true },
    modifiedDate: { type: mongoose.Schema.Types.Date, required: true },
    comment: { type: String, default: '' },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true }],
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    attachment: { type: String, default: ''},
    total: { type: Number, default: 0 }
});

module.exports = mongoose.model('Order', orderSchema);