const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const sgClient = require('@sendgrid/client');
sgClient.setApiKey(process.env.SENDGRID_API_KEY);

const sendLocationEmail = async (email, name, userName, msgText, geoLocation, dateTime) => { 
    tempDate = new Date(dateTime)
    const timeStamp = Math.floor(tempDate.getTime() / 1000)
    sgMail.send({ 
        to: email, 
        from: "sspire2@eagles.bridgewater.edu", 
        subject: `SOS Message from ${userName}`, 
        text: `Hello ${name}!\n ${msgText}. This is my location: ${geoLocation}`, 
        sendAt: timeStamp
    })
}

// doesn't work for some reason
const getBatchID = async() => {
    const headers = {
    }
    const batchID_request = {
        url: `/v3/mail/batch`,
        method: 'POST',
        headers: headers
    }
    sgClient.request(batchID_request)
        .then(([response]) => {
            console.log("might have gotten batch id")
            console.log(response.statusCode)
            console.log(response.body)
            return response
        })
        .catch(error => {
            console.log("error getting batch id")
            console.error(error)
    });
}

module.exports = { sendLocationEmail, getBatchID }