'use client'

import { motion } from 'framer-motion'
import { CircleCheck, UserRound, TrendingUp, ShieldCheck } from 'lucide-react'
import { SectionHeading } from './section-heading'
import { Reveal, RevealGroup, revealItem } from './reveal'
import { ScrollConstellation } from './scroll-constellation'
import { Parallax } from './parallax'

const pillars = [
  {
    icon: CircleCheck,
    title: 'Sami používame to, čo staviame',
    body: 'Naše automatizácie a systémy na získavanie leadov sme najprv otestovali na vlastnom biznise. Kupujete overené, nie teoretické riešenia.',
  },
  {
    icon: UserRound,
    title: 'Priame partnerstvo',
    body: 'Pracujete priamo s ľuďmi, ktorí váš systém budujú. Žiadni prostredníci.',
  },
  {
    icon: TrendingUp,
    title: 'Výsledky, nie reporty',
    body: 'Zaujímajú nás ušetrené hodiny a vygenerovaný zisk – čísla, na ktorých skutočne záleží.',
  },
]

export function About() {
  return (
    <section id="about" className="relative overflow-clip hex-grid py-32 sm:py-44">
      <Parallax offset={70}>
        <ScrollConstellation variant="human" />
      </Parallax>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(7,9,17,.6),rgba(7,9,17,.08)_30%,rgba(7,9,17,.13)_72%,rgba(7,9,17,.7))]" />
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex justify-center">
          <SectionHeading
            eyebrow="O nás"
            title="Budované ľuďmi z praxe,"
            highlight="pre ľudí z praxe."
          />
        </div>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-10 max-w-3xl space-y-6 text-center text-lg leading-relaxed text-muted-foreground text-pretty">
            <p>
              Nie sme len vývojári. Sme ľudia z praxe, ktorí chápu, že technológia má zmysel len vtedy, ak prináša efektivitu a zisk.
            </p>
          </div>
        </Reveal>
        <RevealGroup className="mt-20 grid gap-8 md:grid-cols-3">
          {pillars.map((p) => (
            <motion.div
              key={p.title}
              variants={revealItem}
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="group rounded-2xl border border-border bg-card/60 p-8 backdrop-blur-md transition-colors hover:border-cyan/50 hover:bg-card/78 hover:shadow-[0_0_36px_-12px_var(--cyan)]"
            >
              <span className="grid size-12 place-items-center rounded-xl border border-cyan/25 bg-cyan/10 text-cyan">
                <p.icon className="size-6" strokeWidth={1.8} />
              </span>
              <h3 className="mt-6 font-display text-lg font-semibold text-foreground">
                {p.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {p.body}
              </p>
            </motion.div>
          ))}
        </RevealGroup>

        <Reveal delay={0.15}>
          <div className="mx-auto mt-10 flex max-w-3xl items-center justify-center gap-3 rounded-2xl border border-cyan/40 bg-cyan/10 px-6 py-5 text-center shadow-[0_0_40px_-16px_var(--cyan)] backdrop-blur-md sm:gap-4 sm:px-8">
            <ShieldCheck className="size-7 shrink-0 text-cyan sm:size-8" strokeWidth={1.7} />
            <p className="font-display text-base font-semibold leading-snug text-foreground sm:text-lg">
              Garancia vrátenia peňazí — ak nebudete spokojní, vrátime vám investíciu.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
