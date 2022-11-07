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

const userRouter = require('./routers/users')
const contactRouter = require('./routers/contacts')
app.use(userRouter)
app.use(contactRouter)

const port = process.env.PORT

app.listen(port, () => {
    console.log('API service is up on port ' + port)
})