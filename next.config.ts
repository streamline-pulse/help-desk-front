import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_HELP_DESK_API_URL:
      process.env.NEXT_PUBLIC_HELP_DESK_API_URL ?? "/backend",
  },
  async rewrites() {
    const apiUrl = process.env.HELP_DESK_API_URL

    if (!apiUrl) return []

    return [
      {
        source: "/backend/:path*",
        destination: `${apiUrl.replace(/\/$/, "")}/:path*`,
      },
    ]
  },
}

export default nextConfig
