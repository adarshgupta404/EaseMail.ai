"use client";

import { Inbox, Send, File, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLocalStorage } from "usehooks-ts";
import { api } from "@/trpc/react";
import React from "react";

interface NavProps {
  isCollapsed: boolean;
}

type Variant = "default" | "ghost";

interface Link {
  title: string;
  label: string;
  icon: LucideIcon;
  variant: Variant;
}

export default function Nav({ isCollapsed }: NavProps) {
  // Move tab state above links array
  const [accountId] = useLocalStorage("accountId", "");
  const [tab, setTab] = useLocalStorage("easemail-tab", "inbox");

  // Fetch data
  const { data: inboxThreads, isLoading: inboxLoading } =
    api.account.getNumThreads.useQuery({
      accountId,
      tab: "inbox",
    });

  const { data: draftThreads, isLoading: draftLoading } =
    api.account.getNumThreads.useQuery({
      accountId,
      tab: "drafts",
    });

  const { data: sentThreads, isLoading: sentLoading } =
    api.account.getNumThreads.useQuery({
      accountId,
      tab: "sent",
    });
    console.log(tab)
  // Move links array here after fetching data
  const links: Link[] = [
    {
      title: "Inbox",
      label: inboxThreads?.toString() ?? "0",
      icon: Inbox,
      variant: tab === "inbox" ? "default" : "ghost",
    },
    {
      title: "Drafts",
      label: draftThreads?.toString() ?? "0",
      icon: File,
      variant: tab === "drafts" ? "default" : "ghost",
    },
    {
      title: "Sent",
      label: sentThreads?.toString() ?? "0",
      icon: Send,
      variant: tab === "sent" ? "default" : "ghost",
    },
  ];

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <span
                  onClick={() => setTab(link.title.toLowerCase())}
                  className={cn(
                    buttonVariants({ variant: link.variant, size: "icon" }),
                    "h-9 w-9 cursor-pointer",
                    link.variant === "default" &&
                      "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only">{link.title}</span>
                </span>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                <span className="ml-auto text-muted-foreground">
                  {link.label}
                </span>
              </TooltipContent>
            </Tooltip>
          ) : (
            <span
              key={index}
              onClick={() => setTab(link.title.toLowerCase())}
              className={cn(
                buttonVariants({ variant: link.variant, size: "sm" }),
                link.variant === "default" &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "cursor-pointer justify-start",
              )}
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.title}
              {link.label && (
                <span
                  className={cn(
                    "ml-auto",
                    link.variant === "default" &&
                      "text-background dark:text-white",
                  )}
                >
                  {link.label}
                </span>
              )}
            </span>
          ),
        )}
      </nav>
    </div>
  );
}
