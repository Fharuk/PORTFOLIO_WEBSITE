'use client'

import { useEffect, useRef, useState } from 'react'
import { fragmentShader, vertexShader } from '@/lib/shaders/liquid-metal'

type Props = {
  /** The word the metal is poured into. */
  text: string
  /** Fraction of canvas width the word occupies. */
  fit?: number
  className?: string
}

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)
  if (!s) return null
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error('[liquid-metal]', gl.getShaderInfoLog(s))
    gl.deleteShader(s)
    return null
  }
  return s
}

/** Paint the word into a 2D canvas so the shader has a mask to pour metal into. */
function paintMask(
  canvas: HTMLCanvasElement,
  text: string,
  fit: number,
  fontFamily: string,
) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const w = Math.max(1, Math.round(canvas.clientWidth * dpr))
  const h = Math.max(1, Math.round(canvas.clientHeight * dpr))

  const mask = document.createElement('canvas')
  mask.width = w
  mask.height = h
  const ctx = mask.getContext('2d')
  if (!ctx) return { mask, w, h }

  ctx.clearRect(0, 0, w, h)

  // Fit the word to the canvas by measuring at a reference size, then scaling.
  const ref = 200
  ctx.font = `700 ${ref}px ${fontFamily}`
  const m = ctx.measureText(text)
  const size = ((w * fit) / Math.max(m.width, 1)) * ref

  const asc = m.actualBoundingBoxAscent ?? ref * 0.72
  const desc = m.actualBoundingBoxDescent ?? ref * 0.12
  const totalH = ((asc + desc) / ref) * size
  ctx.font = `700 ${size}px ${fontFamily}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#fff'
  ctx.fillText(text, w / 2, h / 2 + totalH * 0.02)

  return { mask, w, h }
}

export function LiquidName({ text, fit = 0.9, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: 'high-performance',
    })
    if (!gl) return // CSS fallback stays visible

    const vs = compile(gl, gl.VERTEX_SHADER, vertexShader)
    const fs = compile(gl, gl.FRAGMENT_SHADER, fragmentShader)
    if (!vs || !fs) return

    const program = gl.createProgram()!
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('[liquid-metal] link', gl.getProgramInfoLog(program))
      return
    }
    gl.useProgram(program)

    // fullscreen triangle pair
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    )
    const loc = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const u = {
      mask: gl.getUniformLocation(program, 'uMask'),
      res: gl.getUniformLocation(program, 'uResolution'),
      ptr: gl.getUniformLocation(program, 'uPointer'),
      time: gl.getUniformLocation(program, 'uTime'),
      progress: gl.getUniformLocation(program, 'uProgress'),
      aspect: gl.getUniformLocation(program, 'uAspect'),
    }

    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.uniform1i(u.mask, 0)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.max(1, Math.round(canvas!.clientWidth * dpr))
      const h = Math.max(1, Math.round(canvas!.clientHeight * dpr))
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w
        canvas!.height = h
      }
      gl!.viewport(0, 0, w, h)

      const { mask } = paintMask(
        canvas!,
        text,
        fit,
        "'Bricolage Grotesque Variable', system-ui, sans-serif",
      )
      gl!.bindTexture(gl!.TEXTURE_2D, texture!)
      gl!.texImage2D(
        gl!.TEXTURE_2D,
        0,
        gl!.RGBA,
        gl!.RGBA,
        gl!.UNSIGNED_BYTE,
        mask,
      )
      gl!.uniform2f(u.res, w, h)
      gl!.uniform1f(u.aspect, w / h)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    let raf = 0
    let running = true
    let start = performance.now()
    let elapsed = 0
    let visible = true

    function frame(now: number) {
      if (!running) return
      if (!visible) {
        raf = requestAnimationFrame(frame)
        return
      }
      if (!reduce) elapsed = (now - start) / 1000

      pointer.x += (pointer.tx - pointer.x) * 0.045
      pointer.y += (pointer.ty - pointer.y) * 0.045

      const progress = reduce ? 1 : Math.min(1, elapsed / 1.15)

      gl!.uniform1f(u.time, elapsed)
      gl!.uniform2f(u.ptr, pointer.x, pointer.y)
      gl!.uniform1f(u.progress, progress)
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4)
      raf = requestAnimationFrame(frame)
    }

    function onPointer(e: PointerEvent) {
      const r = canvas!.getBoundingClientRect()
      pointer.tx = ((e.clientX - r.left) / r.width) * 2 - 1
      pointer.ty = -(((e.clientY - r.top) / r.height) * 2 - 1)
    }

    function onVisibility() {
      visible = document.visibilityState === 'visible'
      if (visible) start = performance.now() - elapsed * 1000
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        const was = visible
        visible = entry.isIntersecting && document.visibilityState === 'visible'
        if (!was && visible) start = performance.now() - elapsed * 1000
      },
      { threshold: 0.01 },
    )
    io.observe(canvas)

    // Fonts must be resolved before the mask is painted, or we bake the
    // fallback face into the texture. `fonts.ready` only waits on *pending*
    // loads, so request the face explicitly first.
    const loadFont: Promise<unknown> =
      typeof document !== 'undefined' && 'fonts' in document
        ? Promise.all([
            document.fonts.load("700 200px 'Bricolage Grotesque Variable'"),
            document.fonts.ready,
          ]).catch(() => undefined)
        : Promise.resolve()

    loadFont.then(() => {
      resize()
      setReady(true)
      raf = requestAnimationFrame(frame)
    })

    window.addEventListener('pointermove', onPointer, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('visibilitychange', onVisibility)
      gl.deleteProgram(program)
      gl.deleteBuffer(buf)
      gl.deleteTexture(texture)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [text, fit])

  return (
    <div className={className}>
      {/* The real heading lives in the accessibility tree; the canvas is the artwork. */}
      <h1 className="sr-only">{text}</h1>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="block h-full w-full"
        style={{
          opacity: ready ? 1 : 0,
          transition: 'opacity 600ms var(--ease-out-quint)',
        }}
      />
      {/* No-WebGL fallback: gradient-clipped type, same silhouette.
          Kept mounted and faded out so the swap to the shader is invisible. */}
      <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          style={{
            opacity: ready ? 0 : 1,
            transition: 'opacity 500ms var(--ease-out-quint)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(3rem, 17vw, 17rem)',
              letterSpacing: '-0.05em',
              backgroundImage:
                'linear-gradient(96deg,#f3f0e7 0%,#9fb4d8 26%,#3d4a6b 52%,#e7c9a4 74%,#f3f0e7 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {text}
        </span>
      </div>
    </div>
  )
}
