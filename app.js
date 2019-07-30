const express = require('express');

const bodyParser = require('body-parser');

const sequelize = require('./util/database');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const User = require('./models/user');
const Product = require('./models/product');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

const options = {
  host: 'localhost',
  port: 3306,
  user: '<user_name>',
  password: '<password>',
  database: '<database_name>'
};

const sessionStore = new MySQLStore(options);
const csrfProtection = csrf();

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'session_secret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));
app.use(csrfProtection);
app.use(flash());


app.use((req, res, next) => {
  if(!req.session.user){
    return next();
  }
  User
    .findOne({ where: { email: req.session.user.email } })
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
})
app.use('/', shopRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);

User.hasMany(Product);
Product.belongsTo(User);
User.hasOne(Cart);
Cart.belongsTo(User);
Product.belongsToMany(Cart, { through: CartItem });
Cart.belongsToMany(Product, { through: CartItem });
User.hasMany(Order);
Order.belongsTo(User);
Product.belongsToMany(Order, { through: OrderItem });
Order.belongsToMany(Product, { through: OrderItem });

sequelize
  // .sync({ force: true })
  .sync()
  .then(() => {
    app.listen(3001);
  })
  .catch(err => console.log(err));