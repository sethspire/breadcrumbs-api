const mongoose = require('mongoose')
const User = require('./user')
const validator = require('validator')

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
    /*
    // contacts schema if pre-saving contact info
    contacts: {
        type: [mongoose.Schema.Types.ObjectId],
        default: undefined,
        required: true,
        ref: 'Contact',
        validate: [arrayMin1, '{PATH} needs at least 1']
    },
    */
    // contact schema to create contacts unique to message
    contacts: {
        type: [{
            name: {
                type: String,
                required: true,
                trim: true
            },
            email: {
                type: String,
                required: true,
                trim: true,
                lowercase: true,
                validate(value) {
                    if (!validator.isEmail(value)) {
                        throw new Error('Email is invalid.')
                    }
                }
            }
        }],
        validate: [arrayMin1, '{PATH} needs at least 1']
    },
    geoLocation: {
        state: {type: String, required: true},
        city: {type: String, required: true},
        street: {type: String}
    },
    completed: {
        type: Boolean,
        default: false,
        required: true
    },
    batch_id: {
        type: String,
        //required: true
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

function arrayMin1(val) {
    return val.length >= 1;
}

const Message = mongoose.model('Message', messageSchema);

module.exports = Message