const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/check-auth');
const ServiceController = require('../controllers/ServiceController');

router.get('/', ServiceController.get_service);

router.get('/:serviceId', ServiceController.get_all_services);

router.post('/', checkAuth, ServiceController.create_service);

router.delete('/:serviceId', checkAuth, ServiceController.delete_service);

router.post('/:serviceId/updatePrice', checkAuth, ServiceController.update_service_price);

module.exports = router;