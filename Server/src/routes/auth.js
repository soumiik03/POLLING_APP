import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../db/schema.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    //Jodi Username ba email exist kore then return korbe
    const isUserAlreadyexists=await User.findOne({
        $or:[
            {username},
            {email}
        ]
    })

    if(isUserAlreadyexists){
        return res.status(409).json({
            message:"User already exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //User Created
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
       
    })

    const token = jwt.sign({
        id:user._id,
        
    },process.env.JWT_SECRET,{ expiresIn: '7d' }) 

    res.cookie('token', token)

    res.status(201).json({
        message:"User created successfully",
        token,
    User:{
            id:user._id,
            username:user.username,
            email:user.email,
            
        }
    })
})

router.post('/login', async (req, res) => {
    const { username,email, password } = req.body;
    const user = await User.findOne({
        $or:[
            {username},
            {email}
        ]
    })
    
    if(!user){
        return res.status(401).json({
            message:"Invalid credentials"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        return res.status(401).json({
            message:"Invalid credentials"
        })
    }
     
    const token = jwt.sign({
        id:user._id,
        
    },process.env.JWT_SECRET,{ expiresIn: '7d' })

    res.cookie('token', token)

    res.status(200).json({
        message:"Login successful",
        token,
    User:{
            id:user._id,   
            username:user.username,
            email:user.email,
            
        }
    })

})

export default router;    
