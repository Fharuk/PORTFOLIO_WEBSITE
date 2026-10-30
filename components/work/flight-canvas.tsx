'use client'

import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * The flight, rebuilt procedurally.
 *
 * oso95/scroll-world drives a pre-rendered video chain with scroll position.
 * That approach needs paid AI video per project, so the same *camera* idea is
 * built here out of geometry instead: one CatmullRomCurve3, one camera, and
 * scroll mapped to arc length. There are no cuts because there is only one
 * continuous move — every "scene" is a station along the same spline.
 *
 * Scroll only ever drives time. The camera does the flying.
 */

const PATH_POINTS = [
  [0, 0.1, 7],
  [1.1, 0.55, -1],
  [-0.9, 0.15, -10],
  [1.3, -0.7, -19],
  [-1.0, 0.85, -28],
  [0.6, -0.2, -37],
  [-0.4, 0.4, -46],
  [0, 0, -54],
] as const

const STATIONS = [0.012, 0.26, 0.5, 0.735, 0.975]

function usePath() {
  return useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        PATH_POINTS.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
        false,
        'catmullrom',
        0.5,
      ),
    [],
  )
}

/** Drives the camera from a smoothed scroll value. */
function CameraRig({ progress }: { progress: React.RefObject<number> }) {
  const path = usePath()
  const { camera } = useThree()
  const look = useRef(new THREE.Vector3())
  const pos = useRef(new THREE.Vector3())

  useFrame(() => {
    const p = THREE.MathUtils.clamp(progress.current ?? 0, 0, 1)
    const eased = p * p * (3 - 2 * p) * 0.35 + p * 0.65 // gentle flatten at both ends
    path.getPointAt(Math.min(eased, 0.9995), pos.current)
    path.getPointAt(Math.min(eased + 0.035, 1), look.current)

    camera.position.lerp(pos.current, 0.18)
    // a slow roll keeps the horizon alive without ever fighting the user
    camera.rotation.z = Math.sin(p * Math.PI * 2.2) * 0.09
    camera.lookAt(look.current)
  })
  return null
}

/** The portals. Flying through these is what makes it read as one world. */
function Rings() {
  const path = usePath()
  const ring = useRef<THREE.Group>(null)

  const stations = useMemo(
    () =>
      STATIONS.map((t, i) => {
        const p = path.getPointAt(t)
        const tan = path.getTangentAt(Math.min(t + 0.01, 1)).normalize()
        const look = p.clone().add(tan)
        const colors = ['#8ab4ff', '#c9a3ff', '#ffcf8a', '#7de2c4', '#f3f0e7']
        return { p, look, color: colors[i % colors.length], i }
      }),
    [path],
  )

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (!ring.current) return
    ring.current.children.forEach((child, i) => {
      child.rotation.z = t * 0.12 * (i % 2 === 0 ? 1 : -1) + i
      const s = 1 + Math.sin(t * 0.7 + i) * 0.012
      child.scale.setScalar(s)
    })
  })

  return (
    <group ref={ring}>
      {stations.map((s) => (
        <group
          key={s.i}
          position={s.p}
          onUpdate={(g) => g.lookAt(s.look)}
        >
          <mesh>
            <torusGeometry args={[2.35, 0.012, 8, 128]} />
            <meshBasicMaterial color={s.color} toneMapped={false} />
          </mesh>
          <mesh>
            <torusGeometry args={[2.75, 0.004, 6, 128]} />
            <meshBasicMaterial
              color={s.color}
              transparent
              opacity={0.22}
              toneMapped={false}
            />
          </mesh>
          {/* tick marks: the ring reads as an instrument, not a decorative hoop */}
          {Array.from({ length: 12 }).map((_, k) => {
            const a = (k / 12) * Math.PI * 2
            return (
              <mesh
                key={k}
                position={[Math.cos(a) * 2.55, Math.sin(a) * 2.55, 0]}
                rotation={[0, 0, a]}
              >
                <boxGeometry args={[0.09, 0.004, 0.004]} />
                <meshBasicMaterial color={s.color} transparent opacity={0.5} toneMapped={false} />
              </mesh>
            )
          })}
        </group>
      ))}
    </group>
  )
}

/** Parallax dust. Without it the move has no speed. */
function Dust({ count = 1800 }: { count?: number }) {
  const points = useRef<THREE.Points>(null)

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const scale = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      // a loose tube around the flight path
      const r = 2.6 + Math.random() * 9
      const a = Math.random() * Math.PI * 2
      pos[i * 3] = Math.cos(a) * r
      pos[i * 3 + 1] = Math.sin(a) * r * 0.7
      pos[i * 3 + 2] = 10 - Math.random() * 72
      scale[i] = 0.4 + Math.random()
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aScale', new THREE.BufferAttribute(scale, 1))
    return g
  }, [count])

  useFrame(({ clock }) => {
    if (points.current) points.current.rotation.z = clock.getElapsedTime() * 0.006
  })

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        size={0.045}
        sizeAttenuation
        color="#9fb4d8"
        transparent
        opacity={0.55}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  )
}

/** A wireframe shelf of slabs — the "work" you fly past. */
function Slabs() {
  const items = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => {
        const along = 12 - (i / 21) * 62
        const side = i % 2 === 0 ? -1 : 1
        return {
          pos: [side * (3.4 + (i % 3) * 1.5), ((i * 37) % 7) / 7 - 0.5, along] as [
            number,
            number,
            number,
          ],
          rot: [((i * 13) % 6) / 6, ((i * 29) % 8) / 8, ((i * 7) % 5) / 5] as [
            number,
            number,
            number,
          ],
          size: [1.4 + (i % 4) * 0.45, 0.9 + (i % 3) * 0.35, 0.02] as [
            number,
            number,
            number,
          ],
        }
      }),
    [],
  )

  return (
    <group>
      {items.map((it, i) => (
        <mesh key={i} position={it.pos} rotation={it.rot}>
          <boxGeometry args={it.size} />
          <meshBasicMaterial
            color={i % 4 === 0 ? '#7de2c4' : '#5d6b8f'}
            wireframe
            transparent
            opacity={i % 4 === 0 ? 0.42 : 0.28}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}

/** Convergence point the whole flight lands on. */
function Core() {
  const core = useRef<THREE.Mesh>(null)
  const halo = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (core.current) {
      core.current.rotation.y = t * 0.25
      core.current.rotation.x = t * 0.16
    }
    if (halo.current) halo.current.scale.setScalar(1 + Math.sin(t * 1.1) * 0.04)
  })
  return (
    <group position={[0, 0, -54]}>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.9, 1]} />
        <meshBasicMaterial color="#f3f0e7" wireframe toneMapped={false} />
      </mesh>
      <mesh ref={halo}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshBasicMaterial color="#8ab4ff" wireframe transparent opacity={0.14} toneMapped={false} />
      </mesh>
      <pointLight color="#8ab4ff" intensity={9} distance={16} />
    </group>
  )
}

export function FlightCanvas({
  progress,
  quality,
}: {
  progress: React.RefObject<number>
  quality: 'low' | 'high'
}) {
  return (
    <Canvas
      dpr={[1, quality === 'high' ? 1.75 : 1.25]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.NoToneMapping,
      }}
      camera={{ fov: 58, near: 0.1, far: 160, position: [0, 0, 7] }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <fogExp2 attach="fog" args={['#05070f', 0.031]} />
      <ambientLight intensity={0.4} />
      <CameraRig progress={progress} />
      <Rings />
      <Dust count={quality === 'high' ? 2400 : 900} />
      <Slabs />
      <Core />
    </Canvas>
  )
}
