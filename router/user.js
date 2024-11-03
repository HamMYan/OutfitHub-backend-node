const express = require('express');
const user = express.Router();

user.get('/homePage',(req,res) => {
    res.send(req.user)
})

module.exports = user