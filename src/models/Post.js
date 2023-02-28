const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  title: String,
  body: String,
  dateCreated: Number
});

mongoose.model('Post', postSchema)