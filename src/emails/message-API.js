//SendInBlue Setup
const Sib = require('sib-api-v3-sdk')
const client = Sib.ApiClient.instance
const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.SIB_API_KEY

//sendgrid setup
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const sgClient = require('@sendgrid/client');
const { constructFromObject } = require('sib-api-v3-sdk/src/ApiClient')
sgClient.setApiKey(process.env.SENDGRID_API_KEY);

const scheduleLocationEmail = async (email, name, senderName, msgText, geoLocation, dateTime) => {
    const tranEmailApi = new Sib.TransactionalEmailsApi()
    const sender = {
        email: 'sspire2@eagles.bridgewater.edu',
        name: 'Seth Spire',
    }
    const receivers = [
        {
            email: email
        },
    ]
    gottenData = tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: `SOS Message from ${senderName}`, 
        textContent: `Hello ${name}!\n ${msgText}. This is my location: ${geoLocation.city}, ${geoLocation.state}, ${geoLocation.street}.`,
        scheduledAt: dateTime
    }).then(function(data) {
        console.log('API called successfully. Returned data: ' + JSON.stringify(data));
        return data.messageId;
      }, function(error) {
        console.error(error);
        return null
      });

    return gottenData
}

const deleteScheduledSend = async (emailID) => {
    const url = "https://api.sendinblue.com/v3/smtp/email/" + emailID

    const options = {
        method: "DELETE",
        headers: {
            "api-key": process.env.SIB_API_KEY,
        }
    }
    
    let response = await fetch(url, options)

    if (response.ok) {
        return "success"
    } else {
        data = await response.json()
        return data.message
    }
}

const sendLocationEmail_deprecated = async (email, name, userName, msgText, geoLocation, dateTime, batch_id) => { 
    tempDate = new Date(dateTime)
    const timeStamp = Math.floor(tempDate.getTime() / 1000)
    sgMail.send({ 
        to: email, 
        from: "sspire2@eagles.bridgewater.edu", 
        subject: `SOS Message from ${userName}`, 
        text: `Hello ${name}!\n ${msgText}.\nThis is my location: ${geoLocation.state}, ${geoLocation.city}, ${geoLocation.street}.`, 
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

module.exports = { scheduleLocationEmail, deleteScheduledSend }