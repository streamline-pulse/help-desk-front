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
import { IconUsers } from "@tabler/icons-react"

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
      title="Search"
      description="Search employees and pages"
    >
      <Command>
        <CommandInput placeholder="Search employees, departments..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            <CommandItem
              value="employees employee management"
              onSelect={() => {
                onOpenChange(false)
                router.push(routes.board.employees)
              }}
            >
              <IconUsers />
              Employee Management
              <CommandShortcut>↵</CommandShortcut>
            </CommandItem>
            <CommandItem
              value="board home"
              onSelect={() => {
                onOpenChange(false)
                router.push(routes.board.root)
              }}
            >
              Board
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Employees">
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
