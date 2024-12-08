import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { getUser, registerUser } from "./app/actions/user";
import prisma from "./app/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return { ...token, user };
      }
      return token;
    },
    async session({ session, token }) {
      if (token && token.user) {
        return { ...session, user: token.user };
      }
      return session;
    },
    async signIn (params) {
      if(params.user.email){
        const { email } = params.user;
        const ifUserExists = await prisma.user.findUnique({
          where: {
            email
          }
        });
        if(!ifUserExists){
          await prisma.user.create({
            data: {
              email
            }
          });
          return true;
        }
      }
      return true;

    },
    // authorized: async ({auth}) => {
    //   return !!auth;
    // }

  },
});