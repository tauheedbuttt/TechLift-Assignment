const express = require('express')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { error } = require('../config/functions')

const User = mongoose.model('User')

const SECRET_KEY = process.env.SECRET_KEY
const router = express()

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email) return error(res, 'email is required');
  if (!password) return error(res, 'password is required');

  // get user with email
  const user = await User.findOne({ email })
  if (!user) return error(res, 'Invalid Email or Password')

  // compare passwords
  const compare = await bcrypt.compare(password, user.password);
  if (!compare) return error(res, "Invalid Email or Password")

  // return token
  const token = jwt.sign({ userID: user.id }, SECRET_KEY)

  res.send({ token })
})

router.post('/signup', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name) return error(res, 'name is required');
  if (!email) return error(res, 'email is required');
  if (!password) return error(res, 'password is required');
  if (!confirmPassword) return error(res, 'confirmPassword is required');

  if (confirmPassword != password) return error(res, 'confirmPassword is not same as password');

  // check if email already exists
  const exists = await User.findOne({ email })
  if (exists) return error(res, 'Account with this email already exists')

  // create user
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed })
  user.save()

  // create jwt token
  const token = jwt.sign({ userID: user.id }, SECRET_KEY)

  res.send({ token })
})

module.exports = router;