"use client"

import type React from "react"
import { useState } from "react"
import { Avatar } from "@/components/ui/avatar"
import { AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { X, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

export type TagOption = {
  label: string
  value: string
}

type TagInputProps = {
  suggestions: string[]
  defaultValues?: TagOption[]
  placeholder?: string
  label: string
  onChange: (values: TagOption[]) => void
  value: TagOption[]
  className?: string
}

const TagInput: React.FC<TagInputProps> = ({
  suggestions,
  defaultValues = [],
  placeholder = "Select or type...",
  label,
  onChange,
  value,
  className,
}) => {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")

  // Create options from suggestions
  const options = suggestions.map((suggestion) => ({
    label: suggestion,
    value: suggestion,
  }))

  // Add custom input as an option if it doesn't exist in suggestions
  const allOptions =
    inputValue && !options.some((option) => option.label.toLowerCase() === inputValue.toLowerCase())
      ? [...options, { label: inputValue, value: inputValue }]
      : options

  const handleSelect = (selectedValue: string) => {
    const option = { label: selectedValue, value: selectedValue }

    // Check if already selected
    if (!value.some((item) => item.value === selectedValue)) {
      onChange([...value, option])
    }

    setInputValue("")
  }

  const handleRemove = (tagToRemove: TagOption) => {
    onChange(value.filter((tag) => tag.value !== tagToRemove.value))
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className={cn(" flex items-center gap-4 w-full rounded-md  max-h-20 overflow-auto border border-input bg-background p-0.5 focus-within:ring-1 focus-within:ring-ring", className)}>
      <Label htmlFor={`tag-input-${label}`} className="text-sm pl-2 font-medium">
        {label}{" : "}
      </Label>

      <div className="">
        <div className="flex flex-wrap gap-1 p-0.5 px-1">
          {value.map((tag) => (
            <Badge key={tag.value} variant="secondary" className="flex items-center gap-1 px-2 py-1 text-xs">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">{getInitials(tag.label)}</AvatarFallback>
              </Avatar>
              <span>{tag.label}</span>
              <button
                type="button"
                onClick={() => handleRemove(tag)}
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                <span className="sr-only">Remove {tag.label}</span>
              </button>
            </Badge>
          ))}

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                id={`tag-input-${label}`}
                role="combobox"
                aria-expanded={open}
                className={cn(
                  "flex items-center min-h-8 px-2 py-1 text-sm outline-none focus:outline-none",
                  !value.length && "w-full",
                )}
              >
                {!value.length && !inputValue && <span className="text-muted-foreground">{placeholder}</span>}
                {!open && <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-0" align="start">
              <Command>
                <CommandInput placeholder={placeholder} value={inputValue} onValueChange={setInputValue} />
                <CommandList>
                  <CommandEmpty>{inputValue ? `Add "${inputValue}"` : "No results found"}</CommandEmpty>
                  <CommandGroup>
                    {allOptions.map((option) => (
                      <CommandItem key={option.value} value={option.value} onSelect={handleSelect}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">{getInitials(option.label)}</AvatarFallback>
                          </Avatar>
                          <span>{option.label}</span>
                        </div>
                        {value.some((item) => item.value === option.value) && (
                          <Check className="ml-auto h-4 w-4 text-primary" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}

export default TagInput

