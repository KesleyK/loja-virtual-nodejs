const ProductModelDB = require('../models/product');
const CartItemModelDB = require('../models/cart-item');

exports.getIndex = (req, res) => {
  ProductModelDB
    .findAll()
    .then(products => {
      res.render('shop/index', {
        pageTitle: 'Shop',
        products
      });
    })
    .catch(err => console.log(err));
}

exports.getCart = (req, res) => {
  req.user
    .getCart()
    .then(cart => {
      return cart
        .getProducts()
        .then(products => {
          res.render('shop/cart', {
            pageTitle: 'Cart',
            products
          })
        })
    })
    .catch(err => console.log(err));
}

exports.postAddToCart = (req, res) => {
  const productId = req.body.prodId;
  let fetchedProduct;

  req.user
    .getCart()
    .then(cart => {
      ProductModelDB
        .findByPk(productId)
        .then(product => {
          fetchedProduct = product;
          return CartItemModelDB.findOne({ 
            where: { productId: product.id, cartId: cart.id } 
          });
        })
        .then(product => {
          if(!product){
            return CartItemModelDB.create({
              quantity: 1,
              productId: fetchedProduct.id,
              cartId: cart.id
            });
          }
          else {
            product.quantity = product.quantity + 1;
            return product.save();
          }
        })
        .then(() => {
          res.redirect('/cart');
        });
    })
    .catch(err => console.log(err));
}

exports.postOrder = (req, res) => {
  let fetchedCart;

  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user
        .createOrder()
        .then(order => {
          order.addProducts(
            products.map(prod => {
              prod.orderItem = {quantity: prod.cartItem.quantity };
              return prod;
            })
          );
        })
    })
    .then(() => {
      return fetchedCart.setProducts(null);
    })
    .then(() => {
      res.redirect('/');
    })
    .catch(err => console.log(err));
}

exports.getOrders = (req, res) => {
  req.user
    .getOrders({ include: ['products'] })
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Orders',
        orders
      })
    })
    .catch(err => console.log(err));
}