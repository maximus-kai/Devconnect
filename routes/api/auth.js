const { Router } = require('express');
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');

//@route    Get api/auth
//@desc     Test Route
//@access   Public
router.get('/', auth, async (req,res)=> {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error');
    }

});

//@route    post api/auth
//@desc     Authenticate User and get token
//@access   Public

router.post('/',
[
check('email','Please include a valid email').isEmail(),
check('password','Password is required').exists()
]
, 
async (req,res)=> {
    const errors= validationResult(req);
    const {email,password} = req.body;

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try{
        //see if user exists
        let user = await User.findOne({email});
        if(!user){
          return  res
          .status(400)
          .json({errors:[{msg: "invalid credentials"}]})
        }
        
        const isMatch = await bcrypt.compare(password,user.password);
        
        if(!isMatch){
            return res
            .status(400)
            .json({error: [{msg:'"invalid credentials'}]})
        }
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload,
            config.get('jwtSecret'),
            {expiresIn:360000},
            (err,token)=>{
                if(err) {
                    throw err;
                }else{
                res.json({token});
            }
        }
        );
    }catch(err){
        console.error(err.message);
        res.status(500).send('server error');
    }
});


module.exports = router;