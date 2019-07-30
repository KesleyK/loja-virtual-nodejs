const ProductModel = require('../models/product');

exports.getUserProducts = (req, res) => {
  ProductModel
    .findAll({ where: { userEmail: req.user.email } })
    .then(products => {
      res.render('admin/product-list', {
        pageTitle: 'Admin Products',
        products
      });
    })
    .catch(err => console.log(err));
}

exports.postDeleteProduct = (req, res) => {
  const productId = req.body.prodId;

  ProductModel
    .findByPk(productId)
    .then(product => {
      return product.destroy();
    })
    .then(() => {
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err));
}

exports.getAddProduct = (req, res) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product'
  });
}

exports.postAddProduct = (req, res) => {
  const title = req.body.title;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  
  req.user
    .createProduct({ 
      title: title, 
      price: price, 
      imageUrl: imageUrl,
      description: description
    })
    .then(() => {
      res.redirect('/');
    })
    .catch(err => console.log(err));
}