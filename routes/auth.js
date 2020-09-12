var express = require('express');
const authController = require('../controllers/auth');
var router = express.Router();

/* GET users listing. */

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/logout', authController.logout);

module.exports = router;
