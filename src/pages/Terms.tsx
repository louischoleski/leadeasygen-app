import { LegalPage, LegalSection } from '../components/LegalPage'
import { useTranslation } from '../hooks/useTranslation'

export default function Terms() {
  const { t, m } = useTranslation()
  return (
    <LegalPage title={t('legal.terms.title')}>
      {m.legal.terms.sections.map((section) => (
        <LegalSection key={section.heading} heading={section.heading}>
          {section.body}
        </LegalSection>
      ))}
    </LegalPage>
  )
}
