const User = require('../models/user')

const updateMessages = async (req, res, next) => {
  try {
    await req.user.populate({
        path: 'messages'
    })
    for (const msNum in req.user.messages) {
        message = req.user.messages[msNum]
        if (message.sendDatetime < new Date()) {
            message.completed = true
            await message.save()
        }
    }

    next()
 
  } catch (e) {
    res.status(400).send({error: 'Issue updating messages'})
  }
}

module.exports = updateMessages