const mongoose = require('mongoose')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema(
  { 
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid.')
        }
      }
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

userSchema.methods.toJSON = function() {
  const user = this
  
  const userObject = user.toObject()
  
  delete userObject.password
  delete userObject.__v
  
  return userObject
}

const User = mongoose.model('User', userSchema);

module.exports = User