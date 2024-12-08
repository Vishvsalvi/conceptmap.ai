"use server"

import { signIn } from "@/auth";

export const handleGithubSignIn = async () => {
    try {
        await signIn("github", {redirectTo: "/"});
    } catch (error) {
        console.error(error);
        throw error;
    }
}