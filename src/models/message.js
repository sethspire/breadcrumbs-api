const mongoose = require('mongoose')
const validator = require('validator')
const User = require('./user')

const Schema = mongoose.Schema

const messageSchema = new Schema({
    messageText: {
        type: String,
        required: true,
        trim: true,
        maxLength: 1000
    },
    // date format, input as String of form "YYYY-MM-DDTHH:mm:ss.sssZ"
    sendDatetime: {
        type: Date,
        required: true,
    },
    contacts: {
        type: [mongoose.Schema.Types.ObjectId],
        default: undefined,
        required: true,
        ref: 'Contact'
    },
    geoLocation: {
        type: String,
        trim: true,
        required: true,
        maxLength: 100
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

messageSchema.methods.toJSON = function() {
    const messageObject = this.toObject()
    
    delete messageObject.__v
    
    return messageObject
}

const Message = mongoose.model('Message', messageSchema);

module.exports = Message