const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userID: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  postID: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
  comment: String
});

mongoose.model('Comment', commentSchema)