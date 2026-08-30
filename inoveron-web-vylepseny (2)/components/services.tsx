'use client'

import { motion } from 'framer-motion'
import {
  Crosshair,
  LineChart,
  MessageSquareDot,
  Network,
  Sparkles,
  Workflow,
} from 'lucide-react'
import { SectionHeading } from './section-heading'
import { RevealGroup, revealItem } from './reveal'
import { ScrollConstellation } from './scroll-constellation'

const services = [
  {
    icon: Crosshair,
    title: 'AI Lead Generation a Akvizícia',
    body: 'Nasadzujeme inteligentné systémy, ktoré automaticky vyhľadávajú, kvalifikujú a zachytávajú potenciálnych klientov priamo do vášho kalendára.',
  },
  {
    icon: Network,
    title: 'Automatizácia procesov a workflow',
    body: 'Mapujeme vaše úzke miesta a budujeme automatizované procesy, ktoré eliminujú manuálne zadávanie dát a ľudské chyby.',
  },
  {
    icon: Workflow,
    title: 'Digitálna infraštruktúra na mieru',
    body: 'Staviame interné nástroje, dashboardy a digitálne prostredia, ktoré vaša firma potrebuje pre bezchybné fungovanie.',
  },
  {
    icon: LineChart,
    title: 'Systémové integrácie',
    body: 'Prepájame vaše izolované nástroje – CRM, ERP a databázy – do jedného plynulého a synchronizovaného ekosystému.',
  },
  {
    icon: MessageSquareDot,
    title: 'Vývoj webov a aplikácií na mieru',
    body: 'Od výkonných interných webových aplikácií až po konverzne zamerané platformy, softvér staviame od základov.',
  },
  {
    icon: Sparkles,
    title: 'Dátové a analytické dashboardy',
    body: 'Živý, automatizovaný reporting, ktorý čerpá dáta zo všetkých vašich zdrojov, aby vedenie mohlo robiť rozhodnutia v reálnom čase.',
  },
]

function ServiceCard({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Crosshair
  title: string
  body: string
}) {
  return (
    <motion.article
      variants={revealItem}
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card/60 p-7 backdrop-blur-md transition-colors duration-300 hover:border-cyan/60 hover:bg-card/78 hover:shadow-[0_0_40px_-8px_var(--cyan)]"
    >
      {/* gradient accent line that appears on hover */}
      <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-brand transition-transform duration-300 group-hover:scale-x-100" />

      <span className="grid size-12 place-items-center rounded-xl border border-cyan/25 bg-cyan/10 text-cyan transition-colors duration-300 group-hover:bg-cyan/20">
        <Icon className="size-6" strokeWidth={1.8} />
      </span>

      <h3 className="mt-6 font-display text-xl font-semibold leading-snug text-foreground">
        {title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>

    </motion.article>
  )
}

export function Services() {
  return (
    <section id="services" className="relative overflow-clip hex-grid py-24 sm:py-32">
      <ScrollConstellation variant="computer" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(7,9,17,.58),rgba(7,9,17,.08)_28%,rgba(7,9,17,.14)_68%,rgba(7,9,17,.68))]" />
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Čo budujeme:"
          title="Systémy a projekty,"
          highlight="ktoré posúvajú váš biznis"
          subtitle="Budujeme digitálne riešenia, ktoré odstraňujú úzke miesta a posúvajú vaše podnikanie vpred."
        />
        <RevealGroup className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.title} {...s} />
          ))}
        </RevealGroup>

        <div className="mt-8 flex justify-center">
          <a
            href="tel:+421918326477"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-cyan/40 hover:text-cyan"
          >
            Prekonzultovať vhodné riešenie →
          </a>
        </div>
      </div>
    </section>
  )
}
