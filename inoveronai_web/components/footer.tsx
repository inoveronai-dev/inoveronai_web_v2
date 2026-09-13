
const links = [
  { label: 'Služby', href: '#services' },
  { label: 'Proces', href: '#process' },
  { label: 'O nás', href: '#about' },
  { label: 'Ochrana súkromia', href: '/ochrana-sukromia' },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 py-10 sm:flex-row sm:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="Inoveron AI"
            className="size-9 rounded-xl object-cover"
          />
        </a>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="text-center text-xs leading-relaxed text-muted-foreground sm:text-right">
          <p>© 2026 Inoveron Automations. Všetky práva vyhradené.</p>
          <a href="mailto:stano@inoveron.com" className="transition-colors hover:text-cyan">
            stano@inoveron.com
          </a>
        </div>
      </div>
    </footer>
  )
}
