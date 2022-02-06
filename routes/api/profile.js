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
        const profile = await Profile.findOne({user: req.user.id})
   
        if(!profile){
            console.log('no such profile!')
            return res.status(400).json({msg:'There is no profile for this user'})
        }
        
        console.log('profile exists !')
        res.json(profile)
    }catch(err){
        console.error(err.message,'catch block error');
        res.status(500)
        .json({error:[{msg: 'server error'}]})
    }
});

//@route    post api/profile
//@desc     create/update current user's profile
//@access   private

router.post('/',[auth, [
    check('status','status is required').not().isEmpty(),
    check('skills','skills is required').not().isEmpty()
]],
async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const {company,website,location,bio,status,githubusername,skills,youtube,facebook,twitter,instagram,linkedin} = 
    req.body;
    
    //building the profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
                //removing all unnessessary whitespaces before the commas 
    if(skills) profileFields.skills = skills.split(',').map((skill)=> skill.trim());

    profileFields.social = {};
    if(youtube) profileFields.social.youtube = youtube;
    if(twitter) profileFields.social.twitter = twitter;
    if(facebook) profileFields.social.facebook = facebook;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(instagram) profileFields.social.instagram = instagram;
    
    try{
        let profile = await Profile.findOne({user: req.user.id});

        if(profile){
        //updating an existing profile
            profile = await Profile.findOneAndUpdate(
            {user: req.user.id},
            {$set: profileFields},
            {new: true}
        );
        console.log('profile found... updating')
        res.json(profile);
        
    }else{
        //creating a new profile from given req value in the frontend
        
        profile = new Profile(profileFields);
        console.log('else block')
        await profile.save();
        console.log('profile not found')
          res.json(profile);

      }



    }catch(err){
        console.error(err.message);
        res.status(500).send('server catch error')
    }
});

//@route    get api/profile
//@desc     Get all user profiles
//@access   public

router.get('/', async (req,res)=>{
    try {
        const profiles = await Profile.find({}).populate('user',['name','avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server Error');
    }
})

//@route    get api/profile/user/:user_id
//@desc     Get profiles by user_id
//@access   public

router.get('/user/:user_id', async (req,res)=>{
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user',['name','avatar']);
        if(!profile) return res.status(400).json({msg: 'there is no profile for this user'})
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
          return res.status(400).json({msg: 'there is no profile for this user'});
        }
        res.status(500).send('server Error');
    }
})

module.exports = router;