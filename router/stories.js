const express = require('express');
const router = express.Router();
const {ensureAuth} = require('../middleware/auth');

const Story = require('../model/Story');

// story add
router.get('/add', ensureAuth , (req,res)=>{
    res.render('stories/add');
});

// post upload with post method
router.post('/', ensureAuth, async (req, res) => {
    try {
      req.body.user = req.user.id
      await Story.create(req.body)
      res.redirect('/dashboard')
    } catch (err) {
      console.error(err)
      res.render('error/500')
    }
  });

  // index
  router.get('/', ensureAuth , async (req,res) => {

    try {
      const stories = await Story.find( {status : 'public' } )
      .populate('user')
      .sort({ createdAt : 'desc' })
      .lean()
      res.render('stories/index',{
        stories,
      });
    } catch (error) {
      console.error(error);
      res.render('error/500');
    }
  })

  // story edit 
router.get('/edit/:id', ensureAuth , async (req,res)=>{

  try {
    const story = await Story.findOne({
      _id: req.params.id,
    }).lean();

    if(!story) {
      return res.render('error/404');
    }
    if(story.user != req.user.id) {
      res.redirect('/stories');
    }else {
      return res.render('stories/edit',{
        story,
      });
    }

  } catch (error) {
    console.error(error);
    res.render('error/404');
  }
  res.render('stories/edit');
});

// story update put method 
router.put('/:id', ensureAuth , async (req,res)=>{

  try {
    let story = await Story.findById(req.params.id).lean()

    if(!story) {
      return res.render('error/404')
    }
    if(story.user != req.user.id) {
      res.redirect('/stories');
    }else {
     story = await Story.findByIdAndUpdate({_id: req.params.id}, req.body , {
      new : true , 
      runValidators : true, 
     })
     res.redirect('/stories');
    }
    
  } catch (error) {
    console.error(error);
    res.render('error/500');
  }
  
});

// story details 
router.get('/:id', ensureAuth , async (req,res)=>{
  try {
    let story = await Story.findById(req.params.id).populate('user').lean()

    if(!story) {
      return res.render('error/404')
    }
    if(story.user.id != req.user.id && story.status == 'private') {
      res.render('error/404')
    }else {
      res.render('stories/show',{
        story,
      })
    }
  } catch (error) {
    console.error(error);
    res.render('error/500')
  }
});

// story delete
router.delete('/:id', ensureAuth , async (req,res)=>{
  try {
    let story = await Story.findById(req.params.id).lean()

    if(!story) {
      res.render('error/400');
    }
    if(story.user != req.user.id) {
      res.redirect('/stories');
    }else {
      await Story.deleteOne({_id: req.params.id})
      res.redirect('/dashboard');
    }
  } catch (error) {
    console.error(error);
    return res.render('error/500');
  }
});

// story user post find status public 
router.get('/user/:userId', ensureAuth , async (req,res)=>{
  try {
    const stories = await Story.find({
      user : req.params.userId,
      status : 'public',
    }) .populate('user').lean()
    res.render('stories/index',{
      stories,
    })
  } catch (error) {
    console.error(error);
    res.render('error/500');
  }
});

// story search
router.get('/search/:query', ensureAuth , async (req,res)=>{
  try {
    const stories = await Story.find({title : new RegExp(req.query.query,'i'),status : 'public'}).populate('user').sort({createdAt : 'desc'}).lean()
      res.render('stories/index',{stories})
  } catch (error) {
    console.error(error);
    res.render('error/404');
  }
});

module.exports = router;