type AuthFormHeaderProps = {
  title: string
  description?: string
}

export function AuthFormHeader({ title, description }: AuthFormHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-heading text-2xl font-semibold text-balance">{title}</h1>
      {description ? (
        <p className="text-sm text-pretty text-muted-foreground">{description}</p>
      ) : null}
    </div>
  )
}
