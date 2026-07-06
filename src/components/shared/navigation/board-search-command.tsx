"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
import { getNavigationSearchGroups } from "@/config/navigation-items"
import { emitOnboardingEvent, onboardingEvents } from "@/lib/onboarding-events"

type BoardSearchCommandProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const navigationSearchGroups = getNavigationSearchGroups()

export function BoardSearchCommand({
  open,
  onOpenChange,
}: BoardSearchCommandProps) {
  const router = useRouter()

  useEffect(() => {
    if (open) {
      emitOnboardingEvent(onboardingEvents.searchOpened)
    }
  }, [open])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "k" || !(event.metaKey || event.ctrlKey)) {
        return
      }

      event.preventDefault()
      onOpenChange(true)
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onOpenChange])

  function handleNavigate(url: string) {
    onOpenChange(false)
    router.push(url)
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Recherche"
      description="Rechercher une page"
    >
      <Command>
        <CommandInput placeholder="Rechercher une page…" />
        <CommandList>
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
          {navigationSearchGroups.map((group) => (
            <CommandGroup key={group.heading} heading={group.heading}>
              {group.items.map((item) => {
                const Icon = item.icon

                return (
                  <CommandItem
                    key={item.moduleCode}
                    value={`${item.title} ${item.url} ${item.moduleCode}`}
                    onSelect={() => handleNavigate(item.url)}
                  >
                    <Icon />
                    {item.title}
                    <CommandShortcut>↵</CommandShortcut>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
