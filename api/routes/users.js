const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const checkAuth = require('../middlewares/check-auth')

router.post('/signup', UserController.sign_up);

router.post('/login', UserController.log_in);

router.get('/', checkAuth, UserController.get_all_users);

router.delete('/:userId', checkAuth, UserController.delete_user);

module.exports = router;