"use server"
import { auth } from "@clerk/nextjs/server";
import axios from "axios";

export const getGoogleAuthorizationUrl = async () => {
    const { userId } = await auth();
    if (!userId) throw new Error("User not found");
  
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID as string,
      redirect_uri: `${process.env.NEXT_PUBLIC_URL}/api/google/callback`,
      response_type: "code",
      scope: "openid email profile https://www.googleapis.com/auth/userinfo.profile https://mail.google.com/",
      access_type: "offline",
      prompt: "consent",
    });
  
    return `https://accounts.google.com/o/oauth2/auth?${params.toString()}`;
  };
  
  export const getGoogleToken = async (code: string) => {
    try {
      const response = await axios.post(
        "https://oauth2.googleapis.com/token",
        new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID as string,
          client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
          code,
          grant_type: "authorization_code",
          redirect_uri: `${process.env.NEXT_PUBLIC_URL}/api/google/callback`,
        }).toString(),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );
  
      return response.data as {
        access_token: string;
        refresh_token: string;
        expires_in: number;
        scope: string;
        token_type: string;
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error fetching Google token:", error.response?.data);
      } else {
        console.error("Unexpected error fetching Google token:", error);
      }
    }
  };
  