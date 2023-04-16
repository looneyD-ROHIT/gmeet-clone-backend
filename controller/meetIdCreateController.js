import prismaClient from '../config/prismaConfig.js';
import { nanoid } from 'nanoid';

export const meetIdCreatePOSTController = async (req, res) => {
    const id = req.body.id;

    if(!id){
        return res.status(422).json({'success': false, 'message': 'provide valid user id'});
    }

    try{
    // check user id from database
        const data = await prismaClient.users.findUnique({
            where: {
                userId: id
            },
        })
        console.log('meetid: ' + JSON.stringify(data));
        if(data){
            // user exists --> generate a new meetid and store in database
            const meetid = nanoid(12);
            console.log(meetid);
            const meetIdStore = await prismaClient.meetData.create({
                data: {
                    meetCode: meetid,
                    meetAdmin: id
                },
            })
            console.log(meetIdStore);
            const meetMapStore = await prismaClient.userMeetMap.create({
                data: {
                    mappedUserId: id,
                    mappedMeetId: meetIdStore.meetId
                }
            })
            console.log(meetMapStore);
            return res.status(201).json({'success': true, 'message': `${meetid}`})
        }else{
            // user does not exists
            return res.status(404).json({'success': false, 'message': `User not found`})
        }

    }catch(err){
        console.error('meetid: ' + err);
        return res.status(500).json({'success': false, 'message': 'unknown server error'})
    }
}