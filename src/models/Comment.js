const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  postID: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
  body: String,
  dateCreated: Number,
});

mongoose.model('Comment', commentSchema)