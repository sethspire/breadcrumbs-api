const express = require('express')
require('./db/mongoose')

const userRouter = require('./routers/users')

const app = express()
app.use(express.json())

app.use(userRouter)

const port = process.env.PORT

app.listen(port, () => {
    console.log('API service is up on port ' + port)
})