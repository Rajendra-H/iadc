var express = require('express');
const authController = require('../controllers/auth');
var router = express.Router();

/* GET users listing. */
router.post('/register', authController.register)

router.post('/login', authController.login)

module.exports = router;
