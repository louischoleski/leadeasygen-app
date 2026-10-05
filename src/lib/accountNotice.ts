// A one-shot message for the sign-in page after the account was closed from
// settings. Router state does not survive the hop: closing the account ends
// the session, the auth guard then redirects to /login with its own state.
// A module value outlives that redirect (not a reload — nor should it).
let closedDeleteOn: string | null = null

export function setAccountClosedNotice(deleteOn: string): void {
  closedDeleteOn = deleteOn
}

export function peekAccountClosedNotice(): string | null {
  return closedDeleteOn
}

export function clearAccountClosedNotice(): void {
  closedDeleteOn = null
}
