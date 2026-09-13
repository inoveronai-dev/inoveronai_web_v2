'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'
import { FaqScanner } from './motion-visuals'

const faqs = [
  { q: 'Čo presne robíte?', a: 'Budujeme AI automatizácie, asistentov a interné systémy na mieru pre firmy, ktorým manuálna operatíva brzdí rast.' },
  { q: 'Ako dlho trvajú projekty?', a: 'Závisí od rozsahu. Po úvodnom hovore dostanete jasný návrh riešenia, rozsah projektu a realistický termín dodania.' },
  { q: 'S akými firmami pracujete?', a: 'Najväčší zmysel dávajú naše riešenia firmám s opakovanou administratívou, väčším objemom komunikácie alebo procesmi rozdelenými medzi viacero nástrojov.' },
  { q: 'Ako naceňujete projekty?', a: 'Každý systém je nacenený podľa vašich presných potrieb. Po úvodnom zistení stavu poskytujeme fixné projektové ceny, takže dopredu viete presnú výšku investície.' },
]

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(index === 0)
  return (
    <Reveal delay={index * 0.05}>
      <div className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-cyan/40">
        <motion.span
          className="absolute inset-y-0 left-0 w-0.5 origin-top bg-gradient-brand"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: index * 0.1 }}
        />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-4 p-6 text-left"
          aria-expanded={open}
        >
          <span className="flex items-center gap-4">
            <span className="font-mono text-xs font-bold text-cyan/60">0{index + 1}</span>
            <span className="font-display text-lg font-semibold text-foreground">{q}</span>
          </span>
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className="grid size-8 shrink-0 place-items-center rounded-lg border border-cyan/30 text-cyan"
          >
            <Plus className="size-4" />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p className="px-6 pb-6 leading-relaxed text-muted-foreground">{a}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  )
}

export function Faq() {
  return (
    <section className="relative overflow-hidden bg-background py-32 sm:py-44">
      <div className="pointer-events-none absolute right-0 top-1/2 size-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-cyan/5 blur-3xl" />
      <div className="relative mx-auto max-w-3xl px-5 sm:px-8 sm:pl-20">
        <FaqScanner />
        <div className="flex justify-center">
          <SectionHeading eyebrow="FAQ" title="Často kladené" highlight="otázky" />
        </div>
        <div className="mt-14 flex flex-col gap-4">
          {faqs.map((f, i) => (
            <FaqItem key={f.q} q={f.q} a={f.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
