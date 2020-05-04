const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'handle get to /services'
    });
});

router.get('/:serviceId', (req, res, next) => {
    const id = req.params.customerId;
    res.status(200).json({
        message: 'handle get to /services/' + id
    });
});

router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'handle post to /services'
    });
});

router.delete('/:serviceId', (req, res, next) => {
    const id = req.params.customerId;
    res.status(200).json({
        message: 'handle delete to /services/' + id
    });
});

module.exports = router;