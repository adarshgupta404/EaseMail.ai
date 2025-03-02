"use client";

import { useState, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fonts } from "./font";

export default function FontSelector() {
  const [storedFont, setStoredFont] = useLocalStorage("selectedFont", fonts[0]);
  const [selectedFont, setSelectedFont] = useState<null | (typeof fonts)[0]>(
    null,
  );

  useEffect(() => {
    if (storedFont) setSelectedFont(storedFont); // Set font only on the client
  }, [storedFont]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex w-full items-center justify-end"
        asChild
      >
        <Button variant="outline" className="ml-auto max-w-44 justify-between">
          <span>{selectedFont?.name || "Helvetica"}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full min-w-[240px]">
        <DropdownMenuGroup>
          {fonts.map((font) => (
            <DropdownMenuItem
              key={font.name}
              onSelect={() => setStoredFont(font)}
              className="flex items-center justify-between"
            >
              <span style={{ fontFamily: font.value }}>{font.name}</span>
              {selectedFont?.name === font.name && (
                <Check className="ml-2 h-4 w-4" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
