const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Schema = mongoose.Schema
const Contact = require('./contact')

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
    },
    tokens: [{
      token: {
          type: String,
          required: true
      }
    }],
    pwResetToken: {
      token: {
        type: String
      },
      timestamp: {
        type: Date
      } 
    }
  })

userSchema.methods.toJSON = function() {
  const user = this
  
  const userObject = user.toObject()
  
  delete userObject.password
  delete userObject.__v
  delete userObject.tokens
  delete userObject.pwResetToken
  
  return userObject
}

userSchema.pre('save', async function(next) {
  
  const user = this
  
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()  // run the save() method
})

userSchema.methods.generateAuthToken = async function () {
  const user = this

  if (user.tokens.length >= 4) {
    user.tokens.shift()
  }

  const token = jwt.sign({ _id: user._id.toString() }, process.env.JSON_WEB_TOKEN_SECRET)
  user.tokens = user.tokens.concat({ token })
  await user.save()

  return token
}

userSchema.methods.generatePwResetAuthToken = async function() {
  const user = this

  const token = jwt.sign({ _id: user._id.toString() }, process.env.JSON_WEB_TOKEN_SECRET)
  user.pwResetToken.token = token
  user.pwResetToken.timestamp = Date.now()
  await user.save()

  return token
}

userSchema.statics.findByCredentials = async (email, password) => {       
  const user = await User.findOne({email}) 
  if (!user) { 
    throw new Error('Unable to login') 
  } 
  const isMatch = await bcrypt.compare(password, user.password) 
  if (!isMatch) { 
    throw new Error('Unable to login') 
  } 
  return user 
}

userSchema.statics.findByEmail = async (email) => {       
  const user = await User.findOne({email}) 
  if (!user) { 
    throw new Error('Unable to login') 
  }
  return user 
}

userSchema.virtual('contacts', {
  localField: '_id',
  foreignField: 'owner',
  ref: 'Contact'
})

userSchema.virtual('messages', {
  localField: '_id',
  foreignField: 'owner',
  ref: 'Message'
})

userSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  const user = this

  await mongoose.model('Contact').deleteMany({ owner: user._id })
  await mongoose.model('Message').deleteMany({ owner: user._id })
  next()
})

const User = mongoose.model('User', userSchema);

module.exports = User