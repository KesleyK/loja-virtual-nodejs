const UserModelDB = require('../models/user');

const bcrypt = require('bcryptjs');

exports.getLogin = (req, res) => {
  console.log(req.flash('error'));
  res.render('auth/login', {
    pageTitle: 'Login'
  });
}

exports.postLogin = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  UserModelDB
    .findOne({ where: {email: email} })
    .then(user => {
      if(!user){
        req.flash('error', 'Password or email invalid');
        return res.redirect('/auth/login');
      }

      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if(!doMatch){
            req.flash('error', 'Password or email invalid');
            return res.redirect('/auth/login');
          }
          req.session.user = user;
          req.session.isLoggedIn = true;
          res.redirect('/');
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
}

exports.getSignUp = (req, res) => {
  res.render('auth/sign-up', {
    pageTitle: 'Sign Up'
  });
}

exports.postSignUp = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if(password != confirmPassword){
    req.flash('error', 'Password does not match');
    return res.redirect('/auth/login');
  }

  UserModelDB
    .findOne({ where: {email: email} })
    .then(user => {
      if(user){
        req.flash('error', 'User exists already');
        return res.redirect('/auth/login');
      }
      bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          return UserModelDB.create({
            email: email,
            password: hashedPassword
          });
        })
        .then(user => {
          return user.createCart();
        })
        .then(() => {
          res.redirect('/auth/login');
        })
        .catch(err => console.log(err));
    })
}