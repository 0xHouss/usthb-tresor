"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Option {
  value: string
  label: string
}

interface CreatableComboboxProps {
  options: Option[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  selectMessage?: string
  className?: string
}

export function CreatableCombobox({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search options...",
  emptyMessage = "No option found.",
  selectMessage = "Select",
  className,
}: CreatableComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  // Find if the current value exists in options or is a custom value
  const selectedOption = options.find((option) => option.value === value)
  const displayValue = selectedOption ? selectedOption.label : value

  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(inputValue.toLowerCase()))

  const exactMatch = filteredOptions.find((option) => option.label.toLowerCase() === inputValue.toLowerCase())

  const showSelectCustom = inputValue.length > 0 && !exactMatch

  const handleSelectCustom = () => {
    if (inputValue.trim()) {
      onValueChange?.(inputValue.trim())
      setInputValue("")
      setOpen(false)
    }
  }

  const handleSelect = (selectedValue: string) => {
    onValueChange?.(selectedValue === value ? "" : selectedValue)
    setOpen(false)
    setInputValue("")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {displayValue || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder={searchPlaceholder} value={inputValue} onValueChange={setInputValue} />
          <CommandList>
            {filteredOptions.length === 0 && !showSelectCustom && <CommandEmpty>{emptyMessage}</CommandEmpty>}

            {filteredOptions.length > 0 && (
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem key={option.value} value={option.value} onSelect={handleSelect}>
                    <Check className={cn("mr-2 h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {showSelectCustom && (
              <CommandGroup>
                <CommandItem onSelect={handleSelectCustom} className="text-muted-foreground">
                  <Plus className="mr-2 h-4 w-4" />
                  {selectMessage} "{inputValue}"
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
