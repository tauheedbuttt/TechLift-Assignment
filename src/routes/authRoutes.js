const express = require('express')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const User = mongoose.model('User')

const SECRET_KEY = process.env.SECRET_KEY
const router = express()

router.post('/login', async (req,res)=>{
  const {email, password} = req.body;

  if(!email) return res.status(404).send({message: 'email is required'});
  if(!password) return res.status(404).send({message: 'password is required'});

  // get user with email
  const user = await User.findOne({email})
  if(!user) return res.status(404).send({message: 'Invalid Email or Password'})

  // compare passwords
  const compare = await bcrypt.compare(password, user.password);
  if(!compare) return res.status(404).send({message: "Invalid Email or Password"})

  // return token
  const token = jwt.sign({userID: user.id}, SECRET_KEY)

  res.send({token})
})

router.post('/signup', async (req,res)=>{
  const {name, email, password, confirmPassword} = req.body;

  if(!name) return res.status(404).send({message: 'name is required'});
  if(!email) return res.status(404).send({message: 'email is required'});
  if(!password) return res.status(404).send({message: 'password is required'});
  if(!confirmPassword) return res.status(404).send({message: 'confirmPassword is required'});
  
  if(confirmPassword != password) return res.status(404).send({message: 'confirmPassword is not same as password'});

  // check if email already exists
  const exists = await User.findOne({email})
  if(exists) return res.status(404).send({message: 'Account with this email already exists'})
  
  // create user
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({name, email, password: hashed})
  user.save()

  // create jwt token
  const token = jwt.sign({userID: user.id}, SECRET_KEY)

  res.send({token})
})

module.exports = router;