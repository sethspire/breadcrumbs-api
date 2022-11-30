const express = require('express')
const Message = require('../models/message')
const auth = require('../middleware/auth')
const updateMessages = require('../middleware/updateMessages')
const { scheduleLocationEmail, deleteScheduledSend } = require('../emails/message-API.js')
const router = new express.Router()

router.post('/messages', auth, async(req, res) => {
    const user = req.user
    
    try {

        // set message 
        const message = new Message({
            ...req.body,
            owner: user._id
        })
        await message.save()

        //schedule emails and save email IDs
        for (contact of message.contacts) {
            var emailID = await scheduleLocationEmail(contact.email, contact.name, user.name, message.messageText, message.geoLocation, message.sendDatetime)
            message.sibMessageIDs.push(emailID)
        };
        await message.save()
        res.status(201).send(message)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/messages', auth, updateMessages, async(req, res) => {
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
    const user = req.user
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

        // delete  previously scheduled emails
        for (idNum in message.sibMessageIDs) {
            await deleteScheduledSend(message.sibMessageIDs[idNum])
        }
        message.sibMessageIDs = []
        await message.save()

        // schedule new emails
        for (contact of message.contacts) {
            var emailID = await scheduleLocationEmail(contact.email, contact.name, user.name, message.messageText, message.geoLocation, message.sendDatetime)
            message.sibMessageIDs.push(emailID)
        };

        await message.save()
        res.send(message)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/messages', auth, async(req, res) => {
    try {
        const message = await Message.findOneAndDelete({ _id: req.body._id, owner: req.user._id })

        if (!message) {
            return res.status(404).send("could not find that message")
        }

        // delete scheduled emails
        for (idNum in message.sibMessageIDs) {
            await deleteScheduledSend(message.sibMessageIDs[idNum])
        }

        res.send(message)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/messages/disable', auth, async(req, res) => {
    try {
        const message = await Message.findOne({ _id: req.body._id, owner: req.user._id })
        if (!message) {
            return res.status(404).send("couldn't find that message")
        }
        
        // delete scheduled emails
        for (idNum in message.sibMessageIDs) {
            await deleteScheduledSend(message.sibMessageIDs[idNum])
        }
        message.sibMessageIDs = []

        message.completed = true
        await message.save()
        res.send(message)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/messages/testBatchID', async(req, res) => {    
    try {
        // function to get batchID currently does not work
        const batch_id = await getBatchID()
        console.log(batch_id)
        res.status(201).send(batch_id)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router
