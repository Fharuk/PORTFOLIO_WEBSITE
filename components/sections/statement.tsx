'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { site } from '@/content/site'

/**
 * Scroll-linked statement. Words resolve as the paragraph crosses the viewport,
 * so the motion is answering the scroll rather than performing at the visitor.
 */
export function Statement() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.4'],
  })

  const text = site.positioning
  const words = text.split(' ')

  return (
    <section aria-label="Statement" className="relative py-[clamp(5rem,14vh,10rem)]">
      <div className="shell">
        <div ref={ref}>
          <p
            className="flex max-w-[20ch] flex-wrap gap-x-[0.26em] gap-y-1 text-[clamp(1.6rem,3.9vw,3.1rem)] leading-[1.1] tracking-[-0.035em] md:max-w-[26ch]"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 340 }}
          >
            {words.map((w, i) => {
              const start = i / words.length
              const end = start + 1 / words.length
              return (
                <Word key={`${w}-${i}`} progress={scrollYProgress} range={[start, end]}>
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
  const opacity = useTransform(progress, range, [0.16, 1])
  const y = useTransform(progress, range, [5, 0])

  return (
    <motion.span
      style={{ opacity, y, color: 'var(--color-bone)' }}
      className="inline-block"
    >
      {children}
    </motion.span>
  )
}
