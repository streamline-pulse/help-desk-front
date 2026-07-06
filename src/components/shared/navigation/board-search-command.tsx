"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { employees } from "@/app/(board)/board/employees/_components/employee-mock-data"
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
import { routes } from "@/config/routes"
import { emitOnboardingEvent, onboardingEvents } from "@/lib/onboarding-events"
import { IconLayoutDashboard, IconUsers } from "@tabler/icons-react"

type BoardSearchCommandProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

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

  function handleSelectEmployee() {
    onOpenChange(false)
    router.push(routes.board.employees)
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Recherche"
      description="Rechercher une page ou un employé"
    >
      <Command>
        <CommandInput placeholder="Rechercher une page ou un employé…" />
        <CommandList>
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem
              value="employees employee management"
              onSelect={() => {
                onOpenChange(false)
                router.push(routes.board.employees)
              }}
            >
              <IconUsers />
              Gestion des employés
              <CommandShortcut>↵</CommandShortcut>
            </CommandItem>
            <CommandItem
              value="board home"
              onSelect={() => {
                onOpenChange(false)
                router.push(routes.board.root)
              }}
            >
              <IconLayoutDashboard />
              Vue d’ensemble
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Employés">
            {employees.map((employee) => (
              <CommandItem
                key={employee.id}
                value={`${employee.id} ${employee.firstName} ${employee.lastName} ${employee.department} ${employee.email}`}
                onSelect={handleSelectEmployee}
              >
                <IconUsers />
                <span>
                  {employee.firstName} {employee.lastName}
                </span>
                <span className="text-muted-foreground">{employee.id}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
