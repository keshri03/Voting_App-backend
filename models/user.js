const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String
    },
    mobile: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    aadhaarNumber: {
        type: Number,
        required: true,
        unqiue: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter'
    },
    isVoted: {
        type: Boolean,
        default: false
    }
});

//middleware to encry before saving
userSchema.pre('save',async function (next){
    const user=this;
    if(!user.isModified('password')) return next();
    try{
        const salt= await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(user.password,salt);
        user.password=hashedPassword;
        next();
    }
    catch(err){
        return next(err);
    }
})

userSchema.methods.comparePassword=async function(userPassword){
    try{
        const isSame=bcrypt.compare(userPassword,this.password);
        return isSame;
    }
    catch(err){
        throw err;
    }
}


const User = new mongoose.model('User', userSchema);
module.exports = User;