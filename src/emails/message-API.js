const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendLocationEmail = async (email, name, userEmail, userName, msgText, geoLocation, timeStamp, batchId) => { 
    sgMail.send({ 
        to: email, 
        from: userEmail, 
        subject: 'SOS Message from ${userName}', 
        text: `Hello ${name}!\n ${msgText}. This is my location: ${geoLocation}`, 
        sendAt: timeStamp,
        batchId: batchId
    })
}

module.exports = { sendLocationEmail }