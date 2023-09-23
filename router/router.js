const express = require('express');
const router = express.Router();
const {ensureAuth , ensureGuest} = require('../middleware/auth');

const Story = require('../model/Story');

// login
router.get('/', ensureGuest , (req,res)=>{
    res.render('login',{
        layout : 'login'
    });
})

router.get('/stories/add',(req,res) => {
    res.render('stories/add');
});

// deshboard
router.get('/dashboard', ensureAuth , async (req,res)=>{

    try {
        const stories = await Story.find({user : req.user.id}).lean()
        res.render('dashboard',{
            name : req.user.first_name,
            image : req.user.image,
            stories
        });
    } catch (error) {
        console.error(error);
        res.redirect('/error/500')
    }
})

module.exports = router;