const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'handle get to /customers'
    });
});

router.get('/:customerId', (req, res, next) => {
    const id = req.params.customerId;
    res.status(200).json({
        message: 'handle get to /customers/' + id
    });
});

router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'handle post to /customers'
    });
});

router.patch('/:customerId', (req, res, next) => {
    const id = req.params.customerId;
    res.status(200).json({
        message: 'handle update to /customers/' + id
    });
});

router.delete('/:customerId', (req, res, next) => {
    const id = req.params.customerId;
    res.status(200).json({
        message: 'handle delete to /customers/' + id
    });
});

module.exports = router;