const mongoose = require('mongoose')
const express = require('express')

const Post = mongoose.model('Post');

const requireAuth = require('../middleware/requireAuth');
const router = express.Router()

const findPost = async (_id, user) => {
  const post = await Post.findOne({_id, user});
  if(!post) throw {message: 'No post found with specified ID'}
  return post;
}

router.post('/posts', requireAuth, async (req,res)=>{
  const {title, body} = req.body;
  
  if(!title) return res.status(404).send({message: 'title is missing'});
  if(!body) return res.status(404).send({message: 'body is missing'});

  const post = new Post({
    title, 
    body,
    user: req.user.id, 
    dateCreated: Date.now()
  });

  post.save();
  res.send(post.populate('user','name -_id','User'))
})

router.get('/posts', requireAuth, async (req,res)=>{
  let { page, limit, fields } = req.query;
  // default page and limits
  page = !page ? 0 : parseInt(page);
  limit = !limit ? 10 : parseInt(limit);

  try{
    const posts = await Post.find()
      .populate('user','name -_id','User')
      .select(JSON.parse(fields))
      .limit(limit)
      .skip((page-1) * limit)
      .sort({dateCreated: -1})
    
    res.send({
      limit,
      page,
      fields: JSON.parse(fields),
      data: posts
    });
  }catch(err){
    res.status(404).send({message: err.message})
  }
})

router.put('/posts/:postID', requireAuth, async (req,res)=>{
  const {postID} = req.params;
  const {title, body} = req.body;

  try{
    const post = await findPost(postID, req.user.id);
    
    post.title = title ? title : post.title;
    post.body = body ? body : post.body;

    const updated = await post.save();
    res.send(updated)
  }catch(err){
    res.status(404).send({message: err.message})
  }

})

router.delete('/posts/:postID', requireAuth, async (req,res)=>{
  const {postID} = req.params;

  try{
    const post = await findPost(postID, req.user.id);

    Post.findByIdAndDelete(postID, {new: true}, (err,docs) => {
      if(err) return res.status(404).send({message: 'Could not delete'});
      res.send({message: 'Successfully Deleted', data: docs})
    })

  }catch(err){
    res.status(404).send({message: err.message})
  }
})

router.get('/posts/:postID', requireAuth, async (req,res)=>{
  const {postID} = req.params;

  if(!postID) return res.status(404).send({message: 'postID is missing'})

  try{
    await findPost(postID, req.user.id);
    
    const post = await Post.findById(postID)
      .populate('user','name -_id','User')
      .populate({
        path: 'comments',
        populate: {
          path: "user" // in blogs, populate comments
        },
        match: 'postID',
        model: 'Post'
      })
    res.send(post)
    
  }catch(err){
    res.status(404).send({message: err.message});
  }
})

module.exports = router;