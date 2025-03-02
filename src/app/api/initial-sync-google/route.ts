import Account from "@/lib/account-google";
import { syncEmailsToDatabase } from "@/lib/sync-to-db";
import { db } from "@/server/db";
import { type NextRequest, NextResponse } from "next/server";

// export const maxDuration = 300;

export const POST = async (req: NextRequest) => {
  try {
    console.log("Start Syncing....")
    const body = await req.json();
    const { accountId, userId } = body;
    if (!accountId || !userId) {
      return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
    }

    const dbAccount = await db.account.findUnique({
      where: {
        id: accountId,
        userId,
      },
    });

    if (!dbAccount) {
      return NextResponse.json({ error: "ACCOUNT_NOT_FOUND" }, { status: 404 });
    }

    const account = new Account(dbAccount.accessToken);
    // await account.createSubscription(); // Uncomment if needed

    const response = await account.performInitialSync();
    if (!response) {
      return NextResponse.json({ error: "FAILED_TO_SYNC" }, { status: 500 });
    }

    const { deltaToken, emails } = response;

    console.log("Sync Emails: ", emails?.length || 0);
    // Uncomment when database saving is needed
    await syncEmailsToDatabase(emails, accountId);

    await db.account.update({
      where: {
        id: dbAccount.id,
      },
      data: {
        nextDeltaToken: deltaToken,
      },
    });

    console.log("Sync complete, deltaToken:", deltaToken);

    return NextResponse.json({ success: true, deltaToken }, { status: 200 });
  } catch (error) {
    console.error("Error in POST /sync-email:", error);
    return NextResponse.json(
      { error: "INTERNAL_SERVER_ERROR" },
      { status: 500 },
    );
  }
};
