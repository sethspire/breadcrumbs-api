const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const sgClient = require('@sendgrid/client');
sgClient.setApiKey(process.env.SENDGRID_API_KEY);

const sendLocationEmail = async (email, name, userName, msgText, geoLocation, dateTime, batch_id) => { 
    tempDate = new Date(dateTime)
    const timeStamp = Math.floor(tempDate.getTime() / 1000)
    sgMail.send({ 
        to: email, 
        from: "sspire2@eagles.bridgewater.edu", 
        subject: `SOS Message from ${userName}`, 
        text: `Hello ${name}!\n ${msgText}. This is my location: ${geoLocation}`, 
        sendAt: timeStamp,
        batch_id: batch_id
    })
}

// now works :)
const getBatchID = async() => {
    const headers = {
    }

    const batchID_request = {
        url: `/v3/mail/batch`,
        method: 'POST',
        headers: headers
    }
    
    try {
        const response = await sgClient.request(batchID_request)
        return response[1].batch_id
    } catch (e) {
        console.log("got error", e)
    }
}

module.exports = { sendLocationEmail, getBatchID }