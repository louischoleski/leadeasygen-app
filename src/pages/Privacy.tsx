import { LegalPage, LegalSection } from '../components/LegalPage'
import { useTranslation } from '../hooks/useTranslation'

export default function Privacy() {
  const { t, m } = useTranslation()
  return (
    <LegalPage title={t('legal.privacy.title')}>
      {m.legal.privacy.sections.map((section) => (
        <LegalSection key={section.heading} heading={section.heading}>
          {section.body}
        </LegalSection>
      ))}
    </LegalPage>
  )
}
