import Image from 'next/image'
import { site } from '@/content/site'

export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="section">
      <div className="shell">
        <div className="grid gap-[clamp(2.5rem,6vw,5rem)] md:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          {/* Portrait */}
          <div className="md:sticky md:top-28 md:self-start">
            <div className="portrait-frame w-full max-w-[24rem]">
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/portrait.jpg`}
                alt={`${site.fullName}, ${site.role}`}
                width={661}
                height={1176}
                priority
                sizes="(max-width: 768px) 80vw, 24rem"
                className="h-auto w-full object-cover"
                style={{ aspectRatio: '661 / 900', objectPosition: '50% 22%' }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
                style={{
                  background:
                    'linear-gradient(to top, rgba(4,6,14,0.72), transparent)',
                }}
              />
            </div>

            <div className="mt-5 max-w-[24rem]">
              <p className="text-[1.0625rem] text-[var(--color-bone)]">{site.fullName}</p>
              <p className="mt-1 text-[0.875rem] leading-relaxed text-[var(--color-haze)]">
                {site.discipline}
                <br />
                {site.location}
              </p>
            </div>
          </div>

          {/* Copy */}
          <div className="flex flex-col gap-10">
            <div>
              <h2 id="about-heading" className="h2">
                One foundation.
                <br />
                Several ways to contribute.
              </h2>
            </div>

            <div className="flex flex-col gap-5">
              {site.about.map((p, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? 'max-w-[56ch] text-[clamp(1.0625rem,1rem+0.4vw,1.28rem)] leading-[1.55] text-[var(--color-bone)]'
                      : 'prose'
                  }
                >
                  {p}
                </p>
              ))}
            </div>

            <blockquote className="relative m-0 max-w-[52ch] border-l-2 pl-5" style={{ borderColor: 'var(--accent)' }}>
              <p
                className="text-[clamp(1.05rem,1.4vw,1.3rem)] leading-snug text-[var(--color-bone)]"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 350 }}
              >
                {site.principle}
              </p>
              <footer className="mt-2 text-[0.8125rem] not-italic text-[var(--color-haze)]">
                My working principle
              </footer>
            </blockquote>

            <hr className="rule" />

            <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {site.pillars.map((c) => (
                <div key={c.title} className="flex flex-col gap-2">
                  <dt className="h3">{c.title}</dt>
                  <dd className="m-0 text-[0.9375rem] leading-relaxed text-[var(--color-haze)]">
                    {c.body}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
