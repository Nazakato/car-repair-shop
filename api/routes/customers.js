const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Customer = require('../models/customer');

router.get('/', (req, res, next) => {
    Customer.find()
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err.message });
        });
});

router.get('/:customerId', (req, res, next) => {
    const id = req.params.customerId;
    Customer.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({ message: 'Customer with id ' + id + ' was not found.' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err.message });
        });
});

router.post('/', (req, res, next) => {
    const customer = new Customer({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        type: req.body.type,
        description: req.body.description
    });

    customer
        .save()
        .then(doc => {
            console.log(doc);
            res.status(201).json({ customer: doc });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err.message });
        });
});

router.patch('/:customerId', (req, res, next) => {
    const id = req.params.customerId;
    const updateCustomers = {};
    for (const option of req.body) {
        updateCustomers[option.propName] = option.value;
    }

    Customer.update({_id: id}, { $set: updateCustomers})
    .exec()
    .then(docs => {
        console.log(docs);
        res.status(200).json(docs);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err.message });
    });
});

router.delete('/:customerId', (req, res, next) => {
    const id = req.params.customerId;
    Customer.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err.message });
        });
});

module.exports = router;