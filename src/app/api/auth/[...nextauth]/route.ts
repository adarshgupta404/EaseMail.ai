import { getGoogleAccountDetails } from "@/lib/google";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }

  interface JWT {
    accessToken?: string;
  }
}

if (
  !process.env.GOOGLE_CLIENT_ID ||
  !process.env.GOOGLE_CLIENT_SECRET ||
  !process.env.NEXTAUTH_SECRET
) {
  throw new Error("Missing required environment variables.");
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/gmail.readonly",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        const { userId } = await auth();
        if (!userId) {
          throw new Error("Login to clerk!");
        }
        const data = await getGoogleAccountDetails(
          account.access_token as string,
        );
        if (!data) {
          console.log("No data found");
          return false;
        }

        // Check if user already exists
        let user = await db.user.findUnique({
          where: { id: userId },
        });

        // Ensure the userId is correct
        if (!user?.id) {
          console.log("User creation failed");
          return false;
        }

        // Now use user.id instead of auth().userId
        await db.account.upsert({
          where: { email: data.email },
          update: {
            accessToken: account.access_token,
          },
          create: {
            userId: userId,
            email: data.email,
            name: data.firstName,
            accessToken: account.access_token!,
          },
        });
        return true;
      }
      return false;
    },
  },
});

export { handler as GET, handler as POST };
