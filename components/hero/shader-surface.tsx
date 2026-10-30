'use client'

import { useEffect, useRef } from 'react'

const VERT = /* glsl */ `#version 300 es
precision highp float;
in vec2 a_position;
out vec2 vUv;
void main() {
  vUv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`

type Props = {
  fragment: string
  className?: string
  style?: React.CSSProperties
}

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)
  if (!s) return null
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error('[shader-surface]', gl.getShaderInfoLog(s))
    gl.deleteShader(s)
    return null
  }
  return s
}

/**
 * One fullscreen fragment shader, correctly wired.
 *
 * Shared by the flux and energy heroes so the WebGL boilerplate — context loss,
 * DPR capping, off-screen pause, reduced motion, pointer easing — exists once.
 * Every surface degrades to the CSS field painted behind it.
 */
export function ShaderSurface({ fragment, className, style }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    })
    if (!gl) return

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, fragment)
    if (!vs || !fs) return

    const program = gl.createProgram()!
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('[shader-surface] link', gl.getProgramInfoLog(program))
      return
    }
    gl.useProgram(program)

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

    const uRes = gl.getUniformLocation(program, 'uResolution')
    const uTime = gl.getUniformLocation(program, 'uTime')
    const uPtr = gl.getUniformLocation(program, 'uPointer')
    const uScroll = gl.getUniformLocation(program, 'uScroll')

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
    let scroll = 0

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.max(1, Math.round(canvas!.clientWidth * dpr))
      const h = Math.max(1, Math.round(canvas!.clientHeight * dpr))
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w
        canvas!.height = h
      }
      gl!.viewport(0, 0, w, h)
      gl!.uniform2f(uRes, w, h)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    let raf = 0
    let running = true
    let visible = true
    let elapsed = 0
    let start = performance.now()

    function frame(now: number) {
      if (!running) return
      if (!visible) {
        raf = requestAnimationFrame(frame)
        return
      }
      if (!reduce) elapsed = (now - start) / 1000
      pointer.x += (pointer.tx - pointer.x) * 0.04
      pointer.y += (pointer.ty - pointer.y) * 0.04

      gl!.uniform1f(uTime, elapsed)
      gl!.uniform2f(uPtr, pointer.x, pointer.y)
      gl!.uniform1f(uScroll, scroll)
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    function onPointer(e: PointerEvent) {
      const r = canvas!.getBoundingClientRect()
      pointer.tx = ((e.clientX - r.left) / r.width) * 2 - 1
      pointer.ty = -(((e.clientY - r.top) / r.height) * 2 - 1)
    }
    function onScroll() {
      scroll = Math.min(1, window.scrollY / Math.max(1, window.innerHeight))
    }
    function onVisibility() {
      const was = visible
      visible = document.visibilityState === 'visible'
      if (!was && visible) start = performance.now() - elapsed * 1000
    }
    const io = new IntersectionObserver(
      ([e]) => {
        const was = visible
        visible = e.isIntersecting && document.visibilityState === 'visible'
        if (!was && visible) start = performance.now() - elapsed * 1000
      },
      { threshold: 0.01 },
    )
    io.observe(canvas)

    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisibility)
      gl.deleteProgram(program)
      gl.deleteBuffer(buf)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [fragment])

  return <canvas ref={canvasRef} aria-hidden="true" className={className} style={style} />
}
