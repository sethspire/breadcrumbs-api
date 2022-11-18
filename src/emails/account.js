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

const sendPwResetEmail = (email, name, reset_url) => { 

    sgMail.send({ 
        to: email, 
        from: 'sspire2@eagles.bridgewater.edu', 
        subject: 'Breadcrumbs Reset Password', 
        text: `Hello ${name}!\nWe have received a request to reset the password for the account at thebreadcrumbs.herokuapp.com that associated with your email. If you did not attempt to reset your email, please ignore the following link and contact us at BreadCrumbs.\n\n Here is the link you can follow to reset your password:\n${reset_url}\n\nThank you!\nBest wishes,\nThe Breadcrumbs Team` 
    })
}

module.exports = { sendWelcomeEmail, sendPwResetEmail }