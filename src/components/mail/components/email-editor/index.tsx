"use client";
import GhostExtension from "./extension";
import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import TipTapMenuBar from "./menu-bar";
import Text from "@tiptap/extension-text";
import { Button } from "@/components/ui/button";

import { generate } from "./actions";
import { readStreamableValue } from "ai/rsc";
import { Separator } from "@/components/ui/separator";
import useThreads from "@/hooks/use-threads";
import { api } from "@/trpc/react";
import { Input } from "@/components/ui/input";
import TagInput from "./tag-input";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useLocalStorage } from "usehooks-ts";
import { Bot } from "lucide-react";
import AIComposeButton from "./ai-compose-button";
import { FaSpinner } from "react-icons/fa";
import {
  extensions,
  RichTextEditorDemo,
} from "@/components/tiptap/rich-text-editor";

type EmailEditorProps = {
  toValues: { label: string; value: string }[];
  ccValues: { label: string; value: string }[];

  subject: string;
  setSubject: (subject: string) => void;
  to: string[];
  handleSend: (value: string) => void;
  isSending: boolean;

  onToChange: (values: { label: string; value: string }[]) => void;
  onCcChange: (values: { label: string; value: string }[]) => void;

  defaultToolbarExpand?: boolean;
};

const EmailEditor = ({
  toValues,
  ccValues,
  subject,
  setSubject,
  to,
  handleSend,
  isSending,
  onToChange,
  onCcChange,
  defaultToolbarExpand,
}: EmailEditorProps) => {
  const [ref] = useAutoAnimate();
  const [accountId] = useLocalStorage("accountId", "");
  const { data: suggestions } = api.account.getEmailSuggestions.useQuery(
    { accountId: accountId, query: "" },
    { enabled: !!accountId },
  );

  const [expanded, setExpanded] = React.useState(defaultToolbarExpand ?? false);

  const [generation, setGeneration] = React.useState("");

  const aiGenerate = async (prompt: string) => {
    const { output } = await generate(prompt);

    for await (const delta of readStreamableValue(output)) {
      if (delta) {
        setGeneration(delta);
      }
    }
  };

  const customText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "Meta-a-i": () => {
          aiGenerate(this.editor.getText());
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    autofocus: false,
    extensions: [...extensions, customText, GhostExtension],
    editorProps: {
      attributes: {
        placeholder: "Write your email here...",
      },
    },
    onUpdate: ({ editor, transaction }) => {
      setValue(editor.getHTML());
    },
  });

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Enter" &&
        editor &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          document.activeElement?.tagName || "",
        )
      ) {
        editor.commands.focus();
      }
      if (event.key === "Escape" && editor) {
        editor.commands.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor]);

  React.useEffect(() => {
    if (!generation || !editor) return;
    editor.commands.insertContent(generation);
  }, [generation, editor]);

  const [value, setValue] = React.useState("");

  return (
    <div className="hide-scrollbar max-h-[300px] overflow-y-auto">
      {/* <div className="flex border-b p-4 py-2">
        {editor && <TipTapMenuBar editor={editor} />}
      </div> */}

      <div className="prose w-full px-4">
        <RichTextEditorDemo
          className="w-full rounded-xl"
          value={value}
          editor={editor}
          expanded={expanded}
          setExpanded={setExpanded}
          defaultToolbarExpand={defaultToolbarExpand}
          setGeneration={setGeneration}
          to={to}
          ref={ref}
          onToChange={onToChange}
          toValues={toValues}
          ccValues={ccValues}
          onCcChange={onCcChange}
          subject={subject}
          setSubject={setSubject}
          suggestions={suggestions}
        />
        {/* <EditorContent
          value={value}
          editor={editor}
          placeholder="Write your email here..."
        /> */}
      </div>
      <Separator />
      <div className="sticky bottom-0 bg-background">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm">
            Tip: Press{" "}
            <kbd className="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800">
              Cmd + J
            </kbd>{" "}
            for AI autocomplete
          </span>
          <Button
            onClick={async () => {
              editor?.commands.clearContent();
              await handleSend(value);
            }}
          >
            {isSending ? <FaSpinner className="animate-spin" /> : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailEditor;
