"use server";

import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";

export const getLatestEmails = async (accessToken: string) => {
  try {
    const listResponse = await axios.get(
      "https://www.googleapis.com/gmail/v1/users/me/messages",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { maxResults: 5, labelIds: "INBOX" },
      },
    );

    const messages = listResponse.data.messages || [];

    const emailDetails = await Promise.all(
      messages.map(async (msg: { id: string }) => {
        const msgResponse = await axios.get(
          `https://www.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );

        const payload = msgResponse.data.payload;
        const headers = payload.headers;

        return {
          subject:
            headers.find((h: any) => h.name === "Subject")?.value ||
            "No Subject",
          from:
            headers.find((h: any) => h.name === "From")?.value ||
            "Unknown Sender",
          date:
            headers.find((h: any) => h.name === "Date")?.value ||
            "Unknown Date",
        };
      }),
    );

    return emailDetails;
  } catch (error) {
    console.error("Error fetching latest emails:", error);
    return [];
  }
};

export const getGoogleAccountDetails = async (accessToken: string) => {
  try {
    const response = await axios.get(
      "https://people.googleapis.com/v1/people/me?personFields=emailAddresses,names",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const data = response.data;

    return {
      email: data.emailAddresses?.[0]?.value || "",
      firstName: data.names?.[0]?.givenName || "",
      lastName: data.names?.[0]?.familyName || "",
      profilePic: data.photos?.[0]?.url || "",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching Google account details:",
        error.response?.data,
      );
    } else {
      console.error("Unexpected error fetching Google account details:", error);
    }
    return;
  }
};

export async function getAccessToken() {
  const { userId } = await auth();

  if (!userId) return null;

  const user = await db.user.findUnique({ where: { id: userId } });

  if (!user) return null;

  const account = await db.account.findUnique({
    where: { email: user?.emailAddress },
    select: { accessToken: true },
  });

  return account?.accessToken;
}

export async function getAccounts() {
  const { userId } = await auth();
  if (!userId) return [];
  const accounts = await db.account.findMany({
    where: { userId: userId },
    select: {
      id: true,
      userId: true,
      email: true,
      name: true,
    },
  });

  if (!accounts) return [];
  return accounts;
}

export const getLatestEmailsById = async (accountId: string) => {
  const {userId} = await auth();
  if(!userId) return [];
  const accounts = await db.account.findUnique({
    where: { id:accountId, userId: userId }
  });

  if (!accounts) return [];
  try {
    const listResponse = await axios.get(
      "https://www.googleapis.com/gmail/v1/users/me/messages",
      {
        headers: { Authorization: `Bearer ${accounts.accessToken}` },
        params: { maxResults: 5, labelIds: "INBOX" },
      },
    );

    const messages = listResponse.data.messages || [];

    const emailDetails = await Promise.all(
      messages.map(async (msg: { id: string }) => {
        const msgResponse = await axios.get(
          `https://www.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
          {
            headers: { Authorization: `Bearer ${accounts.accessToken}` },
          },
        );

        const payload = msgResponse.data.payload;
        const headers = payload.headers;

        return {
          subject:
            headers.find((h: any) => h.name === "Subject")?.value ||
            "No Subject",
          from:
            headers.find((h: any) => h.name === "From")?.value ||
            "Unknown Sender",
          date:
            headers.find((h: any) => h.name === "Date")?.value ||
            "Unknown Date",
        };
      }),
    );

    return emailDetails;
  } catch (error) {
    console.error("Error fetching latest emails:", error);
    return [];
  }
};