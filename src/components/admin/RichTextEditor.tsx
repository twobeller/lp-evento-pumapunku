import React, { useRef, useEffect } from 'react'
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Unlink,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RichTextEditorProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  minHeight?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Digite ou formate seu texto...',
  minHeight = '140px',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  // Sincroniza HTML apenas quando muda externamente (evita perda de cursor durante digitação)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || ''
    }
  }, [value])

  const executeCommand = (command: string, arg?: string) => {
    document.execCommand(command, false, arg)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const promptLink = () => {
    const url = window.prompt('Digite a URL do link (ex: https://...):', 'https://')
    if (url && url.trim() !== '') {
      executeCommand('createLink', url.trim())
    }
  }

  const insertHighlightSpan = () => {
    // Insere destaque com a cor primária do evento
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return
    const selectedText = selection.toString()
    if (!selectedText) {
      alert('Selecione uma palavra ou frase para destacar em laranja!')
      return
    }
    const span = `<span class="text-[#E8622C] font-bold">${selectedText}</span>`
    document.execCommand('insertHTML', false, span)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#181410]/20 bg-white transition-all focus-within:border-[#E8622C] focus-within:ring-2 focus-within:ring-[#E8622C]/20">
      <div className="flex flex-wrap items-center gap-1 border-b border-[#181410]/10 bg-[#EDE2C6]/60 p-1.5 text-[#181410]">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-8 px-2 text-xs font-bold text-[#181410] hover:bg-black/10"
          onClick={() => executeCommand('bold')}
          title="Negrito (Ctrl+B)"
        >
          <Bold className="size-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-8 px-2 text-xs text-[#181410] hover:bg-black/10"
          onClick={() => executeCommand('italic')}
          title="Itálico (Ctrl+I)"
        >
          <Italic className="size-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-8 px-2 text-xs text-[#181410] hover:bg-black/10"
          onClick={() => executeCommand('underline')}
          title="Sublinhado"
        >
          <Underline className="size-4" />
        </Button>
        <div className="mx-1 h-5 w-px bg-black/15" />
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-8 px-2 text-xs text-[#181410] hover:bg-black/10"
          onClick={() => executeCommand('insertUnorderedList')}
          title="Lista com marcadores"
        >
          <List className="size-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-8 px-2 text-xs text-[#181410] hover:bg-black/10"
          onClick={() => executeCommand('insertOrderedList')}
          title="Lista numerada"
        >
          <ListOrdered className="size-4" />
        </Button>
        <div className="mx-1 h-5 w-px bg-black/15" />
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-8 px-2 text-xs text-[#181410] hover:bg-black/10"
          onClick={promptLink}
          title="Inserir Link"
        >
          <LinkIcon className="size-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-8 px-2 text-xs text-[#181410] hover:bg-black/10"
          onClick={() => executeCommand('unlink')}
          title="Remover Link"
        >
          <Unlink className="size-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-8 px-2 text-xs font-semibold text-[#E8622C] hover:bg-[#E8622C]/10"
          onClick={insertHighlightSpan}
          title="Destacar texto selecionado em Laranja Tropical"
        >
          <Sparkles className="size-3.5 mr-1" /> Destacar
        </Button>
        <div className="ml-auto">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-8 px-2 text-xs text-[#555] hover:bg-black/10"
            onClick={() => executeCommand('removeFormat')}
            title="Limpar formatação"
          >
            <RotateCcw className="size-3.5" />
          </Button>
        </div>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-3.5 text-sm leading-relaxed text-[#181410] outline-none focus:outline-none"
        style={{ minHeight }}
        data-placeholder={placeholder}
      />
    </div>
  )
}
