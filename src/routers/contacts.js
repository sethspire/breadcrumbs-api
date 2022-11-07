const express = require('express')
const Contact = require('../models/contact')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/contacts', auth, async(req, res) => {
    const user = req.user
    
    const contact = new Contact({
        ...req.body,
        owner: user._id
    })
    
    try {
        await contact.save()
        res.status(201).send(contact)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/contacts', auth, async(req, res) => {
    try {
        await req.user.populate({
            path: 'contacts'
        })
        res.send(req.user.contacts)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/contacts', auth, async(req, res) => {
    const id = req.body._id
    delete req.body._id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'phoneNumber']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates.' })
    }

    try {
        const contact = await Contact.findOne({ _id: id, owner: req.user._id })

        if (!contact) {
            return res.status(404).send("couldn't find that contact")
        }

        updates.forEach((update) => contact[update] = req.body[update])
        await contact.save()
        res.send(contact)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/contacts', auth, async(req, res) => {
    try {
        const contact = await Contact.findOneAndDelete({ _id: req.body._id })

        if (!contact) {
            return res.status(404).send()
        }

        res.send(contact)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router