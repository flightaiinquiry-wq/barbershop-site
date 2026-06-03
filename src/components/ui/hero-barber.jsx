import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as THREE from 'three/webgpu'
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode.js'
import { pass } from 'three/tsl'
import './hero-barber.css'

extend(THREE)

// ── Bloom post-processing ─────────────────────────────────────────────────
function PostProcessing({ strength = 1.0, threshold = 0.8 }) {
  const { gl, scene, camera } = useThree()

  const render = useMemo(() => {
    const pp        = new THREE.PostProcessing(gl)
    const scenePass = pass(scene, camera)
    const sceneColor = scenePass.getTextureNode('output')
    const bloomPass  = bloom(sceneColor, strength, 0.5, threshold)
    pp.outputNode    = sceneColor.add(bloomPass)
    return pp
  }, [camera, gl, scene, strength, threshold])

  useFrame(() => { render.renderAsync() }, 1)
  return null
}

// ── Procedural Hair Clipper ───────────────────────────────────────────────
function Clipper() {
  const groupRef = useRef()

  useFrame(({ clock, pointer }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    // Gentle float
    groupRef.current.position.y = Math.sin(t * 0.7) * 0.09
    // Slow auto-rotation + mouse tilt
    groupRef.current.rotation.y = t * 0.38 + pointer.x * 0.35
    groupRef.current.rotation.x = -0.12 + pointer.y * 0.18
  })

  // ── Shared materials ──
  const bodyMat   = <meshStandardMaterial color="#0e0d0a" roughness={0.88} metalness={0.15} />
  const goldMat   = <meshStandardMaterial color="#CA8A04" roughness={0.18} metalness={0.95} emissive="#4A2E00" emissiveIntensity={0.4} />
  const brightMat = <meshStandardMaterial color="#D4AF37" roughness={0.05} metalness={1.0}  emissive="#7A5200" emissiveIntensity={0.7} />
  const teethMat  = <meshStandardMaterial color="#F5C842" roughness={0.02} metalness={1.0}  emissive="#9A6800" emissiveIntensity={1.2} />
  const ledMat    = <meshStandardMaterial color="#FFD700" roughness={0.1}  metalness={0.4}  emissive="#CA8A04" emissiveIntensity={4.0} />
  const accentMat = <meshStandardMaterial color="#CA8A04" roughness={0.35} metalness={0.8}  emissive="#2A1800" emissiveIntensity={0.3} />

  // ── Blade teeth — 12 evenly-spaced teeth ──
  const teethCount = 12
  const teethSpan  = 0.58
  const toothW     = 0.032
  const teeth      = Array.from({ length: teethCount }, (_, i) => {
    const x = -teethSpan / 2 + (i / (teethCount - 1)) * teethSpan
    return (
      <mesh key={i} position={[x, 1.28, 0.04]}>
        <boxGeometry args={[toothW, 0.13, 0.22]} />
        {teethMat}
      </mesh>
    )
  })

  // ── Grip ridges — 4 rings around body ──
  const ridgeYPositions = [-0.62, -0.30, 0.02, 0.34]
  const ridges = ridgeYPositions.map((y, i) => (
    <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.315 + i * 0.004, 0.011, 8, 32]} />
      {accentMat}
    </mesh>
  ))

  return (
    <>
      {/* ── Lighting ── */}
      <ambientLight intensity={0.25} color="#FFD580" />
      {/* Key light — catches blade reflections */}
      <spotLight
        position={[2.5, 4, 2.5]} intensity={60} color="#D4AF37"
        angle={0.4} penumbra={0.6} castShadow
      />
      {/* Fill from left */}
      <pointLight position={[-3, 2, 1]} intensity={12} color="#CA8A04" />
      {/* Rim from behind */}
      <pointLight position={[0, -2, -3]} intensity={8} color="#8B5E00" />
      {/* LED glow point */}
      <pointLight position={[0, 0.28, 0.6]} intensity={6} color="#FFD700" distance={1.5} />

      <group ref={groupRef}>

        {/* 1 ── MAIN GRIP BODY — tapered cylinder, wide at base */}
        <mesh position={[0, -0.1, 0]} castShadow>
          <cylinderGeometry args={[0.265, 0.34, 1.85, 24, 1]} />
          {bodyMat}
        </mesh>

        {/* 2 ── UPPER NECK — narrows toward blade housing */}
        <mesh position={[0, 0.88, 0]}>
          <cylinderGeometry args={[0.24, 0.265, 0.18, 24]} />
          {bodyMat}
        </mesh>

        {/* 3 ── BLADE HOUSING BASE — dark gold rectangular block */}
        <mesh position={[0, 1.03, 0]}>
          <boxGeometry args={[0.64, 0.18, 0.30]} />
          {goldMat}
        </mesh>

        {/* 4 ── BLADE PLATE — bright metallic face */}
        <mesh position={[0, 1.15, 0.025]}>
          <boxGeometry args={[0.60, 0.075, 0.24]} />
          {brightMat}
        </mesh>

        {/* 5 ── BLADE TEETH — 12 individual teeth */}
        {teeth}

        {/* 6 ── INNER MOVING BLADE (offset row, slightly recessed) */}
        {Array.from({ length: 11 }, (_, i) => {
          const x = -0.52 / 2 + (i / 10) * 0.52
          return (
            <mesh key={i} position={[x, 1.20, -0.04]}>
              <boxGeometry args={[0.028, 0.08, 0.18]} />
              {brightMat}
            </mesh>
          )
        })}

        {/* 7 ── POWER BUTTON — glowing gold LED disc */}
        <mesh position={[0, 0.28, 0.345]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.052, 0.052, 0.018, 20]} />
          {ledMat}
        </mesh>

        {/* 8 ── POWER BUTTON RING — chrome ring around LED */}
        <mesh position={[0, 0.28, 0.338]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.065, 0.009, 10, 28]} />
          {accentMat}
        </mesh>

        {/* 9 ── GRIP RIDGES — 4 bands for texture */}
        {ridges}

        {/* 10 ── BRAND STRIPE — thin gold bar on lower body */}
        <mesh position={[0, -0.68, 0.348]}>
          <boxGeometry args={[0.22, 0.028, 0.008]} />
          {accentMat}
        </mesh>

        {/* 11 ── BOTTOM CAP — rounded base */}
        <mesh position={[0, -1.025, 0]}>
          <cylinderGeometry args={[0.34, 0.30, 0.06, 24]} />
          {accentMat}
        </mesh>

        {/* 12 ── SIDE VENT SLITS — small detail lines */}
        {[-0.08, 0, 0.08].map((z, i) => (
          <mesh key={i} position={[0.35, -0.45 + i * 0.1, z]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.006, 0.12, 0.015]} />
            {accentMat}
          </mesh>
        ))}

      </group>
    </>
  )
}

// ── Text overlay ──────────────────────────────────────────────────────────
function Overlay({ onComplete }) {
  const [nameIn, setNameIn] = useState(false)
  const [subIn,  setSubIn]  = useState(false)
  const [btnIn,  setBtnIn]  = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setNameIn(true),  500)
    const t2 = setTimeout(() => setSubIn(true),  1200)
    const t3 = setTimeout(() => setBtnIn(true),  2000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  useEffect(() => {
    const t = setTimeout(onComplete, 8000)
    return () => clearTimeout(t)
  }, [onComplete])

  return (
    <div className="hb-overlay">
      <div className={`hb-brand-name ${nameIn ? 'hb-in' : ''}`}>OBSIDIAN</div>
      <div className={`hb-brand-sub  ${subIn  ? 'hb-in' : ''}`}>BARBERSHOP</div>
      {btnIn && (
        <motion.button className="hb-btn"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }} onClick={onComplete}
        >
          Enter
        </motion.button>
      )}
    </div>
  )
}

// ── Fallback (no WebGPU) ──────────────────────────────────────────────────
function Fallback({ onComplete }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 3000)
    return () => clearTimeout(t)
  }, [onComplete])

  return (
    <motion.div className="hb-fallback"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div style={{ textAlign: 'center' }}>
        <div className="hb-fb-brand">OBSIDIAN</div>
        <div className="hb-fb-sub-brand">BARBERSHOP</div>
      </div>
    </motion.div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────
export default function BarberIntro({ onComplete }) {
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    if (!navigator.gpu) { setStatus('fallback'); return }
    navigator.gpu.requestAdapter()
      .then(a => setStatus(a ? 'ok' : 'fallback'))
      .catch(() => setStatus('fallback'))
  }, [])

  if (status === 'checking') return null
  if (status === 'fallback') return <Fallback onComplete={onComplete} />

  return (
    <div className="hb-root">
      <Overlay onComplete={onComplete} />
      <Canvas
        flat
        className="hb-canvas"
        camera={{ position: [0, 0.1, 3.8], fov: 40 }}
        shadows
        gl={async (props) => {
          const r = new THREE.WebGPURenderer({ ...props, antialias: true })
          await r.init()
          return r
        }}
      >
        <PostProcessing strength={1.0} threshold={0.8} />
        <Clipper />
      </Canvas>
    </div>
  )
}
