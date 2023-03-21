import express from "express";
import bcrypt from "bcrypt";
import prismaClient from "../config/prismaConfig";


const router = express.Router();
const saltrounds = 12
router.get("/", (req, res) => {
  res.send(`<h1>This is register page!!! baby</h1>`);
});
router
    .route("/")
    .get((req, res) => {
        res.sendStatus(200);
    })
    .post((req,res)=>{
        const email = req.body.email
        const password = req.body.password
        bcrypt.hash(password, saltrounds, async (err, hash)=>{
            if(err){
                console.log(err)
            }
            else{
                try{
                    await prismaClient.users.create({
                        data: {
                          email: email,
                          password: hash
                        },
                    })
                }catch(err){
                    console.log('err while registering: ',err);
                }
            }
        })
    })

export default router;
