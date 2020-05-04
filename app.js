const express = require('express');
const app = express();

const customerRoutes = require('./api/routes/customers');
const serviceRoutes = require('./api/routes/services');
const orderRoutes = require('./api/routes/orders');

app.use('/customers', customerRoutes);
app.use('/services', serviceRoutes);
app.use('/orders', orderRoutes);

module.exports = app;