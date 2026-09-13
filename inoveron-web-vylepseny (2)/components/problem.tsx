import { Reveal } from './reveal'
import { ScrollConstellation } from './scroll-constellation'
import { Parallax } from './parallax'

export function Problem() {
  return (
    <section className="relative flex min-h-[760px] items-center overflow-clip bg-background py-32 sm:py-44">
      <Parallax offset={90}>
        <ScrollConstellation variant="bottleneck" />
      </Parallax>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_69%_50%,transparent_0%,rgba(7,9,17,.10)_38%,rgba(7,9,17,.67)_82%)]" />
      <div className="relative z-10 mx-auto w-full max-w-4xl px-5 text-center sm:px-8">
          <Reveal>
            <span className="font-mono text-xs font-bold tracking-[0.25em] text-cyan">01 / ÚZKE MIESTO</span>
          </Reveal>
          <Reveal>
            <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-balance sm:text-5xl">
              Väčšina firiem zlyháva na <span className="text-gradient">exekúcii.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
              Vízia je jasná. Problémom je implementácia. Väčšina tímov je príliš zaneprázdnená každodennou operatívou na to, aby budovali interné nástroje alebo spúšťali projekty, ktoré firmu skutočne posunú vpred. Tu nastupujeme my.
            </p>
          </Reveal>
      </div>
    </section>
  )
}
