const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/check-auth');
const CustomerController = require('../controllers/CustomerController');

router.get('/', checkAuth, CustomerController.get_all_customers);

router.get('/:customerId', checkAuth, CustomerController.get_customer);

router.post('/', checkAuth, CustomerController.create_customer);

router.patch('/:customerId', checkAuth, CustomerController.update_customer);

router.delete('/:customerId', checkAuth, CustomerController.delete_customer);

module.exports = router;