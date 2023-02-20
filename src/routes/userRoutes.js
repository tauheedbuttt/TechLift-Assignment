const mongoose = require('mongoose')
const express = require('express')

const User = mongoose.model('User');

const requireAuth = require('../middleware/requireAuth');
const router = express.Router()

// Get All Users
router.get('/users', requireAuth,  async (req, res) => {
  try{
    const users = await User.find();
    res.send(users)
  }catch(err){
    res.status(404).send({message: err.message})
  }
})

// Get User by ID
router.get('/users/:userID', requireAuth, async (req,res) => {
  const {userID} = req.params;

  try{
    const user = await User.findById(userID);
    res.send(user)
  }catch(err){
    res.status(404).send({message: err.message})
  }

})

// Update User by ID
router.put('/users/:userID', requireAuth, async (req,res) => {
  const {userID} = req.params;
  const user = req.body;

  try{
    User.findByIdAndUpdate(userID, user, {new: true}, (err, docs) => {
      if(err) return res.status(404).send({message: 'Could not update User'})
      res.send(docs)
    })
  }catch(err){
    res.status(404).send({message: err.message})
  }

})

// Delete User by ID
router.delete('/users/:userID', requireAuth, async (req,res) => {
  const {userID} = req.params;

  try{
    User.findByIdAndDelete(userID, (err, docs) => {
      if(err) return res.status(404).send({message: 'Could not delete User'})
      res.send({message: 'User deleted successfully'})
    })
  }catch(err){
    res.status(404).send({message: err.message})
  }

})

module.exports = router;