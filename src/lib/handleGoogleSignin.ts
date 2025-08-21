"use server"

import { signIn, signOut } from "@/auth";

export const handleGoogleSignIn = async () => {
    try {
        await signIn("google", {redirectTo: "/"});
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const handleCommonSignOut = async () => {
    try {
        await signOut({redirectTo: "/"});
    } catch (error) {
        console.error(error);
        throw error;
    }
}