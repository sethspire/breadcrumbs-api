const express = require('express')
const User = require('../models/user')
const { sendWelcomeEmail } = require('../emails/account.js')
const auth = require('../middleware/auth')

const router = new express.Router()

// Add a new user
router.post('/users', async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save()
    const token = await user.generateAuthToken()

    //sendWelcomeEmail(user.email, user.name)
    res.status(201).send({user, token})
  } 
  catch(error) {
    res.status(400).send(error)
  }
})

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

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
})

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

router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.deleteOne()
    res.send(req.user)
  } 
  catch (e) {
    res.status(500).send()
  }
})

module.exports = router