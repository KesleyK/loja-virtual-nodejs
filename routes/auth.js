const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.get('/sign-up', authController.getSignUp);

router.post('/sign-up', authController.postSignUp);

module.exports = router;