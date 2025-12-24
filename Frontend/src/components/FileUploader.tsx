import { useCallback, useState } from 'react'

export interface FileUploaderProps {
  label?: string
  accept?: string
  maxFiles?: number
  onFiles: (files: File[]) => void
  hint?: string
}

export default function FileUploader({ 
  label: _label = 'Attach files', 
  accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png', 
  maxFiles = 1, 
  onFiles,
  hint
}: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    const validFiles = droppedFiles.slice(0, maxFiles)
    setFiles(validFiles)
    onFiles?.(validFiles)
  }, [maxFiles, onFiles])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      const validFiles = selectedFiles.slice(0, maxFiles)
      setFiles(validFiles)
      onFiles?.(validFiles)
    }
  }, [maxFiles, onFiles])

  const removeFile = useCallback((index: number) => {
    setFiles(prev => {
      const newFiles = [...prev]
      newFiles.splice(index, 1)
      onFiles?.(newFiles)
      return newFiles
    })
  }, [onFiles])

  return (
    <div>
      <div 
        className={`relative flex flex-col items-center justify-center w-full min-h-[150px] border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          dragActive ? 'border-gray-500 bg-gray-50' : 'border-gray-300 hover:bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept={accept}
          multiple={maxFiles > 1}
          onChange={handleChange}
        />

        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
          </svg>
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          {hint && <p className="text-xs text-gray-500">{hint}</p>}
          <p className="text-xs text-gray-500 mt-1">Supported: PDF, DOC, DOCX, JPG, PNG</p>
        </div>
      </div>

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((file, index) => (
            <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm text-gray-700 truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="p-1 text-gray-500 hover:text-red-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
