import { getGoogleAccountDetails } from "@/lib/google-apis";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { waitUntil } from "@vercel/functions";
import axios from "axios";
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
      if (account && account.provider === "google" && profile?.email) {
        const { userId } = await auth();
        if (!userId) {
          throw new Error("Login to clerk!");
        }

        // const data = await getGoogleAccountDetails(
        //   account.access_token as string,
        // );
        // if (!data) {
        //   console.log("No data found");
        //   return false;
        // }

        // Check if user already exists
        let user = await db.user.findUnique({
          where: { id: userId },
        });

        // Ensure the userId is correct
        if (!user?.id) {
          console.log("User creation failed");
          return false;
        }

        const dbAccount = await db.account.findFirst({
          where: {
            providerId: account.providerAccountId,
            userId,
          },
        });
        let acc;
        if (dbAccount) {
          acc = await db.account.update({
            where: { id: dbAccount.id },
            data: {
              providerName: "Google",
              accessToken: account.access_token,
            },
          });
        } else {
          acc = await db.account.create({
            data: {
              providerId: account.providerAccountId,
              userId: userId,
              email: profile.email,
              name: profile.name || "Unknown",
              providerName: "Google",
              accessToken: account.access_token!,
            },
          });
        }

        axios
        .post(`${process.env.NEXT_PUBLIC_URL}/api/initial-sync-google`, {
          accountId: acc.id,
          userId,
        })
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err.response.data);
        })
        // waitUntil(
        //   axios
        //     .post(`${process.env.NEXT_PUBLIC_URL}/api/initial-sync-google`, {
        //       accountId: acc.id,
        //       userId,
        //     })
        //     .then((res) => {
        //       console.log(res.data);
        //     })
        //     .catch((err) => {
        //       console.log(err.response.data);
        //     }),
        // );
        return true;
      }
      return false;
    },
  },
});

export { handler as GET, handler as POST };
