'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

/**
 * A scroll-linked statement. Words gain contrast as the paragraph crosses the
 * viewport — motion that answers the scroll, rather than an entrance animation
 * repeated on every section.
 */
const LINE =
  'Most interfaces are slides. The good ones are surfaces — something you can push against, that pushes back, and that stays honest when you drag it faster than it expected.'

export function Statement() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.35'],
  })

  const words = LINE.split(' ')

  return (
    <section aria-label="Statement" className="relative py-[clamp(6rem,16vh,12rem)]">
      <div className="shell">
        <div ref={ref}>
          <p
            className="flex max-w-[19ch] flex-wrap gap-x-[0.28em] gap-y-1 text-[clamp(1.75rem,4.4vw,3.4rem)] leading-[1.08] tracking-[-0.035em] md:max-w-[24ch]"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 340 }}
          >
            {words.map((w, i) => {
              const start = i / words.length
              const end = start + 1 / words.length
              return (
                <Word
                  key={`${w}-${i}`}
                  progress={scrollYProgress}
                  range={[start, end]}
                >
                  {w}
                </Word>
              )
            })}
          </p>
        </div>
      </div>
    </section>
  )
}

function Word({
  children,
  progress,
  range,
}: {
  children: string
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  range: [number, number]
}) {
  const opacity = useTransform(progress, range, [0.18, 1])
  const y = useTransform(progress, range, [6, 0])

  return (
    <motion.span
      style={{ opacity, y, color: 'var(--color-bone)' }}
      className="inline-block"
    >
      {children}
    </motion.span>
  )
}
