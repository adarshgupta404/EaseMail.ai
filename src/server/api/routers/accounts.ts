import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { db } from "@/server/db";
import { Prisma } from "@prisma/client";
import { threadId } from "worker_threads";

export const authorizeAccountAccess = async (
  accountId: string,
  userId: string,
) => {
  const account = await db.account.findFirst({
    where: {
      id: accountId,
      userId: userId,
    },
    select: {
      id: true,
      email: true,
      accessToken: true,
    },
  });
  if (!account) throw new Error("Account not found!");
  return account;
};

export const accountRouter = createTRPCRouter({
  getAccounts: privateProcedure.query(async ({ ctx }) => {
    return await ctx.db.account.findMany({
      where: {
        userId: ctx.auth.userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }),

  getNumThreads: privateProcedure
    .input(
      z.object({
        accountId: z.string(),
        tab: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const account = await authorizeAccountAccess(
        input.accountId,
        ctx.auth.userId,
      );

      let filter: Prisma.ThreadWhereInput = {};
      if (input.tab === "inbox") {
        filter.inboxStatus = true;
      } else if (input.tab === "draft") {
        filter.draftStatus = true;
      } else if (input.tab === "sent") {
        filter.sentStatus = true;
      }

      filter.accountId = input.accountId;

      return await ctx.db.thread.count({
        where: filter,
      });
    }),

  getThreads: privateProcedure
    .input(
      z.object({
        accountId: z.string(),
        tab: z.string(),
        done: z.boolean(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const account = await authorizeAccountAccess(
        input.accountId,
        ctx.auth.userId,
      );

      let filter: Prisma.ThreadWhereInput = {};
      if (input.tab === "inbox") {
        filter.inboxStatus = true;
      } else if (input.tab === "draft") {
        filter.draftStatus = true;
      } else if (input.tab === "sent") {
        filter.sentStatus = true;
      }

      filter.accountId = input.accountId;

      filter.done = {
        equals: input.done,
      };

      return await ctx.db.thread.findMany({
        where: filter,
        include: {
          emails: {
            orderBy: {
              sentAt: "asc",
            },
            select: {
              from: true,
              body: true,
              bodySnippet: true,
              subject: true,
              sysLabels: true,
              id: true,
              sentAt: true,
            },
          },
        },
        take: 10,
        orderBy: {
          lastMessageDate: "desc",
        },
      });
    }),

  getThreadById: privateProcedure
    .input(
      z.object({
        accountId: z.string(),
        threadId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const account = await authorizeAccountAccess(
        input.accountId,
        ctx.auth.userId,
      );

      return await ctx.db.thread.findUnique({
        where: {
          id: input.threadId,
        },
        include: {
          emails: {
            orderBy: {
              sentAt: "asc",
            },
            select: {
              from: true,
              body: true,
              subject: true,
              bodySnippet: true,
              emailLabel: true,
              sysLabels: true,
              id: true,
              sentAt: true,
            },
          },
        },
      });
    }),

  setDone: privateProcedure
    .input(
      z.object({
        threadId: z.string().optional(),
        threadIds: z.array(z.string()).optional(),
        accountId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.threadId && !input.threadIds)
        throw new Error("No threadId or threadIds provided");
      const account = await authorizeAccountAccess(
        input.accountId,
        ctx.auth.userId,
      );
      if (!account) throw new Error("Invalid token");
      if (input.threadId) {
        await ctx.db.thread.update({
          where: {
            id: input.threadId,
          },
          data: {
            done: true,
          },
        });
      }
      if (input.threadIds) {
        await ctx.db.thread.updateMany({
          where: {
            id: {
              in: input.threadIds,
            },
          },
          data: {
            done: true,
          },
        });
      }
    }),

  setUndone: privateProcedure
    .input(
      z.object({
        threadId: z.string().optional(),
        threadIds: z.array(z.string()).optional(),
        accountId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const account = await authorizeAccountAccess(
        input.accountId,
        ctx.auth.userId,
      );
      if (!account) throw new Error("Invalid token");
      if (input.threadId) {
        await ctx.db.thread.update({
          where: {
            id: input.threadId,
          },
          data: {
            done: false,
          },
        });
      }
      if (input.threadIds) {
        await ctx.db.thread.updateMany({
          where: {
            id: {
              in: input.threadIds,
            },
          },
          data: {
            done: false,
          },
        });
      }
    }),
});
