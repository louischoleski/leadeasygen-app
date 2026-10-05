// The server accepts either a 6-digit authenticator code or one of the
// 8-character backup codes in the same `mfaCode` field.
const BACKUP_CODE = /^[A-Z0-9]{8}$/i

export function isSecondFactorReady(value: string, backup: boolean): boolean {
  return backup ? BACKUP_CODE.test(value.trim()) : /^\d{6}$/.test(value)
}
