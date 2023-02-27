const mongoose = require('mongoose')
const express = require('express')

const User = mongoose.model('User');
const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');

const requireAuth = require('../middleware/requireAuth');
const router = express.Router()

router.post('/posts', requireAuth, async (req,res)=>{
  const posts = await Post.find();
  res.send(posts);
})

router.get('/posts', requireAuth, async (req,res)=>{
  const posts = await Post.find();
  res.send(posts);
})

router.put('/posts/:postID', requireAuth, async (req,res)=>{
  const {postID} = req.params;
  res.send(postID);
})

router.delete('/posts/:postID', requireAuth, async (req,res)=>{
  const {postID} = req.params;
  res.send(postID);
})

router.get('/posts/:postID', requireAuth, async (req,res)=>{
  const {postID} = req.params;
  res.send(postID);
})

module.exports = router;