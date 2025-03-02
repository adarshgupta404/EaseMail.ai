"use client";

import { mails } from "@/components/mail/data";
import { type Mail } from "@/components/mail/data";
import dynamic from "next/dynamic";

const MailPage = dynamic(() => import("@/components/mail/components/mail"), {
  ssr: false,
});

interface MailProps {
  mails: Mail[];
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export default function Mail({
  mails,
  defaultLayout = [20, 32, 48],
  defaultCollapsed = false,
  navCollapsedSize,
}: MailProps) {
  return (
    <MailPage
      mails={mails}
      defaultLayout={defaultLayout}
      defaultCollapsed={defaultCollapsed}
      navCollapsedSize={4}
    />
  );
}
