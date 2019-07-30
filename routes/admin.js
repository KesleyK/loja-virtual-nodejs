const express = require('express');

const isAuth = require('../middlewares/isAuth');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/products', isAuth, adminController.getUserProducts);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

router.get('/add-product', isAuth, adminController.getAddProduct);

router.post('/add-product', isAuth, adminController.postAddProduct);

module.exports = router;