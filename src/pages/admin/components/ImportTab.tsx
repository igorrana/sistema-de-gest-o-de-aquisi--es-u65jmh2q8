import { useState } from 'react'
import { UploadStep } from './import/UploadStep'
import { MappingStep } from './import/MappingStep'
import { ReviewStep } from './import/ReviewStep'
import { ProductsMappingStep } from './import/ProductsMappingStep'
import { ProductsReviewStep } from './import/ProductsReviewStep'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

export function ImportTab() {
  const [importType, setImportType] = useState<'requests' | 'products'>('requests')
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

  const handleTypeChange = (val: string) => {
    setImportType(val as 'requests' | 'products')
    reset()
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-md border shadow-sm flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-slate-700">
          Selecione o tipo de dados para importar:
        </h3>
        <RadioGroup value={importType} onValueChange={handleTypeChange} className="flex gap-6">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="requests" id="r-req" />
            <Label htmlFor="r-req" className="cursor-pointer font-medium">
              Solicitações de Compra
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="products" id="r-prod" />
            <Label htmlFor="r-prod" className="cursor-pointer font-medium">
              Cadastro de Produtos
            </Label>
          </div>
        </RadioGroup>
      </div>

      {step === 'upload' && (
        <UploadStep
          importType={importType}
          onUploadSuccess={(h, d, m) => {
            setHeaders(h)
            setRawData(d)
            setMapping(m)
            setStep('mapping')
          }}
        />
      )}
      {step === 'mapping' && importType === 'requests' && (
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
      {step === 'mapping' && importType === 'products' && (
        <ProductsMappingStep
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
      {step === 'review' && importType === 'requests' && (
        <ReviewStep
          groups={groups}
          setGroups={setGroups}
          onBack={() => setStep('mapping')}
          onSuccess={reset}
        />
      )}
      {step === 'review' && importType === 'products' && (
        <ProductsReviewStep
          groups={groups}
          setGroups={setGroups}
          onBack={() => setStep('mapping')}
          onSuccess={reset}
        />
      )}
    </div>
  )
}
