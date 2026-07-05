# Core Table — Reference

## File map

```text
src/components/shared/core-table/
├── core.table.tsx          # DataTable entry
├── table.types.ts          # Props & column types
├── table.toolbar.tsx       # Search, filters, export, selection bar
├── table.detail-drawer.tsx # Detail shell
├── cells/                  # Cell components
├── filters/                # Filter controls
└── table.export.utils.ts   # CSV export (visible columns)

src/hooks/use-table-detail.ts
src/components/ui/icon-button.tsx
```

## Cell selection

| Data | Cell | Notes |
|------|------|-------|
| Plain text | `TextCell` | `variant="primary"` for main column |
| Number | `NumberCell` | Right-aligned |
| Badge / enum label | `BadgeCell` | `variant="outline"` for roles |
| Boolean / status | `BooleanCell` | `preset="active"` \| `"verified"` |
| Date | `DateCell` | `relativeUntilDays={3}` |
| Email / URL | `LinkCell` | `mailto:` when relevant |
| Phone, code | `CustomCell` | `variant="code"` for codes |
| Relation list | `RelationCell` | Multiple labels |
| Row actions | `TableActionsCell` | Via `buildRowActions` |
| Open detail | `DetailTriggerCell` | Wraps primary cell |

Empty values render `—` internally — no `EmptyCell` export.

## Column template

```tsx
{
  id: "status",
  label: "Statut",
  header: () => (
    <TableColumnHeader icon={IconToggleRight}>Statut</TableColumnHeader>
  ),
  exportValue: (row) => (row.active ? "Actif" : "Inactif"),
  cell: ({ row }) => <BooleanCell value={row.active} preset="active" />,
}
```

## Filters

Declare `filters` on `DataTable` when `capabilities.filters` is true.  
Types: `text`, `select`, `multi-select`, `boolean`, `date`, `date-range`, `number-range`, `custom`.

## Export

- Enabled via `export={{ enabled: true, filename: "..." }}`.
- Exports **visible** columns only.
- Add `exportValue` on columns without straightforward `accessorKey`.

## Bulk selection

- `selectable` enables checkboxes.
- `bulkDelete` handles delete + `DeleteConfirmationModal` flow.
- Selection bar overlays toolbar (no layout shift).

## IconButton

Use for every icon-only control in table UI:

```tsx
import { IconButton, IconButtonTooltip } from "@/components/ui/icon-button"

<IconButton tooltip="Exporter les données" variant="ghost" size="icon-sm">
  <IconDownload />
</IconButton>
```

Popover triggers: wrap with `IconButtonTooltip` + `PopoverTrigger`.

Delay: `ICON_BUTTON_TOOLTIP_DELAY` (1500ms).

Sizes: `icon-sm` (28px) default, `icon` (32px) for drawer footer (`size="md"`).

## Detail panel template

```tsx
function DetailField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}
```

Reuse cells (`BooleanCell`, `BadgeCell`, etc.) for consistent styling.

## New table checklist

- [ ] `DataTable` from `core-table`, not legacy `data-table`
- [ ] `label` on every column
- [ ] `exportValue` where needed
- [ ] Cell components, not ad-hoc spans
- [ ] `getRowActions` shared between row + drawer
- [ ] `IconButton` tooltips on icon actions
- [ ] Delete level appropriate per resource
- [ ] French `ariaLabel`, placeholders, modal titles
- [ ] `pnpm build` passes

## Delete levels by resource (current conventions)

| Resource | Single delete | Bulk |
|----------|---------------|------|
| Users | `match` (email) | `confirm` |
| Roles | `match` (name) | `confirm` |
| Modules, permissions, groups | `confirm` | `confirm` |
| Other config (countries, etc.) | `simple` | `confirm` |
