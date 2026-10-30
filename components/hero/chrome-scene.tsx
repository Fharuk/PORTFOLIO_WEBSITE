'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, MeshDistortMaterial, Float } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Variant B — liquid chrome, in three dimensions.
 *
 * The distortion is a vertex displacement driven by noise, so the form is
 * genuinely moving geometry rather than a scrolling texture. Metalness 1 and
 * near-zero roughness mean everything you see is reflected environment — and
 * that environment is built from Lightformers, so it needs no HDR download.
 *
 * frames={1} bakes the environment once: it never changes, so re-rendering it
 * every frame would be pure waste.
 */
function Blob() {
  const group = useRef<THREE.Group>(null)

  useFrame(({ clock, pointer }) => {
    if (!group.current) return
    const t = clock.getElapsedTime()
    // pointer parallax, eased by the spring-like lerp
    group.current.rotation.y +=
      (pointer.x * 0.5 + Math.sin(t * 0.18) * 0.12 - group.current.rotation.y) * 0.035
    group.current.rotation.x +=
      (-pointer.y * 0.3 + Math.cos(t * 0.14) * 0.08 - group.current.rotation.x) * 0.035
  })

  return (
    <group ref={group} position={[1.15, 0.05, 0]}>
      <Float speed={1.1} rotationIntensity={0.2} floatIntensity={0.55}>
        <mesh>
          <icosahedronGeometry args={[1.42, 48]} />
          <MeshDistortMaterial
            distort={0.34}
            speed={1.25}
            metalness={1}
            roughness={0.055}
            color="#eef1f7"
            envMapIntensity={1.9}
          />
        </mesh>
      </Float>

      {/* two satellites: chrome needs something else to reflect */}
      <mesh position={[-2.35, 1.15, -0.6]}>
        <sphereGeometry args={[0.26, 48, 48]} />
        <meshStandardMaterial metalness={1} roughness={0.05} color="#dfe4ee" envMapIntensity={2} />
      </mesh>
      <mesh position={[-1.85, -1.3, 0.5]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial metalness={1} roughness={0.08} color="#f2e6d6" envMapIntensity={2} />
      </mesh>

      {/* a thin chrome torus, barely there */}
      <mesh rotation={[Math.PI / 2.6, 0.4, 0]} position={[0.2, -0.1, -0.9]}>
        <torusGeometry args={[2.15, 0.012, 12, 160]} />
        <meshStandardMaterial metalness={1} roughness={0.12} color="#c9d2e4" />
      </mesh>
    </group>
  )
}

export function ChromeScene() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 6.2], fov: 42 }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-5, -2, 3]} intensity={18} color="#8ab4ff" distance={18} />
      <pointLight position={[4, -3, 2]} intensity={10} color="#e7c9a4" distance={16} />

      <Blob />

      <Environment resolution={256} frames={1}>
        <color attach="background" args={['#05070f']} />
        {/* studio softboxes, described as geometry */}
        <Lightformer form="rect" intensity={5} position={[0, 4, -3]} scale={[10, 4, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={2.4} position={[-5, 1, 2]} scale={[5, 8, 1]} rotation={[0, Math.PI / 2, 0]} color="#a8c4ff" />
        <Lightformer form="rect" intensity={1.8} position={[5, -1, 1]} scale={[5, 8, 1]} rotation={[0, -Math.PI / 2, 0]} color="#ffd9a8" />
        <Lightformer form="circle" intensity={3} position={[2, -3.5, 2]} scale={3} color="#ffffff" />
        <Lightformer form="ring" intensity={2} position={[-2, 3, 3]} scale={4} color="#c9a3ff" />
      </Environment>
    </Canvas>
  )
}
