---
name: core-table
description: >-
  Build consistent list interfaces with the Help Desk core-table system
  (DataTable, cells, actions, detail drawer, export, bulk delete). Use when
  creating or migrating a resource table, datatable page, list view, row
  actions, detail drawer, or when the user mentions core-table, utilisateurs
  table pattern, or table UI consistency.
---

# Core Table — Help Desk Front

Build list pages like `src/app/(board)/board/utilisateurs/_components/user.table.tsx`.  
**Do not** use `src/components/shared/data-table/` (legacy). Use `src/components/shared/core-table/`.

Read [reference.md](reference.md) for cell catalog, delete levels, and checklist.

## Architecture (page layer)

```text
types/api → hooks/queries → page _components/*.table.tsx
```

The table component owns UI state (form modal, delete modal, detail drawer). It calls query/mutation hooks only — never services directly.

## Minimal workflow

1. Define `Filters` type and `columns` with `DataTableColumn<TRow>[]`.
2. Wire `DataTable` with `query`, `responseAdapter`, `getRowId`, `columns`.
3. Add `rowActions` via shared `buildRowActions` + `TableActionsCell`.
4. Optional: `TableDetailDrawer` + `useTableDetail` + `DetailTriggerCell` on primary column.
5. Add `GlobalModal` (create/edit) + `DeleteConfirmationModal` (single delete).
6. Enable `selectable`, `bulkDelete`, `export` when needed.

## DataTable props (defaults)

| Prop | Usage |
|------|--------|
| `id` | Stable table id (URL state) |
| `query` | Hook wrapper: `(request) => useXListQuery(request)` |
| `responseAdapter` | Map API response → `PageResult<TRow>` |
| `columns` | Typed columns with `label` for export/visibility |
| `getRowId` | Stable row id |
| `search` | `{ enabled, placeholder, debounceMs }` |
| `capabilities` | `{ pagination, search, filters, serverSorting }` |
| `selectable` | Row checkboxes + bulk bar |
| `rowActions` | `(row) => <TableActionsCell actions={getRowActions(row)} />` |
| `bulkDelete` | `{ level, onDelete, isPending, onReset }` |
| `export` | `{ enabled: true, filename }` |
| `toolbarActions` | Primary CTA (`Button size="sm"` + icon) |
| `ariaLabel` | French accessible name |

## Columns

- Always set `label` on each column (export + column visibility).
- Use `exportValue` when `accessorKey` does not match export text (relations, booleans, computed).
- Prefer **cell components** over raw markup (see reference).
- Headers: `TableColumnHeader` + Tabler icon on non-primary columns (optional, follow users table).
- Primary name column: `DetailTriggerCell` + `TextCell variant="primary"` when detail drawer exists.

## Actions (single source of truth)

Define actions once, reuse in table and drawer:

```tsx
function getRowActions(row: TRow) {
  return buildRowActions({
    label: row.name,
    onEdit: () => { setEditing(row); setFormOpen(true) },
    onDelete: () => { deleteMutation.reset(); setDeleting(row) },
  })
}

rowActions={(row) => <TableActionsCell actions={getRowActions(row)} />}

<TableDetailDrawer
  actions={detail.item ? getRowActions(detail.item) : undefined}
  ...
/>
```

Extra actions: spread into `buildRowActions` result or pass custom `TableRowAction[]`.

Icon-only actions use `IconButton` / `TableRowActionsButtons` (tooltip ~1.5s).  
Drawer footer actions use `size="md"` (`icon`, 32px) — slightly larger than table `icon-sm` (28px).

## Detail drawer

```tsx
const detail = useTableDetail<TRow>()

<TableDetailDrawer
  open={detail.open}
  onOpenChange={detail.onOpenChange}
  title={...}
  description="..."
  actions={detail.item ? getRowActions(detail.item) : undefined}
>
  {detail.item ? <MyDetailPanel item={detail.item} /> : null}
</TableDetailDrawer>
```

- Default: modal, swipe handle, floating panel (inset + rounded).
- Detail panel lives in `_components/<resource>.detail.panel.tsx`, read-only fields reusing cells where possible.
- Open detail via `DetailTriggerCell` on primary column — avoid whole-row click unless requested.

## Delete confirmation levels

| Level | When |
|-------|------|
| `simple` | Low-risk config entities |
| `confirm` | Standard destructive + bulk delete |
| `match` | Sensitive entities (users: email, roles: name) |

Single delete: `DeleteConfirmationModal` beside the table.  
Bulk: `bulkDelete.level` on `DataTable` (usually `confirm`).

## Forms

- Create/edit: `GlobalModal` + form component (`<resource>.form.tsx`).
- `preventClose` while mutations pending.
- `key={editing?.id ?? "new"}` on form to reset state.

## UI rules

- French copy in components.
- Icons: `@tabler/icons-react`.
- Toolbar primary action: labeled `Button`, not `IconButton`.
- All table icon actions: `IconButton` with descriptive `tooltip`.
- Spacing: `gap-*`, not `space-y-*`.
- Run `pnpm build` after changes.

## Golden reference

`src/app/(board)/board/utilisateurs/_components/user.table.tsx` — full pattern (cells, drawer, actions, bulk, export, modals).

Simpler variant without drawer: `src/app/(board)/board/configuration/_components/resource-data-table.tsx`.
