const express = require('express')
const User = require('../models/user')
const { sendWelcomeEmail, sendPwResetEmail } = require('../emails/account.js')
const auth = require('../middleware/auth')
const jwt = require('jsonwebtoken')

const router = new express.Router()

// Add a new user
router.post('/users', async (req, res) => {
  if (req.body.password !== req.body.passwordRetype) {
    return res.status(400).send({ error: 'Passwords Must Match' , message: 'Passwords must match'})
  }
  delete req.body.passwordRetype

  const user = new User(req.body)
  
  try {
    await user.save()
    const token = await user.generateAuthToken()

    sendWelcomeEmail(user.email, user.name)
    res.status(201).send({user, token})
  } 
  catch(error) {
    res.status(400).send(error)
  }
})

// Logout a user
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()
    
    res.send()
  }
  catch (e) {
    res.status(500).send()
  }
})

// login a user
router.post('/users/login', async (req, res) => {
  
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.status(200).send({user, token})
  } 
  catch (e) {    
    res.status(400).send()
  }
})

// return user info
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
})

// modify user information
router.patch('/users/me', auth, async(req, res) => {
  const mods = req.body
  const props = Object.keys(mods)
  const modifiable = ['name', 'password']
  const isValid = props.every((prop) => modifiable.includes(prop))

  if (!isValid) {
      return res.status(400).send({ error: 'Invalid updates.' })
  }

  try {
      const user = req.user
      props.forEach((prop) => user[prop] = mods[prop])
      await user.save()
      res.send(user)
  } catch (e) {
      res.status(400).send()
  }
})

// delete user
router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.deleteOne()
    res.send(req.user)
  } 
  catch (e) {
    res.status(500).send()
  }
})

// send password reset email
router.post('/user/pwReset/sendEmail', async (req, res) => {
  try {
    const user = await User.findByEmail(req.body.email)
    const token = await user.generatePwResetAuthToken()
    reset_url = "thebreadcrumbs.herokuapp.com/Forgotten_Login_Pages/password_pages/HTML/reset_password.html?pwResetToken=" + token
    sendPwResetEmail(user.email, user.name, reset_url)
    res.status(201).send()
  } 
  catch (e) {    
    res.status(400).send(e)
  }
})

// reset password
router.patch('/user/pwReset/reset', async (req, res) => {
  try {
    // confirm identical passwords
    if (req.body.password !== req.body.confirmPw) {
      return res.status(400).send({ error: 'Passwords Must Match' , message: 'Passwords must match'})
    }

    // confirm pw reset token
    const decoded = jwt.verify(req.body.pwResetToken, process.env.JSON_WEB_TOKEN_SECRET)
    const user = await User.findOne({_id: decoded._id, email: req.body.email, "pwResetToken.token": req.body.pwResetToken})
    if (!user) {
      throw new Error()
    }

    // confirm its been less than 15 minutes
    curDate = Date.now()
    resetCreationDate = user.pwResetToken.timestamp
    diffMinutes = Math.round((curDate - resetCreationDate) / 60000)
    if (diffMinutes >= 15) {
      return res.status(400).send({ error: 'URL Timed Out' , message: 'URL Timed Out'})
    }

    // change password
    user.password = req.body.password
    await user.save()

    res.status(200).send(user)
  } 
  catch (e) {    
    res.status(400).send(e)
  }
})

module.exports = router