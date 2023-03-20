import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient()
// console.log(new PrismaClient())
try{
    const prisma = new PrismaClient()
}catch(err){
    console.log(err)
}

// async function main() {


    
//     await prisma.Users.create({
//         data: {
//             email: 'abc@abc.com',
//             password: 'abc',
//         }
//     })
    
//     await prisma.MeetData.create({
//         data: {
//             meetCode: 'www',
//             meetTranscript: null,
//         }
//     })

//     const allUsers = await prisma.Users.findMany()
//     console.log(allUsers)
//   }

//   main();