const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => { 

    sgMail.send({ 
        to: email, 
        from: 'sspire2@bridgewater.edu', 
        subject: 'Welcome to Breadcrumbs!', 
        text: `Hello ${name}!\nWe have some great things in store for you!` 
    })
    
} 

module.exports = { sendWelcomeEmail }