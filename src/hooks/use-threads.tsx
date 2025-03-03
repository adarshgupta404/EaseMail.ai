import { api } from "@/trpc/react";
import { getQueryKey } from "@trpc/react-query";
import { atom, useAtom } from "jotai";
import React from "react";
import { useLocalStorage } from "usehooks-ts";

export const threadIdAtom = atom<string | null>(null);

const useThreads = () => {
  const { data: accounts } = api.account.getAccounts.useQuery();
  const [accountId] = useLocalStorage("accountId", "");
  const [tab] = useLocalStorage("easemail-tab", "inbox");
  const [done] = useLocalStorage("easemail-done", false);
  // const [threadId, setThreadId] = useAtom(threadIdAtom);
  const [threadId, setThreadId] = useLocalStorage("threadId", "");
  const queryKey = getQueryKey(api.account.getThreads, { accountId, tab, done }, 'query')
  const {
    data: threads,
    isFetching,
    refetch,
  } = api.account.getThreads.useQuery(
    {
      accountId,
      tab,
      done,
    },
    {
      enabled: !!accountId && !!tab,
      placeholderData: (e) => e,
      refetchInterval: 5000,
    },
  );
  return {
    threads,
    isFetching,
    refetch,
    queryKey,
    threadId,
    setThreadId,
    account: accounts?.find((e) => e.id === accountId),
  };
};

export default useThreads;
