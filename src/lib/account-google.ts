import { google } from "googleapis";
import type { EmailMessage, SyncResponse, SyncUpdatedResponse } from "@/lib/types";

class Account {
  private oauth2Client: any;
  private MAX_EMAILS = 2;

  constructor(accessToken: string) {
    this.oauth2Client = new google.auth.OAuth2();
    this.oauth2Client.setCredentials({ access_token: accessToken });
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
        return {
          id: email.data.id,
          snippet: email.data.snippet,
          payload: email.data.payload,
        };
      })
    );

    return {
      records: emails,
      nextDeltaToken: response.data.nextPageToken || "",
      nextPageToken: response.data.nextPageToken || "",
    };
  }

  async performInitialSync() {
    try {
      const daysWithin = 3;
      let syncResponse = await this.startSync(daysWithin);
  
      while (!syncResponse.ready) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        syncResponse = await this.startSync(daysWithin);
      }
  
      let storedDeltaToken: string = syncResponse.syncUpdatedToken;
      let updatedResponse = await this.getUpdatedEmails({
        deltaToken: syncResponse.syncUpdatedToken,
      });
  
      let allEmails: EmailMessage[] = updatedResponse.records || [];
  
      while (updatedResponse.nextPageToken && allEmails.length < this.MAX_EMAILS) {
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
  
}

export default Account;
