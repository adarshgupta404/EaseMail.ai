"use client";

import "./tiptap.css";
import { cn } from "@/lib/utils";
import { ImageExtension } from "@/components/tiptap/extensions/image";
import { ImagePlaceholder } from "@/components/tiptap/extensions/image-placeholder";
import SearchAndReplace from "@/components/tiptap/extensions/search-and-replace";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TipTapFloatingMenu } from "@/components/tiptap/extensions/floating-menu";
import { FloatingToolbar } from "@/components/tiptap/extensions/floating-toolbar";
import { EditorToolbar } from "./toolbars/editor-toolbar";
import Placeholder from "@tiptap/extension-placeholder";
import { content } from "@/lib/content";
import React from "react";
import TagInput from "../mail/components/email-editor/tag-input";
import { Input } from "../ui/input";
import AIComposeButton from "../mail/components/email-editor/ai-compose-button";

export const extensions = [
  StarterKit.configure({
    orderedList: { HTMLAttributes: { class: "list-decimal" } },
    bulletList: { HTMLAttributes: { class: "list-disc" } },
    heading: { levels: [1, 2, 3, 4] },
  }),
  Placeholder.configure({
    emptyNodeClass: "is-editor-empty",
    placeholder: ({ node }) => {
      switch (node.type.name) {
        case "heading":
          return `Heading ${node.attrs.level}`;
        case "detailsSummary":
          return "Section title";
        case "codeBlock":
          return "";
        default:
          return "Write, type '/' for commands";
      }
    },
    includeChildren: false,
  }),
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  TextStyle,
  Subscript,
  Superscript,
  Underline,
  Link,
  Color,
  Highlight.configure({ multicolor: true }),
  ImageExtension,
  ImagePlaceholder,
  SearchAndReplace,
  Typography,
];

// Define props type
type EmailEditorProps = {
  ref:any;
  className?: string;
  value: string;
  editor: any;
  expanded: any;
  setExpanded: any;
  setGeneration: any;
  suggestions: any;
  toValues: { label: string; value: string }[];
  ccValues: { label: string; value: string }[];
  subject: string;
  setSubject: (subject: string) => void;
  to: string[];
  onToChange: (values: { label: string; value: string }[]) => void;
  onCcChange: (values: { label: string; value: string }[]) => void;
  defaultToolbarExpand?: boolean;
};

export function RichTextEditorDemo({
  ref,
  className,
  value,
  editor,
  expanded,
  setExpanded,
  defaultToolbarExpand,
  setGeneration,
  to,
  onToChange,
  toValues,
  ccValues,
  onCcChange,
  subject,
  setSubject,
  suggestions,
}: EmailEditorProps) {
  return (
    <>
      <EditorToolbar editor={editor} />
      <FloatingToolbar editor={editor} />
      <TipTapFloatingMenu editor={editor} />
      <div className={`space-y-2 p-4 pb-0 ${className}`}>
        {expanded && (
          <>
            <TagInput
              suggestions={suggestions?.map((s:any) => s.address) || []}
              value={toValues}
              placeholder="Add tags"
              label="To"
              onChange={onToChange}
            />
            <TagInput
              suggestions={suggestions?.map((s:any) => s.address) || []}
              value={ccValues}
              placeholder="Add tags"
              label="Cc"
              onChange={onCcChange}
            />
            <Input
              id="subject"
              className="w-full"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </>
        )}
        <div className="flex items-center gap-2">
          <div className="cursor-pointer" onClick={() => setExpanded((e:any) => !e)}>
            <span className="font-medium text-green-600">Draft </span>
            <span>to {to?.join(", ")}</span>
          </div>
          <AIComposeButton
            isComposing={defaultToolbarExpand}
            onGenerate={setGeneration}
          />
        </div>
      </div>
      <EditorContent
        editor={editor}
        className="min-h-[600px] w-full min-w-full cursor-text"
      />
    </>
  );
}
