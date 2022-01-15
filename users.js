const express = require("express");
const router = express.Router();
const validateLoginInput = require("../../validation/login");
// Load User model
const User = require("./models/UserSchema");


// @route POST api/users/register
// @desc Register user
// @access Public

router.post("/signup", (req, res) => {
    
    User.findOne({address:req.body.address}).then(user=>{

        if(user){
            return res.json(user);
        } else{ 
            const newUser = new User({
                name:req.body.name,
                address:req.body.address
            });
            newUser
            .save()
            .then(user => {return res.redirect('/')})
            .catch(err => console.log(err));
        }
    });

});
