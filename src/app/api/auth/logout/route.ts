import { NextResponse, type NextRequest } from "next/server"

import { clearAuthCookie } from "@/lib/auth-cookie"
import { rejectUntrustedMutation } from "@/lib/route-handler"

export function POST(request: NextRequest) {
  const rejected = rejectUntrustedMutation(request)
  if (rejected) return rejected

  const response = NextResponse.json({ success: true as const })
  clearAuthCookie(response)
  return response
}
