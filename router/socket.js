const express = require('express');
const router = express.Router();
const socket = require('socket.io');
const {ensureAuth} = require('../middleware/auth');

router.get('/',ensureAuth,(req,res)=>{
    res.render('chat/chat');
});

module.exports = socket;