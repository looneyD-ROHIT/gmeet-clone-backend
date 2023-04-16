import prismaClient from "../config/prismaConfig.js";

export const meetIdCheckPOSTController = async (req, res) => {
    const meetcode = req.body.meetcode;
    if(!meetcode){
        return res.status(422).json({'success': false, 'message': 'No meet id found'});
    }
    // check existence of meetid if meetdata table
    try{
        const data = await prismaClient.meetData.findUnique({
            where: {
                meetCode: meetcode
            },
        })
        console.log('data from meetidcheck: ' + JSON.stringify(data));
        if(data?.meetCode){
            return res.status(201).json({'success': true, 'message': `${data.meetCode}`})
        }else{
            return res.status(201).json({'success': false, 'message': `No meet id found`})
        }
    }catch(err){
        console.error('meetidcheck: ' + err);
        return res.status(500).json({'success': false, 'message': 'unknown server error'})
    }
}