const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();

const customerRoutes = require('./api/routes/customers');
const serviceRoutes = require('./api/routes/services');
const orderRoutes = require('./api/routes/orders');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/customers', customerRoutes);
app.use('/services', serviceRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    })
})

module.exports = app;