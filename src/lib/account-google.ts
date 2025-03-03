import { google } from "googleapis";
import type {
  EmailAddress,
  EmailMessage,
  SyncResponse,
  SyncUpdatedResponse,
} from "@/lib/types";
import { syncEmailsToDatabase } from "./sync-to-db";
import { db } from "@/server/db";
import axios from "axios";

class Account {
  private oauth2Client: any;
  private MAX_EMAILS = 3;
  private daysWithin = 3;
  private accessToken = "";

  constructor(accessToken: string) {
    this.oauth2Client = new google.auth.OAuth2();
    this.oauth2Client.setCredentials({ access_token: accessToken });
    this.accessToken = accessToken;
  }

  private async startSync(daysWithin: number): Promise<any> {
    const gmail = google.gmail({ version: "v1", auth: this.oauth2Client });

    // Fetch messages from the last `daysWithin` days
    const query = `newer_than:${daysWithin}d`;

    const response = await gmail.users.messages.list({
      userId: "me",
      q: query, // Filter emails by date
    });

    return {
      ready: true,
      syncUpdatedToken: response.data.nextPageToken || "", // Simulating delta token
    };
  }

  async getUpdatedEmails({
    deltaToken,
    pageToken,
  }: {
    deltaToken?: string;
    pageToken?: string;
  }): Promise<any> {
    const gmail = google.gmail({ version: "v1", auth: this.oauth2Client });

    let params: Record<string, string> = {};
    if (deltaToken) {
      params.deltaToken = deltaToken;
    }
    if (pageToken) {
      params.pageToken = pageToken;
    }

    const response = await gmail.users.messages.list({
      userId: "me",
      pageToken,
    });

    const emails = await Promise.all(
      (response.data.messages || []).map(async (msg) => {
        const email = await gmail.users.messages.get({
          userId: "me",
          id: msg.id!,
        });
        const headers = email.data.payload?.headers || [];

        const getHeaderValue = (name: string) =>
          headers.find((h) => h.name === name)?.value ?? "";
        const parseEmailAddress = (headerValue: string): EmailAddress => {
          const match = headerValue.match(/^(.*?)[\s]*<(.+?)>$/);
          return match
            ? { name: match[1]?.trim() || "", address: match[2]?.trim() || "" }
            : { address: headerValue.trim() };
        };

        // Update the `from` field

        // Function to extract body content
        const extractBody = (payload: any): string => {
          if (!payload) return "";

          if (payload.mimeType === "text/html" && payload.body?.data) {
            return Buffer.from(payload.body.data, "base64").toString("utf-8"); // Decode HTML
          }

          if (payload.parts?.length) {
            for (const part of payload.parts) {
              if (part.mimeType === "text/html" && part.body?.data) {
                return Buffer.from(part.body.data, "base64").toString("utf-8"); // Decode HTML part
              }
            }
          }

          return "";
        };

        return {
          id: email.data.id,
          threadId: email.data.threadId,
          createdTime: email.data.internalDate
            ? new Date(parseInt(email.data.internalDate)).toISOString()
            : null,
          receivedAt: email.data.internalDate
            ? new Date(parseInt(email.data.internalDate)).toISOString()
            : null,
          lastModifiedTime: email.data.historyId,
          sentAt: new Date(getHeaderValue("Date")).toISOString(),
          internetMessageId: getHeaderValue("Message-ID"),
          subject: getHeaderValue("Subject"),
          sysLabels:
            email.data.labelIds?.map((ele: string) => {
              return ele.toLowerCase();
            }) || [],
          keywords: [],
          sysClassifications: [],
          sensitivity: "normal",
          from: parseEmailAddress(getHeaderValue("From")),
          to: getHeaderValue("To")
            .split(", ")
            .map((addr) => ({ address: addr.trim() })),
          cc: getHeaderValue("Cc")
            .split(", ")
            .map((addr) => ({ address: addr.trim() })),
          bcc: getHeaderValue("Bcc")
            .split(", ")
            .map((addr) => ({ address: addr.trim() })),
          replyTo: getHeaderValue("Reply-To")
            .split(", ")
            .map(parseEmailAddress),
          hasAttachments:
            email.data.payload?.parts?.some((p) => p.filename) || false,
          body: extractBody(email.data.payload), // Get the decoded HTML body
          bodySnippet: email.data.snippet,
          attachments:
            email.data.payload?.parts
              ?.filter((p) => p.filename)
              .map((part) => ({
                id: part.body?.attachmentId,
                name: part.filename,
                mimeType: part.mimeType,
                size: part.body?.size || 0,
                inline:
                  part.headers?.some(
                    (h) =>
                      h.name === "Content-Disposition" &&
                      h?.value?.includes("inline"),
                  ) || false,
              })) || [],
          inReplyTo: getHeaderValue("In-Reply-To"),
          references: getHeaderValue("References"),
          threadIndex: "",
          internetHeaders: headers,
          nativeProperties: {},
          folderId: "",
          omitted: [],
        };
      }),
    );

    //  const emails = await Promise.all(
    //   (response.data.messages || []).map(async (msg) => {
    //     const email = await gmail.users.messages.get({
    //       userId: "me",
    //       id: msg.id!,
    //     });
    //     return {
    //       id: email.data.id,
    //       snippet: email.data.snippet,
    //       payload: email.data.payload,
    //     };
    //   })
    // );

    return {
      records: emails,
      nextDeltaToken: response.data.nextPageToken || "",
      nextPageToken: response.data.nextPageToken || "",
    };
  }

  async performInitialSync() {
    try {
      let syncResponse = await this.startSync(this.daysWithin);

      while (!syncResponse.ready) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        syncResponse = await this.startSync(this.daysWithin);
      }

      let storedDeltaToken: string = syncResponse.syncUpdatedToken;
      let updatedResponse = await this.getUpdatedEmails({
        deltaToken: syncResponse.syncUpdatedToken,
      });

      let allEmails: EmailMessage[] = updatedResponse.records || [];

      while (
        updatedResponse.nextPageToken &&
        allEmails.length < this.MAX_EMAILS
      ) {
        updatedResponse = await this.getUpdatedEmails({
          pageToken: updatedResponse.nextPageToken,
        });
        allEmails = allEmails.concat(updatedResponse.records || []);

        if (updatedResponse.nextDeltaToken) {
          storedDeltaToken = updatedResponse.nextDeltaToken;
        }
      }

      // Trim to max 10 emails
      allEmails = allEmails.slice(0, this.MAX_EMAILS);

      return {
        emails: allEmails,
        deltaToken: storedDeltaToken,
      };
    } catch (error) {
      console.error("Error during sync:", error);
    }
  }

  async syncEmails() {
    const account = await db.account.findUnique({
      where: {
        accessToken: this.accessToken,
      },
    });
    if (!account) throw new Error("Invalid token");
    if (!account.nextDeltaToken) throw new Error("No delta token");
    let response = await this.getUpdatedEmails({
      deltaToken: account.nextDeltaToken,
    });
    let allEmails: EmailMessage[] = response.records;
    let storedDeltaToken = account.nextDeltaToken;
    if (response.nextDeltaToken) {
      storedDeltaToken = response.nextDeltaToken;
    }
    while (response.nextPageToken) {
      response = await this.getUpdatedEmails({
        pageToken: response.nextPageToken,
      });
      allEmails = allEmails.concat(response.records);
      if (response.nextDeltaToken) {
        storedDeltaToken = response.nextDeltaToken;
      }
    }

    if (!response) throw new Error("Failed to sync emails");

    try {
      await syncEmailsToDatabase(allEmails, account.id);
    } catch (error) {
      console.log("error", error);
    }

    // console.log('syncEmails', response)
    await db.account.update({
      where: {
        id: account.id,
      },
      data: {
        nextDeltaToken: storedDeltaToken,
      },
    });
  }

  async sendEmail({
    from,
    subject,
    body,
    inReplyTo,
    references,
    threadId,
    to,
    cc,
    bcc,
    replyTo,
  }: {
    from: EmailAddress;
    subject: string;
    body: string;
    inReplyTo?: string;
    references?: string;
    threadId?: string;
    to: EmailAddress[];
    cc?: EmailAddress[];
    bcc?: EmailAddress[];
    replyTo?: EmailAddress;
  }) {
    try {
      const headers = [
        `From: ${from.name ? `${from.name} <${from.address}>` : from.address}`,
        `To: ${to.map((t) => t.address).join(", ")}`,
        subject ? `Subject: ${subject}` : "",
        cc && cc.length ? `Cc: ${cc.map((c) => c.address).join(", ")}` : "",
        bcc && bcc.length ? `Bcc: ${bcc.map((b) => b.address).join(", ")}` : "",
        replyTo ? `Reply-To: ${replyTo.address}` : "",
        inReplyTo ? `In-Reply-To: ${inReplyTo}` : "",
        references ? `References: ${references}` : "",
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=UTF-8",
      ]
        .filter(Boolean)
        .join("\r\n");

      const rawEmail = `${headers}\r\n\r\n${body}`;
      const encodedMessage = Buffer.from(rawEmail).toString("base64url"); // Encode in base64 URL format

      const response = await axios.post(
        `https://www.googleapis.com/gmail/v1/users/me/messages/send`,
        { raw: encodedMessage },
        {
          headers: { Authorization: `Bearer ${this.accessToken}` },
        },
      );

      console.log("sendMail Response:", response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error sending email:",
          JSON.stringify(error.response?.data, null, 2),
        );
      } else {
        console.error("Error sending email:", error);
      }
      throw error;
    }
  }
}

export default Account;
