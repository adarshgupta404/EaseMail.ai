"use client";
import TurndownService from "turndown";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import React from "react";
import { generateEmail } from "./actions";
import { readStreamableValue } from "ai/rsc";
import { Bot } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useThreads from "@/hooks/use-threads";
import { turndown } from "@/lib/turndown";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  onGenerate: (value: string) => void;
  isComposing?: boolean;
};

const AIComposeButton = (props: Props) => {
  const [prompt, setPrompt] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const { account, threads, threadId } = useThreads();
  const thread = threads?.find((t) => t.id === threadId);
  const aiGenerate = async (prompt: string) => {
    let context: string | undefined = "";
    if (!props.isComposing) {
      context = thread?.emails
        .map(
          (m) =>
            `Subject: ${m.subject}\nFrom: ${m.from.address}\n\n${turndown.turndown(m.body ?? m.bodySnippet ?? "")}`,
        )
        .join("\n");
    }

    const { output } = await generateEmail(
      context + `\n\nMy name is: ${account?.name}`,
      prompt,
    );

    for await (const delta of readStreamableValue(output)) {
      if (delta) {
        props.onGenerate(delta);
      }
    }
  };
  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="rounded-lg  bg-secondary p-[6px]">
          <Bot className="size-5" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Compose</DialogTitle>
            <DialogDescription>
              AI will compose an email based on the context of your previous
              emails.
            </DialogDescription>
            <div className="h-2"></div>
            <Textarea
              placeholder="What would you like to compose?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="h-2"></div>
            <Button
              onClick={() => {
                aiGenerate(prompt);
                setOpen(false);
                setPrompt("");
              }}
            >
              Generate
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default AIComposeButton;
