const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  title: String,
  body: String,
  dateCreated: Number,
  comments:[{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
});

mongoose.model('Post', postSchema)