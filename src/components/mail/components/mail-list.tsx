import React, { ComponentProps } from "react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import DOMPurify from "dompurify";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Mail } from "@/components/mail/data";
import { useMail } from "@/components/mail/use-mail";
import useThreads from "@/hooks/use-threads";
import { format, parseISO } from "date-fns";
import { useAtom } from "jotai";
import { motion } from "framer-motion";
import { useAutoAnimate } from "@formkit/auto-animate/react"
interface MailListProps {
  items: Mail[];
}

export function MailList({ items }: MailListProps) {
  const { threads, account, threadId, setThreadId } = useThreads();
  const [parent] = useAutoAnimate(/* optional config */);

  const groupedThreads = threads?.reduce(
    (acc, thread) => {
      const date = format(thread.lastMessageDate ?? new Date(), "yyyy-MM-dd");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(thread);
      return acc;
    },
    {} as Record<string, typeof threads>,
  );

  return (
    <ScrollArea className="h-[calc(100dvh-120px)]">
      <div className="flex flex-col gap-2 p-4 pt-0" ref={parent}>
        {Object.entries(groupedThreads ?? {}).map(([date, threads]) => (
          <React.Fragment key={date}>
            <div className="mt-4 text-sm font-medium text-muted-foreground first:mt-0">
              {format(new Date(date), "MMMM d, yyyy")}
            </div>
            {threads.map((thread) => (
              <button
                key={thread.id}
                className={cn(
                  "relative flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                  threadId === thread.id && "bg-muted",
                )}
                onClick={() => {
                  setThreadId(thread.id);
                }}
              >
                {threadId === thread.id && (
                  <motion.div
                    className="absolute inset-0 z-[-1] rounded-lg bg-black/10 dark:bg-white/20"
                    layoutId="thread-list-item"
                    transition={{
                      duration: 0.1,
                      ease: "easeInOut",
                    }}
                  />
                )}
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">
                        {thread.emails.at(-1)?.from.name}
                      </div>
                      {/* {!item.read && (
                        <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                      )} */}
                    </div>
                    <div
                      className={cn(
                        "ml-auto text-xs",
                        // mail.selected === item.id
                        //   ? "text-foreground"
                        //   : "text-muted-foreground",
                      )}
                    >
                      {formatDistanceToNow(
                        thread.emails.at(-1)?.sentAt ?? new Date(),
                        {
                          addSuffix: true,
                        },
                      )}
                    </div>
                  </div>
                  <div className="text-xs font-medium">{thread.subject}</div>
                </div>
                <div
                  className="line-clamp-2 text-xs text-muted-foreground"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      thread.emails.at(-1)?.bodySnippet ?? "",
                      {
                        USE_PROFILES: { html: true },
                      },
                    ),
                  }}
                />
                <div className="line-clamp-2 text-xs text-muted-foreground">
                  {/* {item.text.substring(0, 300)} */}
                </div>
                {thread.emails[0]?.sysLabels.length ? (
                  <div className="flex items-center gap-2">
                    {thread.emails.at(0)?.sysLabels.map((label) => {
                      const labelMap: Record<string, string> = {
                        category_promotions: "Promotion",
                        category_updates: "Updates",
                        category_personal: "Personal",
                        inbox: "Inbox",
                        draft: "Draft",
                        sent: "Sent",
                        unread: "Unread",
                      };

                      return (
                        <Badge
                          key={label}
                          variant={getBadgeVariantFromLabel(label)}
                        >
                          {labelMap[label] || label}
                        </Badge>
                      );
                    })}
                  </div>
                ) : null}
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  );
}

function getBadgeVariantFromLabel(
  label: string,
): ComponentProps<typeof Badge>["variant"] {
  if (["work"].includes(label.toLowerCase())) {
    return "default";
  }

  if (["personal"].includes(label.toLowerCase())) {
    return "outline";
  }

  return "secondary";
}
