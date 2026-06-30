import Image from "next/image"

export function AuthBrandPanel() {
  return (
    <div className="flex min-h-0 flex-1 flex-col p-8 lg:p-12">
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-3xl">
        <Image
          src="/images/onboarding.svg"
          alt=""
          fill
          unoptimized
          priority
          className="object-cover"
        />
      </div>
    </div>
  )
}
