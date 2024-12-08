"use server"
import prisma from "../db";

export const registerUser = async(email:string) => {
   try {
     const user = await prisma.user.create({
         data: {
             email,
         }
     })
     return user;
   } catch (error) {
       console.log(error);
       return null;
   }
    
}

export const getUser = async(email:string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })
        return user;
    } catch (error) {
        console.log(error);
        return null;
    }
}