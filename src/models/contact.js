const mongoose = require('mongoose')
const validator = require('validator')
const User = require('./user')

const Schema = mongoose.Schema

const contactSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isMobilePhone(value)) {
                throw new Error('Phone Number is invalid.')
            }
        }
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

contactSchema.methods.toJSON = function() {
    const contactObject = this.toObject()
    
    delete contactObject.__v
    
    return contactObject
}

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact