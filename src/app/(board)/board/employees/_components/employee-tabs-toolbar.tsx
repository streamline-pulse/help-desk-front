import {
  IconAdjustmentsHorizontal,
  IconArrowsSort,
  IconFilter,
  IconLayoutGrid,
  IconPlus,
  IconSearch,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const tabs = ["Employees", "Departments", "Positions", "Payroll"] as const

const toolbarIcons = [
  { icon: IconArrowsSort, label: "Sort" },
  { icon: IconFilter, label: "Filter" },
  { icon: IconLayoutGrid, label: "Group" },
  { icon: IconSearch, label: "Search" },
  { icon: IconAdjustmentsHorizontal, label: "Settings" },
] as const

export function EmployeeTabsToolbar() {
  return (
    <div className="flex items-center justify-between gap-4 px-6 pb-3">
      <Tabs defaultValue="Employees" className="min-w-0 flex-1 gap-0">
        <TabsList
          variant="line"
          className="h-auto w-full justify-start gap-0 rounded-none bg-transparent p-0"
        >
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="h-8 rounded-none px-3 text-[13px] font-medium text-neutral-500 after:bg-neutral-900 data-active:text-neutral-900"
            >
              {tab}
            </TabsTrigger>
          ))}
          <Button
            variant="ghost"
            size="icon-sm"
            className="ml-0.5 size-7 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
            aria-label="Add view"
          >
            <IconPlus className="size-3.5" />
          </Button>
        </TabsList>
      </Tabs>

      <div className="flex shrink-0 items-center gap-0.5">
        {toolbarIcons.map(({ icon: Icon, label }) => (
          <Button
            key={label}
            variant="ghost"
            size="icon-sm"
            className="size-7 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
            aria-label={label}
          >
            <Icon className="size-4" stroke={1.75} />
          </Button>
        ))}
        <Button
          size="sm"
          className="ml-1.5 h-7 gap-1 rounded-md bg-neutral-900 px-2.5 text-[13px] font-medium text-white hover:bg-neutral-800"
        >
          Add
          <IconPlus className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}
