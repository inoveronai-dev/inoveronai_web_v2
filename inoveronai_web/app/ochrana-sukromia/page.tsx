import Link from 'next/link'
import { ArrowLeft, Mail } from 'lucide-react'

export const metadata = {
  title: 'Ochrana súkromia | Inoveron AI',
  description: 'Informácie o ochrane súkromia na webovej stránke Inoveron AI.',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background px-5 py-16 sm:px-8 sm:py-24">
      <article className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-cyan transition-opacity hover:opacity-75"
        >
          <ArrowLeft className="size-4" />
          Späť na hlavnú stránku
        </Link>

        <div className="mt-10 rounded-3xl border border-border bg-card p-7 sm:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan">
            Inoveron AI
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
            Ochrana súkromia
          </h1>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            Táto stránka slúži na prezentáciu služieb Inoveron AI. Neobsahuje kontaktný formulár, používateľské účty ani reklamné profilovanie.
          </p>

          <div className="mt-10 space-y-9 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <section>
              <h2 className="font-display text-xl font-semibold text-foreground">Kontaktovanie</h2>
              <p className="mt-3">
                Ak nás kontaktujete telefonicky alebo e-mailom, údaje uvedené vo vašej správe používame iba na vybavenie požiadavky, obchodnú komunikáciu a prípadnú prípravu spolupráce. Uchovávame ich len počas obdobia potrebného na tento účel alebo podľa zákonných povinností.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground">Návštevnosť stránky</h2>
              <p className="mt-3">
                Stránka môže používať anonymizovanú analytiku návštevnosti na pochopenie jej používania. Nepoužívame reklamné cookies ani nástroje na sledovanie návštevníkov naprieč webovými stránkami.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground">Vaše práva</h2>
              <p className="mt-3">
                V súvislosti s osobnými údajmi môžete požiadať o prístup, opravu, vymazanie alebo obmedzenie spracúvania a namietať proti spracúvaniu. Máte tiež právo obrátiť sa na Úrad na ochranu osobných údajov Slovenskej republiky.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-foreground">Kontakt</h2>
              <a
                href="mailto:stano@inoveron.com"
                className="mt-3 inline-flex items-center gap-2 font-semibold text-cyan transition-opacity hover:opacity-75"
              >
                <Mail className="size-4" />
                stano@inoveron.com
              </a>
            </section>
          </div>

          <p className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
            Posledná aktualizácia: 30. augusta 2026
          </p>
        </div>
      </article>
    </main>
  )
}
