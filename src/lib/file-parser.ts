export function parseCSV(text: string) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim())
  if (lines.length < 1) return { headers: [], data: [] }

  const parseLine = (line: string) => {
    const result = []
    let cell = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cell += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        result.push(cell)
        cell = ''
      } else {
        cell += char
      }
    }
    result.push(cell)
    return result
  }

  const headers = parseLine(lines[0]).map((h) => h.trim())
  const data = lines.slice(1).map((line) => {
    const values = parseLine(line)
    const row: Record<string, string> = {}
    headers.forEach((h, i) => {
      row[h] = values[i]?.trim() || ''
    })
    return row
  })

  return { headers, data }
}

async function loadSheetJS() {
  if (typeof window !== 'undefined' && (window as any).XLSX) {
    return (window as any).XLSX
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js'
    script.onload = () => resolve((window as any).XLSX)
    script.onerror = () => reject(new Error('Falha ao carregar a biblioteca de leitura de Excel'))
    document.head.appendChild(script)
  })
}

export async function parseExcelFile(file: File) {
  const XLSX: any = await loadSheetJS()
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })

  if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
    throw new Error('O arquivo Excel não contém planilhas.')
  }

  const firstSheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[firstSheetName]

  const headerRow: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0] || []
  let headers = headerRow.map((h: any) => String(h).trim()).filter(Boolean)

  const json: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' })

  if (headers.length === 0 && json.length > 0) {
    headers = Object.keys(json[0]).map((k) => String(k).trim())
  }

  const data = json.map((row: any) => {
    const newRow: any = {}
    headers.forEach((h) => {
      const val = row[h]
      newRow[h] = val !== undefined && val !== null ? String(val).trim() : ''
    })
    return newRow
  })

  return { headers, data }
}
