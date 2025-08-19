const express = require('express');
const authController = require('../controllers/auth.controller');
const router = express.Router();

// public API
router.post('/register', authController.register);
router.post('/login', authController.login);


module.exports = router;