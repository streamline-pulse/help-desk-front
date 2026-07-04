import type { TablerIcon } from "@tabler/icons-react"

type PageHeaderProps = {
  label: string
  title: string
  description: string
  icon?: TablerIcon
}

export function PageHeader({
  label,
  title,
  description,
  icon: Icon,
}: PageHeaderProps) {
  return (
    <header className="px-6 pt-10 pb-8">
      <div className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
        {Icon ? <Icon className="size-3" stroke={1.75} /> : null}
        <span>{label}</span>
      </div>
      <h1 className="text-3xl leading-tight font-semibold text-balance text-foreground">
        {title}
      </h1>
      <p className="mt-1 max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground">
        {description}
      </p>
    </header>
  )
}
