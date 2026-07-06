export const onboardingEvents = {
  userCreated: "user:created",
  searchOpened: "search:opened",
  tableSearchUsed: "table-search:used",
  exportCompleted: "export:completed",
} as const

export type OnboardingEvent =
  (typeof onboardingEvents)[keyof typeof onboardingEvents]

const ONBOARDING_ACTION_EVENT = "onboarding:action"

export function emitOnboardingEvent(event: OnboardingEvent) {
  if (typeof window === "undefined") {
    return
  }

  window.dispatchEvent(
    new CustomEvent(ONBOARDING_ACTION_EVENT, { detail: { event } })
  )
}

export function subscribeOnboardingEvents(
  listener: (event: OnboardingEvent) => void
) {
  if (typeof window === "undefined") {
    return () => undefined
  }

  function handleAction(event: Event) {
    const customEvent = event as CustomEvent<{ event: OnboardingEvent }>
    if (customEvent.detail?.event) {
      listener(customEvent.detail.event)
    }
  }

  window.addEventListener(ONBOARDING_ACTION_EVENT, handleAction)
  return () => window.removeEventListener(ONBOARDING_ACTION_EVENT, handleAction)
}
