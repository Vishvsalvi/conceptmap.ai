"use server"

import { auth } from "@/auth"

export const isAuthenticated = async () => {
    const session = await auth();
    if(session){
        return true;
    }
    return false;
}