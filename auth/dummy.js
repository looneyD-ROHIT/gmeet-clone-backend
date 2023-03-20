import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {


    await prisma.MeetData.create({
        data: {
            meet_code: 'www',
        }
    })

    await prisma.Users.create({
        data: {
            email: 'abc@abc.com',
            password: 'abc',
            meetDataList: {
                create: [
                    'www'
                ]
            }
        }
    })

    const allUsers = await prisma.Users.findMany()
    console.log(allUsers)
  }

  main();