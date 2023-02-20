
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');

const SECRET_KEY = process.env.SECRET_KEY;

const requireAuth = async (req, res, next) => {
  // check to see if token is passed or not
  const {authorization} = req.headers;
  const token = authorization?.split('Bearer ')[1];

  if(!token) return res.status(404).send({message: 'token needs to be passed in header'})

  // validate the jwt
  jwt.verify(token, SECRET_KEY, async (err, payload) => {
    if(err) return res.status(404).send({message: 'You are not logged in'})
    
    // fetch user
    const user = await User.findById(payload.userID)
    if(!user) return res.status(404).send({message: 'You are not logged in'})

    req.user = user

    next()
  })
}

module.exports = requireAuth