const express = require('express');
const router = express.Router();

//const Contact = require('../models/contacts');

var course = require('../models/contacts');

//retriving contacts
router.get('/contacts',(req,res,next)=>{
    course.find(function(err, contents){
        console.log("here is the content "+ contents);
        res.json(contents);
    })
});

//get checkbox list
router.get('/list', function(req, res, next){
    res.render('index');
})

router.post('/delete', function(req,res,next){
    console.log(req.body);
    console.log('hello');
    res.send('hello')
})

//add contact
router.post('/contact',(req,res,next)=>{
    let newContact = new Contact({
        user_name : req.body.user_name,
        address : req.body.address,
        phone: req.body.contact,
        email : req.body.email
    });
    
    newContact.save((err,contact)=>{
        if(err){
            res.json({msg: 'Failed to add contact'});
        }else
        {
            res.json({msg: 'Contact added Successfully'});;
        }
    });
});

    router.delete('/contact/:id',(req,res,next)=>{
    Contact.remove({_id: req.params.id},function(err,result){
        if(err){
            res.json(err);
        }else{
            res.json(result);
        }
    });
});

module.exports=router;