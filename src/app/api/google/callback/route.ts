import { getGoogleToken } from "@/lib/google";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import { type NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { getGoogleAccountDetails } from "@/lib/google-apis";

export const GET = async (req: NextRequest) => {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
console.log(userId)
  const params = req.nextUrl.searchParams;

  const code = params.get("code");
  const token = await getGoogleToken(code as string);
  if (!token)
    return NextResponse.json(
      { error: "Failed to fetch token" },
      { status: 400 }
    );
  const accountDetails = await getGoogleAccountDetails(token.access_token);
  if(!accountDetails) {
    console.log("No account details")
    return;
  }
  console.log(accountDetails)
  const dbAccount = await db.account.findFirst({
    where: {
      providerId: accountDetails.providerId.toString(),
      userId,
    },
  });
  if (dbAccount) {
    await db.account.update({
      where: { id: dbAccount.id },
      data: {
        providerName: "Google",
        accessToken: token.access_token.toString(),
      },
    });
  } else {
    await db.account.create({
      data: {
        providerId: accountDetails.providerId.toString(),
        userId: userId,
        email: accountDetails.email,
        name: accountDetails.name,
        providerName: "Google",
        accessToken: token.access_token.toString(),
      },
    });
  }
  axios
    .post(`${process.env.NEXT_PUBLIC_URL}/api/initial-sync-google`, {
      accountId: dbAccount?.id,
      userId,
    })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err.response.data);
    });

  return NextResponse.redirect(new URL("/mail", req.url));
};
