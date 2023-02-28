const mongoose = require('mongoose')
const express = require('express')
const Comment = mongoose.model('Comment');

const requireAuth = require('../middleware/requireAuth');
const router = express.Router()

const findComment = async (_id, postID, user) => {
  const comment = await Comment.findOne({_id, postID, user});
  if(!comment) throw {message: 'No comment found with specified ID'}
  return comment;
}

router.get('/posts/:postID/comments', requireAuth, async (req,res)=>{
  const {postID} = req.params;
  let { page, limit, fields } = req.query;
  const { filter } = req.body; // {body}
  // default page and limits
  page = !page ? 0 : parseInt(page);
  limit = !limit ? 10 : parseInt(limit);
  
  if(!postID) return res.status(404).send({message: 'postID is missing'});

  try{
    const comments = await Comment.find({
        postID,
      ...(filter?.body ? {body: {$regex: filter?.body}} : {}),
      })
      .select(JSON.parse(fields))
      .populate('user','name -_id','User')
      .limit(limit)
      .skip((page-1) * limit)
      .sort({dateCreated: -1})
    
    res.send({
      limit,
      page,
      fields: JSON.parse(fields),
      data: comments
    });
  }catch(err){
    res.status(404).send({message: err.message})
  }
})

router.post('/posts/:postID/comments', requireAuth, async (req,res)=>{
  const {postID} = req.params;
  const {body} = req.body;
  
  if(!body) return res.status(404).send({message: 'body is missing'});
  if(!postID) return res.status(404).send({message: 'postID is missing'});

  const comment = new Comment({
    postID, 
    body,
    user: req.user.id, 
    dateCreated: Date.now()
  });

  comment.save();
  res.send(comment.populate('user','name -_id','User'))
})

router.put('/posts/:postID/comments/:commentID', requireAuth, async (req,res)=>{
  const {postID} = req.params;
  const {commentID} = req.params;

  const {body} = req.body;

  try{
    const comment = await findComment(commentID, postID, req.user.id);
    comment.body = body;

    await comment.save();
    res.send({message: 'Successfully Updated', data: comment})
  }catch(err){
    res.status(404).send({message: err.message})
  }
})

router.delete('/posts/:postID/comments/:commentID', requireAuth, async (req,res)=>{
  const {postID} = req.params;
  const {commentID} = req.params;

  try{
    const post = await findComment(commentID, postID, req.user.id);

    Comment.findByIdAndDelete(commentID, {new: true}, (err,docs) => {
      if(err) return res.status(404).send({message: 'Could not delete'});
      res.send({message: 'Successfully Deleted', data: docs})
    })

  }catch(err){
    res.status(404).send({message: err.message})
  }
})
module.exports = router;