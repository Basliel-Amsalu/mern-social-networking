const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  text: {
    type: String,
    required: true,
   
  },
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
  likes: [
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }
  ],
  comments: [
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        text: {
            type: String,
            require
        },
        date: {
          type: Date,
          default: Date.now,
        },
    }
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", userSchema);

module.exports = Post;
