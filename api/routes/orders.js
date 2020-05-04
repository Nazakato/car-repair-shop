const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'handle get to /orders'
    });
});

router.get('/:customerId', (req, res, next) => {
    const id = req.params.customerId;
    res.status(200).json({
        message: 'handle get to /orders/' + id
    });
});

router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'handle post to /orders'
    });
});

router.patch('/:customerId', (req, res, next) => {
    const id = req.params.customerId;
    res.status(200).json({
        message: 'handle update to /orders/' + id
    });
});

router.delete('/:customerId', (req, res, next) => {
    const id = req.params.customerId;
    res.status(200).json({
        message: 'handle delete to /orders/' + id
    });
});

module.exports = router;