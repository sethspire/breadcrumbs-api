const mongoose = require('mongoose') 

const Schema = mongoose.Schema

const userSchema = new Schema({ 
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 8
      },
      name: { 
        type: String,
        unique: true,
        required: true,
        trim: true
      }
  })

  const User = mongoose.model('User', userSchema);

  module.exports = User