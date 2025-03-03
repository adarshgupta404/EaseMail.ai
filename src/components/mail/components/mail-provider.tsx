"use client";

import { mails } from "@/components/mail/data";
import { type Mail } from "@/components/mail/data";
import dynamic from "next/dynamic";
import KBar from "./kbar";

const MailPage = dynamic(() => import("@/components/mail/components/mail"), {
  ssr: false,
});

interface MailProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export default function Mail({
  defaultLayout = [20, 32, 48],
  defaultCollapsed = false,
  navCollapsedSize,
}: MailProps) {
  return (
    <KBar>
      <MailPage
        defaultLayout={defaultLayout}
        defaultCollapsed={defaultCollapsed}
        navCollapsedSize={4}
      />
    </KBar>
  );
}
