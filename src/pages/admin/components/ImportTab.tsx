import { useState } from 'react'
import { UploadStep } from './import/UploadStep'
import { MappingStep } from './import/MappingStep'
import { ReviewStep } from './import/ReviewStep'

export function ImportTab() {
  const [step, setStep] = useState<'upload' | 'mapping' | 'review'>('upload')
  const [headers, setHeaders] = useState<string[]>([])
  const [rawData, setRawData] = useState<any[]>([])
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [groups, setGroups] = useState<any[]>([])

  const reset = () => {
    setStep('upload')
    setHeaders([])
    setRawData([])
    setMapping({})
    setGroups([])
  }

  return (
    <div className="space-y-6">
      {step === 'upload' && (
        <UploadStep
          onUploadSuccess={(h, d, m) => {
            setHeaders(h)
            setRawData(d)
            setMapping(m)
            setStep('mapping')
          }}
        />
      )}
      {step === 'mapping' && (
        <MappingStep
          headers={headers}
          rawData={rawData}
          mapping={mapping}
          onMappingChange={setMapping}
          onCancel={reset}
          onConfirm={(g) => {
            setGroups(g)
            setStep('review')
          }}
        />
      )}
      {step === 'review' && (
        <ReviewStep
          groups={groups}
          setGroups={setGroups}
          onBack={() => setStep('mapping')}
          onSuccess={reset}
        />
      )}
    </div>
  )
}
