const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userID: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  title: String,
  body: String
});

mongoose.model('Post', postSchema)