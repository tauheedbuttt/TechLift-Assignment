const mongoose = require('mongoose')
const express = require('express')

const User = mongoose.model('User');
const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');

const requireAuth = require('../middleware/requireAuth');
const router = express.Router()

router.get('/posts/:postID/comments', requireAuth, async (req,res)=>{
  const posts = await Post.find();
  res.send(posts);
})

router.post('/posts/:postID/comments', requireAuth, async (req,res)=>{
  const {postID} = req.params;
  res.send(postID);
})

router.put('/posts/:postID/comments/:commentID', requireAuth, async (req,res)=>{
  const {postID, commentID} = req.params;
  res.send(postID, commentID);
})

router.delete('/posts/:postID/comments/:commentID', requireAuth, async (req,res)=>{
  const {postID, commentID} = req.params;
  res.send(postID, commentID);
})
module.exports = router;