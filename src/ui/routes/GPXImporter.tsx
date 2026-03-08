import { useCallback } from 'react'
import { parseGPX, type GPXRoute } from '../../domain/gpx/gpx-parser'

interface GPXImporterProps {
  onRoutesLoaded: (routes: GPXRoute[]) => void
}

export function GPXImporter({ onRoutesLoaded }: GPXImporterProps) {
  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        if (text) {
          const routes = parseGPX(text)
          onRoutesLoaded(routes)
        }
      }
      reader.readAsText(file)
    },
    [onRoutesLoaded]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  return (
    <div
      data-testid="gpx-drop-zone"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-gray-500 rounded-lg p-4 text-center cursor-pointer hover:border-green-400 transition-colors"
    >
      <p className="text-sm text-gray-300">
        📂 Arrastra un archivo GPX aquí
      </p>
      <input
        type="file"
        accept=".gpx"
        onChange={handleChange}
        className="hidden"
        id="gpx-file-input"
      />
      <label
        htmlFor="gpx-file-input"
        className="text-xs text-gray-500 cursor-pointer hover:text-green-400"
      >
        o haz clic para seleccionar
      </label>
    </div>
  )
}
