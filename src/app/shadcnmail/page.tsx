"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getAccessToken,
  getAccounts,
  getGoogleAccountDetails,
  getLatestEmails,
  getLatestEmailsById,
} from "@/lib/google-apis";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EmailsPage() {
  const [emails, setEmails] = useState<
    { subject: string; from: string; date: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<
    {
      id: string;
      userId: string;
      email: string;
      name: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const accessToken = await getAccessToken();
        if (!accessToken) {
          setError("Failed to load emails.");
          return;
        }
        await getGoogleAccountDetails(accessToken);
        const data = await getLatestEmails(accessToken);
        setEmails(data);
        const accounts = await getAccounts();
        setAccounts(accounts); // Ensure accounts is always an array
        setError(null);
      } catch (err) {
        setError("Failed to load emails.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);
  const handleClick = async (accountId: string) => {
    try {
      setLoading(true);
      setEmails([]);
      const emails = await getLatestEmailsById(accountId);
      setEmails(emails);
    } catch (error) {
      toast.error("Failed to fetch emails");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Latest 5 Emails</h1>
      <Button onClick={() => signIn("google")}>Add Account +</Button>
      <Button onClick={() => signIn("zoho")}>Add Zoho Account +</Button>
      {error && <p className="text-red-500">{error}</p>}
      {/* Render Accounts List */}
      <h2 className="mb-4 mt-6 text-xl font-bold">Connected Accounts</h2>
      <Card>
        <ul className="space-y-4">
          {accounts.map((account) => (
            <li
              onClick={async () => {
                await handleClick(account.id);
              }}
              key={account.id}
              className="cursor-pointer rounded-lg p-4 shadow"
            >
              <p>
                <strong>Name:</strong> {account.name}
              </p>
              <p>
                <strong>Email:</strong> {account.email}
              </p>
            </li>
          ))}
        </ul>
      </Card>
      <br />
      {loading && <p>Loading emails...</p>}
      <Card>
        <ul className="space-y-4">
          {emails.map((email, index) => (
            <li key={index} className="rounded-lg p-4 shadow">
              <p>
                <strong>Subject:</strong> {email.subject}
              </p>
              <p>
                <strong>From:</strong> {email.from}
              </p>
              <p>
                <strong>Date:</strong> {email.date}
              </p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
