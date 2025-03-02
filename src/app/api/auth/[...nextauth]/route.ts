import { getGoogleAccountDetails } from "@/lib/google-apis";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { waitUntil } from "@vercel/functions";
import axios from "axios";
import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import ZohoProvider from "next-auth/providers/zoho";

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
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    //   authorization: {
    //     params: {
    //       scope:
    //         "openid email profile https://www.googleapis.com/auth/gmail.all",
    //     },
    //   },
    // }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
      // authorization: {
      //   params: {
      //     scope: [
      //       "openid",
      //       "email",
      //       "profile",
      //       "offline_access",
      //       "User.Read",
      //       "Mail.Read",
      //       "Mail.Read.Shared",
      //       "Mail.ReadBasic",
      //       "Mail.ReadBasic.Shared",
      //       "Mail.ReadWrite",
      //       "Mail.ReadWrite.Shared",
      //       "Mail.Send",
      //       "Mail.Send.Shared",
      //     ].join(" "),
      //   },
      // },
    }),
    ZohoProvider({
      clientId: process.env.ZOHO_CLIENT_ID,
      clientSecret: process.env.ZOHO_CLIENT_SECRET,
      authorization:
      "https://accounts.zoho.com/oauth/v2/auth?scope=AaaServer.profile.Read,ZohoMail.accounts.READ,ZohoMail.messages.READ,ZohoMail.messages.CREATE,ZohoMail.messages.UPDATE,ZohoMail.messages.DELETE",
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
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
          });
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
      if (account && account.provider === "azure-ad") {
        console.log(account, profile)
        fetch("https://graph.microsoft.com/v1.0/me/messages", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${account?.access_token}`,
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => console.log("Data",data))
          .catch((err) => console.error("Error here", err));
        
        return true;
      }
      if (account && account.provider === "zoho") {
        console.log(account, profile)
      }
      return false;
    },
  },
});

export { handler as GET, handler as POST };
