const express = require('express')
const app = express()
const router = require('./router/router')
const passport = require('passport')
const cors = require('cors')
const user = require('./router/user')

const port = process.env.PORT || 8080
const secret = process.env.TOP_SECRET

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(
    require('express-session')({
        secret: "Top_Secret",
        resave: false,
        saveUninitialized: true
    })
)

app.use(passport.initialize())
app.use(passport.session())

app.use('/', router)
app.use('/user', user)


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}\n`);
})