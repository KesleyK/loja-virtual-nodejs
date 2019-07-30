const express = require('express');

const isAuth = require('../middlewares/isAuth');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/cart', isAuth, shopController.getCart);

router.post('/add-to-cart', isAuth, shopController.postAddToCart);

router.get('/order', isAuth, shopController.getOrders);

router.post('/order', isAuth, shopController.postOrder);

module.exports = router;