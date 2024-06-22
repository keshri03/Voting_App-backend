const jwt=require('jsonwebtoken');


// authorisation middleware
const jwtAuthMiddleware=(req,res,next)=>{
        // console.log('call to hua h');
        const authorizationSection=req.headers.authorization;
        if(!authorizationSection) res.status(401).json({error: "Token not found"});
        const token=req.headers.authorization.split(' ')[1];
        // console.log(token);
        if(!token) res.status(401).json({error: 'Unauthorized'});
    try{
        // console.log('yaha aaya');
        const payload=jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.userpayload=payload; // middlware userpayload naam ke kie kr andar user ka payload bhejta h
        next();
    }
    catch(err){
        console.log(err);
        res.status(401).json({error: 'Invalid token'})
    }
}

const generateJwtToken=(userdata)=>{
    return jwt.sign(userdata, process.env.JWT_SECRET_KEY); // expires in 30 sec {expiresIn: 3000} agar man ho ye daalne ka
}

module.exports={generateJwtToken , jwtAuthMiddleware};