import { cn } from '@/lib/utils'

export function Pattern({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={cn('absolute inset-0 h-full w-full', className)}>
      <defs>
        <pattern id="puma-pattern" width="72" height="72" patternUnits="userSpaceOnUse">
          <path
            d="M4 20h16V4h32v16h16v32H52v16H20V52H4V20Zm16 0v32h32V20H20Zm10 10h12v12H30V30Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path d="M0 0h12v12H0zM60 60h12v12H60z" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#puma-pattern)" />
    </svg>
  )
}

export function JungleCorner({
  side = 'left',
  className,
}: {
  side?: 'left' | 'right'
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 320 420"
      aria-hidden="true"
      className={cn(
        'absolute h-[45vh] max-h-[500px] w-auto',
        side === 'left' ? 'bottom-0 left-0' : 'bottom-0 right-0 -scale-x-100',
        className,
      )}
    >
      <path d="M57 432C72 314 102 186 179 80" fill="none" stroke="#24523D" strokeWidth="10" />
      <g fill="#2E6B4F" stroke="#181410" strokeWidth="2">
        <path d="M107 292C24 253 25 194 28 166c57 20 87 64 79 126Z" />
        <path d="M126 241c-7-72 33-108 60-122 15 58-5 104-60 122Z" />
        <path d="M73 356C9 326 5 279 9 254c48 18 70 53 64 102Z" />
        <path d="M155 175c-4-61 31-91 55-103 10 49-8 87-55 103Z" />
        <path d="M183 104c4-49 36-69 57-75 2 41-17 68-57 75Z" />
      </g>
      <g transform="translate(185 56)" stroke="#181410" strokeWidth="3">
        <path d="m0 30 23-13 8-26 19 20 27 1-11 25 7 27-28-3-22 16-6-27Z" fill="#E8622C" />
        <circle cx="37" cy="33" r="10" fill="#C9962E" />
      </g>
    </svg>
  )
}

export function MediaPlaceholder({ year, className }: { year?: number; className?: string }) {
  return (
    <div
      className={cn(
        'relative flex min-h-56 w-full items-center justify-center overflow-hidden bg-[#2E6B4F] text-[#F2E9D3]',
        className,
      )}
    >
      <Pattern className="text-[#F2E9D3] opacity-[0.09]" />
      <div className="relative z-10 text-center">
        <div className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-[#EDE2C6]">
          Arquivo da tribo
        </div>
        <div className="font-display text-3xl uppercase leading-none">
          Puma
          <br />
          Punku
        </div>
        {year && (
          <div className="mt-4 inline-block rounded-full bg-[#E8622C] px-4 py-1 text-sm font-black text-white">
            {year}
          </div>
        )}
      </div>
    </div>
  )
}
