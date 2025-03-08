"use client";

import * as React from "react";
import { Fa500Px, FaGoogle } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { useLocalStorage } from "usehooks-ts";
import { ChevronDown, Plus, Users } from "lucide-react";
import { getGoogleAuthorizationUrl } from "@/lib/google";
import { RiRobot2Line } from "react-icons/ri";

interface AccountSwitcherProps {
  isCollapsed: boolean;
}

export function AccountSwitcher({ isCollapsed }: AccountSwitcherProps) {
  const { data, isLoading } = api.account.getAccounts.useQuery();
  const [accountId, setAccountId] = useLocalStorage("accountId", "");
  if (isLoading && !isCollapsed)
    return (
      <div className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-muted-foreground [&>span]:line-clamp-1">
        <div className="flex items-center gap-2">
          <span className="h-6 w-6 animate-pulse rounded-full bg-muted"></span>
          <span className="h-4 w-28 animate-pulse rounded-full bg-muted pl-4"></span>
        </div>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </div>
    );

  return (
    <Select defaultValue={accountId} onValueChange={setAccountId}>
      <SelectTrigger
        className={cn(
          "flex cursor-pointer items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
          isCollapsed &&
            "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden",
        )}
        aria-label="Select account"
      >
        <SelectValue placeholder="Select an account">
          {data?.find(
            (account) =>
              account.id === accountId && account.email?.includes("@gmail.com"),
          ) ? (
            <FaGoogle />
          ) : (
            <RiRobot2Line />
          )}

          <span className={cn("ml-2", isCollapsed && "hidden")}>
            {data?.find((account) => account.id === accountId)?.name}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {data?.map((account) => (
          <SelectItem
            className="cursor-pointer"
            key={account.id}
            value={account.id}
          >
            <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
              {account.email.endsWith("@gmail.com") && <FaGoogle />}
              {account.email}
            </div>
          </SelectItem>
        ))}
        <div
          onClick={async () => {
            const authUrl = await getGoogleAuthorizationUrl();
            console.log(authUrl);
            window.location.href = authUrl;
          }}
          className="focus:bg-primar relative flex w-full cursor-pointer items-center gap-3 rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-muted focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
        >
          <Plus className="mr-1 size-4" />
          Add account
        </div>
      </SelectContent>
    </Select>
  );
}
