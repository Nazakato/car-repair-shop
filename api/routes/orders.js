const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/check-auth');
const saveFile = require('../middlewares/save-single-file');
const OrderController = require('../controllers/OrderController');

router.get('/', checkAuth, OrderController.get_all_orders);

router.get('/:orderId', checkAuth, OrderController.get_order);

router.post('/', checkAuth, saveFile, OrderController.create_order);

router.delete('/:orderId', checkAuth, OrderController.delete_order);

module.exports = router;