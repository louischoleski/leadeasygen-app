import { useId } from 'react'
import { useTranslation } from '../hooks/useTranslation'
import { Button } from './Button'
import { Input } from './Input'
import { OtpInput } from './OtpInput'

interface SecondFactorFieldProps {
  value: string
  onChange: (value: string) => void
  /** Whether the person is typing a backup code instead of an authenticator code. */
  backup: boolean
  onBackupChange: (backup: boolean) => void
  onComplete?: (value: string) => void
  disabled?: boolean
}

/** Authenticator code (6 digits) with a switch to a backup code. */
export function SecondFactorField({
  value,
  onChange,
  backup,
  onBackupChange,
  onComplete,
  disabled,
}: SecondFactorFieldProps) {
  const { t } = useTranslation()
  const labelId = useId()
  const inputId = useId()
  return (
    <div className="space-y-2">
      {backup ? (
        <Input
          label={t('auth.login.mfa.backupCode')}
          id={inputId}
          type="text"
          autoComplete="one-time-code"
          placeholder="ABCD1234"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
        />
      ) : (
        <div>
          <p id={labelId} className="mb-3 text-sm font-medium text-ink">
            {t('auth.login.mfa.code')}
          </p>
          <OtpInput
            value={value}
            onChange={onChange}
            onComplete={onComplete}
            length={6}
            disabled={disabled}
            aria-labelledby={labelId}
          />
        </div>
      )}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        fullWidth
        disabled={disabled}
        onClick={() => {
          onChange('')
          onBackupChange(!backup)
        }}
      >
        {backup ? t('auth.login.mfa.useAuthenticator') : t('auth.login.mfa.useBackupCode')}
      </Button>
    </div>
  )
}
