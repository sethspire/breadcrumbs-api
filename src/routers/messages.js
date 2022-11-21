const express = require('express')
const Message = require('../models/message')
const auth = require('../middleware/auth')
const { sendLocationEmail } = require('../emails/message-API.js')
const router = new express.Router()

router.post('/messages', auth, async(req, res) => {
    const user = req.user
    
    const message = new Message({
        ...req.body,
        owner: user._id
    })
    
    try {
        await message.save()
        await message.sendLocationEmail(message.contacts.email, message.contacts.name, user.email, user.name, message.messageText, message.geoLocation, message.timeStamp, message._id)
        res.status(201).send(message)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/messages', auth, async(req, res) => {
    try {
        await req.user.populate({
            path: 'messages'
        })
        res.send(req.user.messages)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/messages', auth, async(req, res) => {
    const id = req.body._id
    delete req.body._id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['messageText', 'sendDatetime', 'contacts', 'geoLocation', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates.' })
    }

    try {
        const message = await Message.findOne({ _id: id, owner: req.user._id })

        if (!message) {
            return res.status(404).send("couldn't find that message")
        }

        updates.forEach((update) => message[update] = req.body[update])
        await message.save()
        res.send(message)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/messages', auth, async(req, res) => {
    try {
        const message = await Message.findOneAndDelete({ _id: req.body._id })

        if (!message) {
            return res.status(404).send("could not find that message")
        }

        res.send(message)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router
