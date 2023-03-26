import bcrypt from 'bcrypt';
import prismaClient from "../config/prismaConfig.js";

export const registerGETController = (req, res) => {
    res.status(200).send(`<h1>Register Page...</h1>`)
}

export const registerPOSTController = (req, res) => {
    const email = req.body.email
    const password = req.body.password
    /**
     * TODO 
     * Apply more validation to email and password field, either on frontend or backend.
     */
    if(!email || !password){
        res.status(400);
        return res.json({'success': false, 'message': 'email and password both are required!'});
    } 
    
    bcrypt.hash(password, 10000, async (err, hash)=>{
        if(err){
            console.log(err);
            return res.status(500).json({'success': false, 'message': 'server error hashing the password!'})
        }
        else{
            try{
                const response = await prismaClient.users.create({
                    data: {
                        email: email,
                        password: Buffer.from(hash)
                    },
                })
                console.log(response);
                return res.status(201).json({'success': true, 'message': 'user registered successfully!'})
            }catch(err){
                console.log('err while registering: ',err);
                return res.status(505).json({'success': false, 'message': 'server error registering user'})
            }
        }
    })
}