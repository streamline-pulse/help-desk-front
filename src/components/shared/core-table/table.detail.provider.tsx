"use client"

import { createContext, useContext } from "react"

const TableDetailDepthContext = createContext(0)

export function useTableDetailDepth() {
  return useContext(TableDetailDepthContext)
}

export function TableDetailDepthProvider({
  depth,
  children,
}: {
  depth: number
  children: React.ReactNode
}) {
  return (
    <TableDetailDepthContext.Provider value={depth}>
      {children}
    </TableDetailDepthContext.Provider>
  )
}
