import { getAccountDetails, getAurinkoToken } from "@/lib/aurinko";
// import { waitUntil } from '@vercel/functions'
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import { type NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";

export const config = {
  maxDuration: 59,
};

export const GET = async (req: NextRequest) => {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const params = req.nextUrl.searchParams;
  const status = params.get("status");
  if (status !== "success")
    return NextResponse.json(
      { error: "Accoadunt connection failed" },
      { status: 400 },
    );

  const code = params.get("code");
  const token = await getAurinkoToken(code as string);
  if (!token)
    return NextResponse.json(
      { error: "Failed to fetch token" },
      { status: 400 },
    );
  const accountDetails = await getAccountDetails(token.accessToken);
  const dbAccount = await db.account.findFirst({
    where: {
      providerId: accountDetails.authUserId.toString(),
      userId,
    },
  });
  if (dbAccount) {
    await db.account.update({
      where: { id: dbAccount.id },
      data: {
        providerName: "Aurinko",
        accessToken: token.accessToken.toString(),
      },
    });
  } else {
    await db.account.create({
      data: {
        providerId: accountDetails.authUserId.toString(),
        userId: userId,
        email: accountDetails.email,
        name: accountDetails.name,
        providerName: "Aurinko",
        accessToken: token.accessToken.toString(),
      },
    });
  }

  waitUntil(
    axios
      .post(`${process.env.NEXT_PUBLIC_URL}/api/initial-sync-aurinko`, {
        accountId: accountDetails.authUserId.toString(),
        userId,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      }),
  );

  return NextResponse.redirect(new URL("/mail", req.url));
};
