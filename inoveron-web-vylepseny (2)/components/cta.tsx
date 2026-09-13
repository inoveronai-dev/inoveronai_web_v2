'use client'

import { Mail, Phone } from 'lucide-react'
import { Reveal } from './reveal'
import { SignalField } from './motion-visuals'
import { MagneticButton } from './magnetic-button'
import { Parallax } from './parallax'

export function CTA() {
  return (
    <section id="cta" className="relative overflow-hidden cosmic-bg py-36 sm:py-52">
      <Parallax offset={60}>
        <SignalField />
      </Parallax>
      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan">
            Bezplatná úvodná konzultácia
          </span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-5 font-display text-4xl font-bold uppercase leading-[1.02] tracking-tight text-balance sm:text-6xl">
            Nájdime miesto, kde vám<span className="text-gradient"> AI prinesie najväčší efekt.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
            Počas krátkeho hovoru prejdeme vaše procesy a identifikujeme, kde môže automatizácia najviac ušetriť čas, znížiť náklady alebo podporiť rast.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-10 flex justify-center">
            <MagneticButton
              href="tel:+421918326477"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-8 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-xl shadow-fuchsia-500/30"
            >
              <Phone className="size-4" />
              Zavolať na bezplatnú konzultáciu
            </MagneticButton>
          </div>
        </Reveal>
        <Reveal delay={0.4}>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 text-sm text-muted-foreground sm:flex-row">
            <a href="tel:+421918326477" className="inline-flex items-center gap-2 transition-colors hover:text-cyan">
              <Phone className="size-4" /> +421 918 326 477
            </a>
            <span className="hidden sm:inline">·</span>
            <a href="mailto:inoveron.ai@gmail.com" className="inline-flex items-center gap-2 transition-colors hover:text-cyan">
              <Mail className="size-4" /> inoveron.ai@gmail.com
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
