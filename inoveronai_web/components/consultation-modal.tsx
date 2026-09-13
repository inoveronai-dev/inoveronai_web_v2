'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Calendar, CheckCircle2, X } from 'lucide-react'
import { MagneticButton } from './magnetic-button'

const WEB3FORMS_ACCESS_KEY = '329fbdca-8130-4bcb-ad43-dadc5884d500'
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'

type ConsultationContextValue = {
  open: () => void
  close: () => void
}

const ConsultationContext = createContext<ConsultationContextValue | null>(null)

export function useConsultation() {
  const ctx = useContext(ConsultationContext)
  if (!ctx) {
    throw new Error('useConsultation must be used within ConsultationProvider')
  }
  return ctx
}

export function ConsultationProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  return (
    <ConsultationContext.Provider value={{ open, close }}>
      {children}
      <ConsultationModal isOpen={isOpen} onClose={close} />
    </ConsultationContext.Provider>
  )
}

/** Magnetic CTA that opens the consultation modal. */
export function ConsultationCTA({
  children = 'Dohodnúť konzultáciu',
  className,
  showIcon = true,
}: {
  children?: ReactNode
  className?: string
  showIcon?: boolean
}) {
  const { open } = useConsultation()

  return (
    <MagneticButton type="button" onClick={open} className={className}>
      {showIcon ? <Calendar className="size-4" /> : null}
      {children}
    </MagneticButton>
  )
}

type FormFields = {
  company: string
  email: string
  message: string
}

const EMPTY_FORM: FormFields = {
  company: '',
  email: '',
  message: '',
}

function ConsultationModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const titleId = useId()
  const [fields, setFields] = useState<FormFields>(EMPTY_FORM)
  const [submitted, setSubmitted] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const requestId = useRef(0)

  useEffect(() => {
    if (!isOpen) {
      requestId.current += 1
      if (closeTimer.current) {
        clearTimeout(closeTimer.current)
        closeTimer.current = null
      }
      return
    }

    setFields(EMPTY_FORM)
    setSubmitted(false)
    setPending(false)
    setError(null)

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      if (closeTimer.current) clearTimeout(closeTimer.current)
    }
  }, [isOpen, onClose])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (pending) return

    const currentRequest = ++requestId.current
    setPending(true)
    setError(null)

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          Meno_firmy: fields.company.trim(),
          email: fields.email.trim(),
          Sprava: fields.message.trim(),
        }),
      })

      if (currentRequest !== requestId.current) return

      const result = (await response.json().catch(() => null)) as {
        success?: boolean
        message?: string
      } | null

      if (currentRequest !== requestId.current) return

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Odoslanie zlyhalo. Skúste to prosím znova.')
      }

      setSubmitted(true)
      closeTimer.current = setTimeout(() => {
        onClose()
      }, 3000)
    } catch (err) {
      if (currentRequest !== requestId.current) return
      setError(err instanceof Error ? err.message : 'Odoslanie zlyhalo. Skúste to prosím znova.')
      setPending(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center px-5 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Zavrieť"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 w-full max-w-3xl rounded-2xl border border-border bg-card/95 p-6 shadow-[0_0_60px_-20px_oklch(0.68_0.22_5_/_0.45)] backdrop-blur-xl sm:p-8 md:p-10"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Zavrieť formulár"
              className="absolute right-4 top-4 z-20 grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-5" />
            </button>

            {submitted ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 py-10 text-center">
                <CheckCircle2 className="size-12 text-cyan" strokeWidth={1.5} />
                <p className="max-w-md text-base leading-relaxed text-foreground">
                  Ďakujeme. V krátkom čase sa vám ozveme s návrhmi termínov.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-10">
                <div className="pr-2 md:pr-4">
                  <h2
                    id={titleId}
                    className="font-display text-2xl font-bold tracking-tight text-balance sm:text-3xl"
                  >
                    <span className="text-gradient">Zmapujme vašu najväčšiu príležitosť</span>
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:text-base">
                    30 minút. Prejdeme si vaše procesy, zistíme, kde strácate najviac času alebo peňazí,
                    a presne vám ukážeme, aký systém by sme postavili, aby sme to vyriešili.
                  </p>
                </div>

                <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate={false}>
                  <label className="flex flex-col gap-2 text-left">
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan">
                      Meno firmy
                    </span>
                    <input
                      required
                      name="company"
                      type="text"
                      autoComplete="organization"
                      placeholder="Napr. Acme s.r.o."
                      className="consult-input"
                      value={fields.company}
                      disabled={pending}
                      onChange={(e) => setFields((prev) => ({ ...prev, company: e.target.value }))}
                    />
                  </label>

                  <label className="flex flex-col gap-2 text-left">
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan">
                      Váš Email
                    </span>
                    <input
                      required
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="meno@firma.sk"
                      className="consult-input"
                      value={fields.email}
                      disabled={pending}
                      onChange={(e) => setFields((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </label>

                  <label className="flex flex-col gap-2 text-left">
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                      Viac informácií{' '}
                      <span className="normal-case tracking-normal">(voliteľné)</span>
                    </span>
                    <textarea
                      name="message"
                      rows={4}
                      placeholder="Stručne popíšte, s čím by ste potrebovali pomôcť…"
                      className="consult-input resize-none"
                      value={fields.message}
                      disabled={pending}
                      onChange={(e) => setFields((prev) => ({ ...prev, message: e.target.value }))}
                    />
                  </label>

                  {error ? (
                    <p className="text-sm text-red-400" role="alert">
                      {error}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={pending}
                    className="mt-1 inline-flex items-center justify-center rounded-xl bg-gradient-brand px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-fuchsia-500/25 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
                  >
                    {pending ? 'Odosielam...' : 'Odoslať žiadosť'}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
