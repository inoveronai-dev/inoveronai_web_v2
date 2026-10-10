'use client'

type LogoKey = 'am' | 'sem' | 'avlas' | 'aramis' | 'agw' | 'zrub'

type Logo = {
  src: string
  alt: string
  /** Optical scale so each mark reads at similar importance */
  scale: number
  tone: 'soft' | 'lift' | 'none'
}

const logos: Record<LogoKey, Logo> = {
  am: {
    src: '/logos/am-living.png',
    alt: 'am living real estate',
    scale: 1.22,
    tone: 'lift',
  },
  sem: {
    src: '/logos/sem.png',
    alt: 'SEM',
    scale: 1.08,
    tone: 'soft',
  },
  avlas: {
    src: '/logos/avlas.png',
    alt: 'Avlas Reality',
    scale: 1.16,
    tone: 'none',
  },
  aramis: {
    src: '/logos/aramis.png',
    alt: 'Aramis Správa Bytov',
    scale: 1.24,
    tone: 'lift',
  },
  agw: {
    src: '/logos/agw.svg',
    alt: 'AGW',
    scale: 1.12,
    tone: 'none',
  },
  zrub: {
    src: '/logos/dreveny-zrub.png',
    alt: 'Drevený Zrub',
    scale: 1.18,
    tone: 'soft',
  },
}

/**
 * Curated stream: each mark 6×, ≥4 others between repeats (incl. loop seam),
 * non-periodic order so the strip reads as a longer client list.
 */
const ORDER: LogoKey[] = [
  'agw',
  'zrub',
  'avlas',
  'sem',
  'aramis',
  'agw',
  'zrub',
  'avlas',
  'sem',
  'am',
  'agw',
  'zrub',
  'aramis',
  'avlas',
  'am',
  'sem',
  'zrub',
  'agw',
  'avlas',
  'am',
  'aramis',
  'zrub',
  'sem',
  'agw',
  'am',
  'aramis',
  'zrub',
  'avlas',
  'sem',
  'am',
  'aramis',
  'agw',
  'avlas',
  'sem',
  'am',
  'aramis',
]

const sequence = ORDER.map((key) => logos[key])

const toneClass: Record<Logo['tone'], string> = {
  none: '',
  soft: 'logo-tone-soft',
  lift: 'logo-tone-lift',
}

export function LogoCarousel() {
  return (
    <section
      aria-label="Firmy, s ktorými spolupracujeme"
      className="logo-trust relative z-[2] mt-0 overflow-hidden pb-3 pt-28 sm:pb-4 sm:pt-32"
    >
      <div
        className="logo-trust-atmosphere pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      />

      <div className="logo-marquee relative overflow-hidden">
        <div className="logo-marquee-track flex w-max items-center">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className="flex items-center gap-11 px-6 sm:gap-[4.75rem] sm:px-12 lg:gap-24"
              aria-hidden={copy === 1 ? true : undefined}
            >
              {sequence.map((logo, index) => (
                <li
                  key={`${copy}-${logo.src}-${index}`}
                  className="flex h-[3.75rem] w-[9.25rem] shrink-0 items-center justify-center sm:h-[4.5rem] sm:w-[11.5rem]"
                  style={{ ['--logo-scale' as string]: logo.scale }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.src}
                    alt={copy === 0 ? logo.alt : ''}
                    className={`logo-mark w-auto max-w-full object-contain ${toneClass[logo.tone]}`}
                    loading="lazy"
                    decoding="async"
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
