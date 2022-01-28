// const { Router } = require('express');
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const {check, validationResult} = require('express-validator');


//@route    Get api/profile/me
//@desc     get current user's profile
//@access   private
router.get('/me', auth, async (req,res)=> 
{
    try{
        console.log('try ran1');
        console.log('try ran2');
        const profile = await Profile.findOne({user: req.user.id})
        console.log('try ran 2')
   
        if(!profile){
            console.log('no such profile!')
            return res.status(400).json({msg:'There is no profile for this user'})
        }
        
        console.log('profile exists !')
        //res.json(profile)
    }catch(err){
        console.error(err.message,'catch block error');
        res.status(500)
        .json({error:[{msg: 'server error'}]})
    }
});

//@route    post api/profile
//@desc     create/update current user's profile
//@access   private

module.exports = router;