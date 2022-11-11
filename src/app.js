const express = require('express')
const cors = require('cors');
require('./db/mongoose')

const app = express()
app.use(express.json())

app.use(cors())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const usersRouter = require('./routers/users')
//const contactsRouter = require('./routers/contacts')
const messagesRouter = require('./routers/messages')
app.use(usersRouter)
//app.use(contactsRouter)
app.use(messagesRouter)

const port = process.env.PORT

app.listen(port, () => {
    console.log('API service is up on port ' + port)
})