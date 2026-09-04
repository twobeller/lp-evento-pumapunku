import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Pattern } from '@/components/BrandArt'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#F2E9D3] p-5 text-center">
      <Pattern className="text-[#181410] opacity-[0.04]" />
      <div className="relative">
        <p className="font-display text-8xl text-[#E8622C]">404</p>
        <h1 className="mt-2 font-display text-4xl uppercase">Esse portal não existe</h1>
        <p className="mx-auto mt-4 max-w-md text-[#655d52]">
          Talvez você tenha seguido um sinal antigo. Volte para a pista principal.
        </p>
        <Button asChild className="mt-8 rounded-full bg-[#2E6B4F] hover:bg-[#24523D]">
          <Link to="/">
            <ArrowLeft /> Voltar ao festival
          </Link>
        </Button>
      </div>
    </main>
  )
}
