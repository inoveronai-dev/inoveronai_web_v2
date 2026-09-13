import type { ReactNode } from 'react'
import { Reveal } from './reveal'

export function SectionHeading({
  eyebrow,
  title,
  highlight,
  subtitle,
  align = 'center',
}: {
  eyebrow: string
  title: ReactNode
  highlight?: ReactNode
  subtitle?: string
  align?: 'center' | 'left'
}) {
  const alignment = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left'
  return (
    <Reveal className={`flex flex-col ${alignment} max-w-3xl`}>
      <div className={`mb-5 flex items-center gap-3 ${align === 'center' ? 'justify-center' : ''}`}>
        <span className="h-px w-10 bg-gradient-brand" />
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan">
          {eyebrow}
        </span>
      </div>
      <h2 className="font-display text-4xl font-bold uppercase leading-[1.02] tracking-tight text-balance sm:text-5xl">
        {title} {highlight ? <span className="text-gradient">{highlight}</span> : null}
      </h2>
      {subtitle ? (
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
          {subtitle}
        </p>
      ) : null}
    </Reveal>
  )
}
