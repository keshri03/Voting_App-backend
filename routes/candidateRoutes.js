const express = require('express');
const User = require('../models/user');
const router = express.Router();
const { generateJwtToken, jwtAuthMiddleware } = require('./../jwt');
const Candidate = require('../models/candidate');


const checkAdmin=async(userId)=>{
    try{
        console.log(userId);
        const user= await User.findById(userId);
        // console.log(user);
        if(user.role==='admin') return true;
        return false;
        
    }
    catch(err){
        return false;
    }
}

//get all candiadtes
router.get('/', async (req, res) => {

    try {
       const allCandidates=await Candidate.find({},'name party age -_id') // id chhod kar sab dikhao;
       res.status(200).json({allCandidates});      
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'server error ho gaya' });
    }
})

//register candisdates
router.post('/', jwtAuthMiddleware, async (req, res) => {

    try {
        const userid=req.userpayload.id;
        // console.log(userid);
        if(!await checkAdmin(userid)) return res.status(400).json({error: 'admin nhi ho tm'});
        const data=req.body;
        const newCandidate= new Candidate(data);
        const response=await newCandidate.save();
        console.log('ho gaya neta register');
        res.status(200).json({response: 'neta saved'});
    }

    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'server error ho gaya' });
    }
})

//updating candidate details
router.put('/:candidateID', jwtAuthMiddleware, async (req, res) => {

    try {
        const userid = req.userpayload.id;
        // console.log(userid);
        if (!await checkAdmin(userid)) return res.status(400).json({ error: 'admin nhi ho tm' });
        const candidateID = req.params.candidateID;
        const response= await User.findByIdAndUpdate(candidateID,req.body,{
            new: true,
            runValidators: true
        })
        if(!response) return res.status(400).json({error: 'candiadate nhi mila'});
        console.log('candidate update ho gaya');
        res.status(200).json(response);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'server error ho gaya' });
    }
})

//deleting a candidate
router.delete('/:candidateID', jwtAuthMiddleware, async (req, res) => {

    try {
        const userid = req.userpayload.id;
        // console.log(userid);
        if (!await checkAdmin(userid)) return res.status(400).json({ error: 'admin nhi ho tm' });
        const candidateID = req.params.candidateID;
        const response = await Candidate.findByIdAndDelete(candidateID)
        if (!response) return res.status(400).json({ error: 'candiadate nhi mila' });
        console.log('candidate delete ho gaya');
        res.status(200).json({response: 'candidate hat gaya'});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'server error ho gaya' });
    }
})


// Ab voting karenge
// giving vote
router.post('/vote/:candidateID', jwtAuthMiddleware, async (req, res) => {

    const candidateID=req.params.candidateID;
    const userid=req.userpayload.id;
    try {
       const candidate= await Candidate.findById(candidateID);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate nhi h' });
        }
        const user=await User.findById(userid);
        if (!user) return res.status(404).json({ message: 'user nhi mila' });
        if (user.isVoted) return res.status(404).json({ message: 'Dobara vote kaise kr skte bhai' });
        if (user.role == 'admin') return res.status(404).json({ message: 'admin vote nhi kar skta' });
        candidate.votes.push({user:userid});
        candidate.voteCount++;
        user.isVoted=true;
        await user.save();
        await candidate.save();
        res.status(200).json({message: "waah bhai vote daal die"});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'server error ho gaya' });
    }
})
// displaying all votes
router.get('/vote/count', async (req, res) => {

    try {
        const candidates=await Candidate.find().sort({voteCount: 'desc'});
        const voteRecord= candidates.map((data)=>{
            return {
                name: data.name,
                party: data.party,
                count: data.voteCount
            }
        }) 
        res.status(200).json(voteRecord);      
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'server error ho gaya' });
    }
})












module.exports=router;

