/*nodemailer setup
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
  });
  */

//SendInBlue Setup
const Sib = require('sib-api-v3-sdk')
const client = Sib.ApiClient.instance
const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.SIB_API_KEY

//sendgrid setup
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => { 
    sgMail.send({ 
        to: email, 
        from: 'sspire2@eagles.bridgewater.edu', 
        subject: 'Welcome to Breadcrumbs!', 
        text: `Hello ${name}!\nWe have some great things in store for you!` 
    })
}

const sendPwResetEmail_deprecated_SG = (email, name, reset_url) => { 

    sgMail.send({ 
        to: email, 
        from: 'sethspire19@gmail.com', 
        subject: 'Breadcrumbs Reset Password', 
        text: `Hello ${name}!\nWe have received a request to reset the password for the account at thebreadcrumbs.herokuapp.com that associated with your email. If you did not attempt to reset your email, please ignore the following link and contact us at BreadCrumbs.\n\n Here is the link you can follow to reset your password:\n${reset_url}\n\nThank you!\nBest wishes,\nThe Breadcrumbs Team` 
    })
}

// using SendInBlue rather than SendGrid
const sendPwResetEmail = async (email, name, reset_url) => {
    const tranEmailApi = new Sib.TransactionalEmailsApi()
    const sender = {
        email: 'sspire2@eagles.bridgewater.edu',
        name: 'Seth Spire',
    }
    const receivers = [
        {
            email: email,
        },
    ]
    tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: "Breadcrumbs Reset Password",
        textContent: `Hello ${name}!\nWe have received a request to reset the password for the account at thebreadcrumbs.herokuapp.com that associated with your email. If you did not attempt to reset your email, please ignore the following link and contact us at BreadCrumbs.\n\n Here is the link you can follow to reset your password:\n${reset_url}\n\nThank you!\nBest wishes,\nThe Breadcrumbs Team` 
    })
    .then(console.log)
    .catch(console.log)
}

module.exports = { sendWelcomeEmail, sendPwResetEmail }