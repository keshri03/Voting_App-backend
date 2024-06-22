const express=require('express');
const User = require('../models/user');
const router=express.Router();
const { generateJwtToken, jwtAuthMiddleware } = require('./../jwt');


//signup
router.post('/signup', async (req, res) => {

    try {
        const data = req.body;
        if(data.role=='admin'){
            const alreadyAdmmin=await User.findOne({role: 'admin'});
            if(alreadyAdmmin){
                return res.status(401).json({error: 'Admin pehle se hai bhai'});
            }
        }
        if(!/^\d{12}$/.test(data.aadhaarNumber)){
            return res.status(401).json({ error: 'Aadhaar number galat hai bhao' });
        }
        const alreadyexists = await  User.findOne({aadhaarNumber: data.aadhaarNumber});
        if(alreadyexists){
            return res.status(401).json({ error: 'Ye User phle se h bhai' });
        }
        const newUser=new User(data);
        const response = await newUser.save();
        console.log('user save ho gaya');
        const payload={
            id: response.id
        }
        const token=generateJwtToken(payload);
        res.status(200).json({ response: response,token: token});

    }
    
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'server error ho gaya' });
    }
})

// login
router.post('/login', async (req, res) => {

    try {
        // console.log(req.body);
        const {aadhaarNumber,password}=req.body;
        if(!aadhaarNumber || !password) return res.status(400).json({error: 'aadharr numer or password dono daal bhau'});
        const user=await User.findOne({aadhaarNumber: aadhaarNumber});
        if(!user) return res.status(400).json({error: 'user nai h bhai'});

        if(!user.comparePassword(password)) return res.status(400).json({error: 'galat password'});
        const payload={
            id: user.id
        }
        const token=generateJwtToken(payload);
        res.status(200).json({response: user, token: token});
    }

    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'server error ho gaya' });
    }
})

// get profile details
router.get('/profile', jwtAuthMiddleware , async (req, res) => {

    try {
        // console.log(req.body);
        const userpayload=req.userpayload;
        const user= await User.findById(userpayload.id);
        res.status(200).json({response: user});
    }

    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'server error ho gaya' });
    }
})

// password update
router.put('/profile/password', jwtAuthMiddleware , async (req, res) => {

    try {
       const userid=req.userpayload.id;
       const {oldpassword, newpassword}=req.body;
       if(!oldpassword || !newpassword) return res.status(400).json({error: 'dondo password daal'});
       const user= await User.findById(userid);
    //    console.log(user);
       if(!user || !await user.comparePassword(oldpassword)) return res.status(400).json({error: 'Password sahi nnhi h'});
       user.password=newpassword;
       await user.save();
       console.log('password update ho gaya');
       res.status(200).json({message: 'passowrd update ho gaya'});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'server error ho gaya' });
    }
})



module.exports=router;