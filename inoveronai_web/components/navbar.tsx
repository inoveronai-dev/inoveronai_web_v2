'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { ConsultationCTA, useConsultation } from './consultation-modal'

const links = [
  { label: 'Služby', href: '#services' },
  { label: 'Proces', href: '#process' },
  { label: 'Výsledky', href: '#results' },
  { label: 'O nás', href: '#about' },
]

export function Navbar() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { open } = useConsultation()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 24)
  })

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      initial={{ y: 0 }}
      animate={{ y: 0 }}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-300 sm:px-8 ${
          scrolled
            ? 'my-3 rounded-2xl border border-border bg-background/60 py-3 shadow-lg shadow-black/30 backdrop-blur-xl'
            : 'my-0 border border-transparent py-5'
        }`}
      >
        <a href="#top" className="flex items-center gap-3 transition-opacity hover:opacity-90">
          <img
            src="/logo.png"
            alt="Inoveron AI"
            className="size-12 rounded-xl object-cover"
          />
          <span className="text-xl font-extrabold tracking-wide bg-gradient-brand bg-clip-text text-transparent">
            INOVERON AI
          </span>
        </a>
        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ConsultationCTA
            showIcon={false}
            className="hidden rounded-lg bg-gradient-brand px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-fuchsia-500/20 sm:inline-block"
          />
          <button
            type="button"
            aria-label={mobileOpen ? 'Zavrieť menu' : 'Otvoriť menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-lg border border-border text-foreground lg:hidden"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-4 overflow-hidden rounded-2xl border border-border bg-background/90 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col p-4">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false)
                  open()
                }}
                className="mt-2 rounded-lg bg-gradient-brand px-4 py-3 text-center text-sm font-bold uppercase tracking-wide text-white"
              >
                Dohodnúť konzultáciu
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
