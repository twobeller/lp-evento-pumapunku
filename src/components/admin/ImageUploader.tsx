import React, { useRef, useState } from 'react'
import { Image as ImageIcon, Upload, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImageUploaderProps {
  currentUrl: string
  label: string
  onFileSelect: (file: File) => void
  onClear: () => void
  helperText?: string
}

export function ImageUploader({
  currentUrl,
  label,
  onFileSelect,
  onClear,
  helperText,
}: ImageUploaderProps) {
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const preview = URL.createObjectURL(file)
      setLocalPreview(preview)
      onFileSelect(file)
    }
  }

  const handleRemove = () => {
    setLocalPreview(null)
    if (inputRef.current) inputRef.current.value = ''
    onClear()
  }

  const activeDisplay = localPreview || currentUrl

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-[#686054]">{label}</label>
        {activeDisplay && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 text-xs text-[#D14328] hover:bg-red-50"
            onClick={handleRemove}
          >
            <X className="size-3.5 mr-1" /> Remover Imagem
          </Button>
        )}
      </div>

      {activeDisplay ? (
        <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-[#181410]/20 bg-[#EDE2C6]/40 p-2 group">
          <div className="relative h-48 w-full overflow-hidden rounded-xl bg-black/5 flex items-center justify-center">
            <img
              src={activeDisplay}
              alt={label}
              className="h-full w-full object-cover transition group-hover:scale-105 duration-300"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
              <Button
                type="button"
                size="sm"
                className="bg-white text-black hover:bg-white/90 text-xs font-bold"
                onClick={() => inputRef.current?.click()}
              >
                <Upload className="size-3.5 mr-1" /> Trocar
              </Button>
            </div>
          </div>
          {localPreview && (
            <p className="mt-2 text-center text-xs font-semibold text-[#E8622C]">
              ✦ Nova imagem selecionada (salve para confirmar)
            </p>
          )}
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#181410]/25 bg-[#EDE2C6]/30 p-8 text-center transition hover:border-[#E8622C] hover:bg-[#EDE2C6]/60"
        >
          <div className="grid size-12 place-items-center rounded-2xl bg-[#181410]/5 text-[#686054]">
            <ImageIcon className="size-6" />
          </div>
          <p className="mt-3 text-sm font-bold text-[#181410]">
            Clique para enviar imagem ou banner
          </p>
          <p className="mt-1 text-xs text-[#686054]">JPG, PNG, WebP ou AVIF até 20MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={handleFileChange}
      />
      {helperText && <p className="text-[11px] text-[#6d6559]">{helperText}</p>}
    </div>
  )
}
