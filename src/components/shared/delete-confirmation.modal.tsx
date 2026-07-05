"use client"

import { useMemo, useState } from "react"
import type { ReactNode } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"

export type DeleteConfirmationLevel = "simple" | "confirm" | "match"

const DEFAULT_CONFIRM_KEYWORD = "supprimer"

type DeleteConfirmationModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  level?: DeleteConfirmationLevel
  title?: ReactNode
  description?: ReactNode
  itemName?: string
  confirmKeyword?: string
  matchValue?: string
  onConfirm: () => void | Promise<void>
  isPending?: boolean
  confirmLabel?: string
  cancelLabel?: string
}

function resolveEffectiveLevel(
  level: DeleteConfirmationLevel,
  matchValue?: string
): Exclude<DeleteConfirmationLevel, "match"> | "match" {
  if (level === "match" && !matchValue?.trim()) return "confirm"
  return level
}

function normalizeInput(value: string) {
  return value.trim()
}

export function DeleteConfirmationModal({
  open,
  onOpenChange,
  level = "simple",
  title,
  description,
  itemName,
  confirmKeyword = DEFAULT_CONFIRM_KEYWORD,
  matchValue,
  onConfirm,
  isPending = false,
  confirmLabel = "Supprimer",
  cancelLabel = "Annuler",
}: DeleteConfirmationModalProps) {
  const [inputValue, setInputValue] = useState("")
  const effectiveLevel = resolveEffectiveLevel(level, matchValue)

  const resolvedTitle =
    title ??
    (itemName
      ? `Supprimer « ${itemName} » ?`
      : "Confirmer la suppression ?")

  const resolvedDescription =
    description ??
    (itemName
      ? `« ${itemName} » sera supprimé définitivement. Cette action est irréversible.`
      : "Cet élément sera supprimé définitivement. Cette action est irréversible.")

  const expectedValue = useMemo(() => {
    if (effectiveLevel === "match") return normalizeInput(matchValue ?? "")
    if (effectiveLevel === "confirm") {
      return normalizeInput(confirmKeyword || DEFAULT_CONFIRM_KEYWORD)
    }
    return ""
  }, [confirmKeyword, effectiveLevel, matchValue])

  const isInputValid =
    effectiveLevel === "simple" ||
    normalizeInput(inputValue).toLocaleLowerCase("fr") ===
      expectedValue.toLocaleLowerCase("fr")

  function handleOpenChange(next: boolean) {
    if (next) {
      setInputValue("")
      onOpenChange(true)
      return
    }
    if (!isPending) {
      setInputValue("")
      onOpenChange(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader className="place-items-start text-left">
          <AlertDialogTitle>{resolvedTitle}</AlertDialogTitle>
          <AlertDialogDescription>{resolvedDescription}</AlertDialogDescription>
        </AlertDialogHeader>

        {effectiveLevel !== "simple" ? (
          <div className="grid gap-2">
            <Label htmlFor="delete-confirmation-input">
              {effectiveLevel === "match"
                ? `Saisissez « ${expectedValue} » pour confirmer`
                : `Saisissez « ${expectedValue} » pour continuer`}
            </Label>
            <Input
              id="delete-confirmation-input"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder={expectedValue}
              autoComplete="off"
              disabled={isPending}
              aria-invalid={inputValue.length > 0 && !isInputValid}
            />
          </div>
        ) : null}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending || !isInputValid}
            onClick={() => void onConfirm()}
          >
            {isPending ? <Spinner /> : null}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
