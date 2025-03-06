"use client";

import * as React from "react";
import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  MessagesSquare,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AccountSwitcher } from "@/components/mail/components/account-switcher";
import MailDisplay from "@/components/mail/components/mail-display";
import { MailList } from "@/components/mail/components/mail-list";
import { type Mail } from "@/components/mail/data";
import { useMail } from "@/components/mail/use-mail";
import { useLocalStorage } from "usehooks-ts";
import FontSelector from "./font-selector";
import { fonts } from "./font";
import dynamic from "next/dynamic";
import useThreads from "@/hooks/use-threads";
import SearchBar from "./search-bar";
import { api, type RouterOutputs } from "@/trpc/react";

const Nav = dynamic(() => import("@/components/mail/components/nav"), {
  ssr: false,
});

interface MailProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export default function MailPage({
  defaultLayout = [20, 32, 48],
  defaultCollapsed = false,
  navCollapsedSize,
}: MailProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [tab] = useLocalStorage("easemail-tab", "inbox");
  const [storedFont, setStoredFont] = useLocalStorage("selectedFont", fonts[0]);
  const [selectedFont, setSelectedFont] = React.useState<
    null | (typeof fonts)[0]
  >(null);
  const [accountId] = useLocalStorage("accountId", "");

  const { mutate, isPending } = api.account.syncEmails.useMutation();
  
  React.useEffect(() => {
    if (!accountId) return; // Prevent execution if accountId is empty
  
    const interval = setInterval(() => {
      if (!isPending) { // Avoid duplicate calls while a request is still ongoing
        mutate({ accountId });
      }
    }, 80000);
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, [accountId, isPending]); // Re-run only when accountId or isLoading changes
  

  React.useEffect(() => {
    if (storedFont) setSelectedFont(storedFont);
  }, [storedFont]);
  return (
    <main style={{ fontFamily: selectedFont?.value || fonts[0]?.value }}>
      <TooltipProvider delayDuration={0}>
        <ResizablePanelGroup
          direction="horizontal"
          onLayout={(sizes: number[]) => {
            document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
              sizes,
            )}`;
          }}
          className="h-full max-h-[800px] items-stretch"
        >
          <ResizablePanel
            defaultSize={defaultLayout[0]}
            collapsedSize={navCollapsedSize}
            collapsible={true}
            minSize={15}
            maxSize={20}
            onCollapse={() => {
              setIsCollapsed(true);
              document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                true,
              )}`;
            }}
            onResize={() => {
              setIsCollapsed(false);
              document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                false,
              )}`;
            }}
            className={cn(
              isCollapsed &&
                "min-w-[50px] transition-all duration-300 ease-in-out",
            )}
          >
            <div
              className={cn(
                "flex h-[52px] items-center justify-center",
                isCollapsed ? "h-[52px]" : "px-2",
              )}
            >
              <AccountSwitcher isCollapsed={isCollapsed} />
            </div>
            <Separator />
            <Nav isCollapsed={isCollapsed} />
            <Separator />
            {/* <Nav
              isCollapsed={isCollapsed}
              links={[
                {
                  title: "Social",
                  label: "972",
                  icon: Users2,
                  variant: "ghost",
                },
                {
                  title: "Updates",
                  label: "342",
                  icon: AlertCircle,
                  variant: "ghost",
                },
                {
                  title: "Forums",
                  label: "128",
                  icon: MessagesSquare,
                  variant: "ghost",
                },
                {
                  title: "Shopping",
                  label: "8",
                  icon: ShoppingCart,
                  variant: "ghost",
                },
                {
                  title: "Promotions",
                  label: "21",
                  icon: Archive,
                  variant: "ghost",
                },
              ]}
            /> */}
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
            <Tabs defaultValue="all">
              <div className="font flex items-center px-4 py-2">
                <h1 className="text-xl font-bold">Inbox</h1>
                <div className="flex w-full items-center gap-4">
                  <FontSelector />
                  <TabsList className="">
                    <TabsTrigger
                      value="all"
                      className="text-zinc-600 dark:text-zinc-200"
                    >
                      All mail
                    </TabsTrigger>
                    <TabsTrigger
                      value="unread"
                      className="text-zinc-600 dark:text-zinc-200"
                    >
                      Unread
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>
              <Separator />
              <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <form>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search" className="pl-8" />
                  </div>
                </form>
              </div>
              {/* <SearchBar/> */}
              <TabsContent value="all" className="m-0">
                <MailList />
              </TabsContent>
              <TabsContent value="unread" className="m-0">
                <MailList />
              </TabsContent>
            </Tabs>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
            <MailDisplay />
          </ResizablePanel>
        </ResizablePanelGroup>
      </TooltipProvider>
    </main>
  );
}
