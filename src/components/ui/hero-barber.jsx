import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as THREE from 'three/webgpu'
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode.js'
import { pass } from 'three/tsl'
import './hero-barber.css'

extend(THREE)

// ── Bloom ─────────────────────────────────────────────────────────────────
function PostProcessing({ strength = 0.9, threshold = 0.7 }) {
  const { gl, scene, camera } = useThree()
  const render = useMemo(() => {
    const pp         = new THREE.PostProcessing(gl)
    const scenePass  = pass(scene, camera)
    const sceneColor = scenePass.getTextureNode('output')
    const bloomPass  = bloom(sceneColor, strength, 0.5, threshold)
    pp.outputNode    = sceneColor.add(bloomPass)
    return pp
  }, [camera, gl, scene, strength, threshold])
  useFrame(() => { render.renderAsync() }, 1)
  return null
}

// ── Procedural Trimmer ────────────────────────────────────────────────────
function Trimmer() {
  const groupRef = useRef()

  useFrame(({ clock, pointer }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    groupRef.current.position.y = Math.sin(t * 0.65) * 0.06
    groupRef.current.rotation.y = t * 0.28 + pointer.x * 0.3
    groupRef.current.rotation.x = pointer.y * 0.12
  })

  // ── Body profile via LatheGeometry ──
  // Matches the organic ergonomic shape: narrow neck → swells into body → tapers to grip
  const bodyPoints = useMemo(() => [
    new THREE.Vector2(0.165, 1.08),  // narrow neck at top
    new THREE.Vector2(0.200, 0.90),
    new THREE.Vector2(0.245, 0.68),  // shoulder bulge
    new THREE.Vector2(0.265, 0.42),  // widest
    new THREE.Vector2(0.260, 0.18),
    new THREE.Vector2(0.245, 0.00),
    new THREE.Vector2(0.232, -0.18), // bottom of ergonomic section
  ], [])

  // Grip profile — uniform cylinder, slightly wider than body base
  const gripPoints = useMemo(() => [
    new THREE.Vector2(0.232, -0.18),
    new THREE.Vector2(0.235, -0.22),
    new THREE.Vector2(0.235, -0.95),
    new THREE.Vector2(0.230, -1.00),
  ], [])

  // ── Materials ──
  const matBody   = { color: '#2A2A22', roughness: 0.88, metalness: 0.12 }
  const matGrip   = { color: '#1E1E18', roughness: 0.95, metalness: 0.05 }
  const matBlade  = { color: '#3A3A30', roughness: 0.25, metalness: 0.85 }
  const matTeeth  = { color: '#2E2E26', roughness: 0.18, metalness: 0.90,
                      emissive: '#CA8A04', emissiveIntensity: 0.15 }
  const matGold   = { color: '#CA8A04', roughness: 0.18, metalness: 0.92,
                      emissive: '#7A4E00', emissiveIntensity: 0.8 }
  const matLED    = { color: '#F5C842', roughness: 0.08, metalness: 0.40,
                      emissive: '#CA8A04', emissiveIntensity: 5.0 }
  const matBadge  = { color: '#CA8A04', roughness: 0.12, metalness: 0.96,
                      emissive: '#6A4200', emissiveIntensity: 0.8 }
  const matScrew  = { color: '#D4AF37', roughness: 0.08, metalness: 1.00,
                      emissive: '#9A6800', emissiveIntensity: 1.0 }
  const matCap    = { color: '#252520', roughness: 0.75, metalness: 0.25 }
  const matBand   = { color: '#CA8A04', roughness: 0.22, metalness: 0.92,
                      emissive: '#5A3800', emissiveIntensity: 0.6 }

  // ── T-blade teeth (28 teeth, very fine) ──
  const teethCount = 28
  const teethSpan  = 0.70
  const teeth = useMemo(() => Array.from({ length: teethCount }, (_, i) => {
    const x = -teethSpan / 2 + (i / (teethCount - 1)) * teethSpan
    return { x, key: i }
  }), [])

  // ── Grip horizontal ridge rings (simulate knurling rows) ──
  const ridgeCount = 22
  const ridges = useMemo(() => Array.from({ length: ridgeCount }, (_, i) => {
    const y = -0.25 - (i / (ridgeCount - 1)) * 0.72
    return { y, key: i }
  }), [])

  // ── LED display segments (simulate 7-segment digits) ──
  const ledSegments = [
    // First digit "6" approximation - horizontal bars
    { pos: [-0.045,  0.038, 0], size: [0.055, 0.008, 0.002] },
    { pos: [-0.045,  0.000, 0], size: [0.055, 0.008, 0.002] },
    { pos: [-0.045, -0.038, 0], size: [0.055, 0.008, 0.002] },
    { pos: [-0.073,  0.019, 0], size: [0.008, 0.028, 0.002] },
    { pos: [-0.073, -0.019, 0], size: [0.008, 0.028, 0.002] },
    { pos: [-0.017, -0.019, 0], size: [0.008, 0.028, 0.002] },
    // Second digit "5"
    { pos: [ 0.045,  0.038, 0], size: [0.055, 0.008, 0.002] },
    { pos: [ 0.045,  0.000, 0], size: [0.055, 0.008, 0.002] },
    { pos: [ 0.045, -0.038, 0], size: [0.055, 0.008, 0.002] },
    { pos: [ 0.017,  0.019, 0], size: [0.008, 0.028, 0.002] },
    { pos: [ 0.073, -0.019, 0], size: [0.008, 0.028, 0.002] },
  ]

  return (
    <>
      {/* ── Lighting ── */}
      {/* Strong ambient so dark body is visible */}
      <ambientLight intensity={2.5} color="#FFE090" />
      {/* Key light — top right, catches blade and badge reflections */}
      <directionalLight position={[3, 6, 4]} intensity={4.0} color="#FFFFFF" castShadow />
      {/* Gold fill from left */}
      <pointLight position={[-3, 2, 2]} intensity={80} color="#CA8A04" />
      {/* Front fill so the face of the trimmer reads clearly */}
      <pointLight position={[0, 0, 5]} intensity={60} color="#FFF5D0" />
      {/* Rim light from behind */}
      <pointLight position={[1, -1, -3]} intensity={30} color="#8B5E00" />
      {/* LED glow */}
      <pointLight position={[0.3, -0.7, 0.6]} intensity={12} color="#D4AF37" distance={1.2} />
      {/* Power button glow */}
      <pointLight position={[0.35, 0.1, 0.55]} intensity={10} color="#FFD700" distance={0.8} />

      {/* ── Whole trimmer — slightly smaller ── */}
      <group ref={groupRef} scale={[0.82, 0.82, 0.82]} position={[0, -0.18, 0]}>

        {/* ══ 1. ERGONOMIC BODY (LatheGeometry) ══ */}
        <mesh castShadow>
          <latheGeometry args={[bodyPoints, 28]} />
          <meshStandardMaterial {...matBody} />
        </mesh>

        {/* ══ 2. GRIP (LatheGeometry — uniform cylinder with knurling) ══ */}
        <mesh castShadow>
          <latheGeometry args={[gripPoints, 28]} />
          <meshStandardMaterial {...matGrip} />
        </mesh>

        {/* ══ 3. KNURLING RINGS — horizontal ridges to imply diamond texture ══ */}
        {ridges.map(({ y, key }) => (
          <mesh key={key} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.237, 0.0035, 5, 32]} />
            <meshStandardMaterial color="#1A1A12" roughness={0.6} metalness={0.4}
              emissive="#100E00" emissiveIntensity={0.1} />
          </mesh>
        ))}

        {/* ══ 4. T-BLADE BRACKET — left arm ══ */}
        <mesh position={[-0.28, 1.21, -0.01]} castShadow>
          <boxGeometry args={[0.055, 0.24, 0.10]} />
          <meshStandardMaterial {...matBlade} />
        </mesh>
        {/* T-BLADE BRACKET — right arm */}
        <mesh position={[0.28, 1.21, -0.01]} castShadow>
          <boxGeometry args={[0.055, 0.24, 0.10]} />
          <meshStandardMaterial {...matBlade} />
        </mesh>

        {/* ══ 5. T-BLADE HORIZONTAL BAR ══ */}
        <mesh position={[0, 1.35, -0.01]} castShadow>
          <boxGeometry args={[0.74, 0.065, 0.12]} />
          <meshStandardMaterial {...matBlade} />
        </mesh>

        {/* ══ 6. BLADE TEETH — 28 fine teeth along bottom of T-bar ══ */}
        {teeth.map(({ x, key }) => (
          <mesh key={key} position={[x, 1.27, 0.02]}>
            <boxGeometry args={[0.018, 0.078, 0.09]} />
            <meshStandardMaterial {...matTeeth} />
          </mesh>
        ))}

        {/* ══ 7. INNER BLADE (slightly offset, recessed) ══ */}
        {Array.from({ length: 24 }, (_, i) => {
          const x = -0.60 / 2 + (i / 23) * 0.60
          return (
            <mesh key={i} position={[x, 1.265, -0.01]}>
              <boxGeometry args={[0.015, 0.055, 0.07]} />
              <meshStandardMaterial {...matBlade} />
            </mesh>
          )
        })}

        {/* ══ 8. BLADE MOUNT — base where bracket meets body ══ */}
        <mesh position={[0, 1.10, 0]}>
          <boxGeometry args={[0.40, 0.055, 0.145]} />
          <meshStandardMaterial color="#141410" roughness={0.5} metalness={0.6} />
        </mesh>

        {/* ══ 9. BADGE PLATE ══ */}
        <mesh position={[0, 0.32, 0.268]}>
          <boxGeometry args={[0.28, 0.060, 0.008]} />
          <meshStandardMaterial {...matBadge} />
        </mesh>
        {/* Badge rounded ends (left & right caps) */}
        <mesh position={[-0.14, 0.32, 0.268]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.030, 0.030, 0.008, 14]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial {...matBadge} />
        </mesh>
        <mesh position={[0.14, 0.32, 0.268]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.030, 0.030, 0.008, 14]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial {...matBadge} />
        </mesh>
        {/* Badge screws — left */}
        <mesh position={[-0.125, 0.32, 0.274]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.01, 12]} />
          <meshStandardMaterial {...matScrew} />
        </mesh>
        {/* Badge screws — right */}
        <mesh position={[0.125, 0.32, 0.274]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.01, 12]} />
          <meshStandardMaterial {...matScrew} />
        </mesh>

        {/* ══ 10. POWER BUTTON (round, prominent) ══ */}
        <mesh position={[0.26, 0.08, 0.12]} rotation={[0, -Math.PI / 4, 0]}>
          <cylinderGeometry args={[0.048, 0.048, 0.022, 20]} />
          <meshStandardMaterial {...matLED} />
        </mesh>
        {/* Button ring */}
        <mesh position={[0.26, 0.08, 0.12]} rotation={[0, -Math.PI / 4, Math.PI / 2]}>
          <torusGeometry args={[0.058, 0.006, 10, 24]} />
          <meshStandardMaterial {...matGold} />
        </mesh>

        {/* ══ 11. TRANSITION BAND (between body and grip) ══ */}
        <mesh position={[0, -0.20, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.236, 0.010, 8, 32]} />
          <meshStandardMaterial {...matBand} />
        </mesh>

        {/* ══ 12. LED DISPLAY — recessed window at bottom front ══ */}
        {/* Screen bezel */}
        <mesh position={[0.12, -0.78, 0.218]}>
          <boxGeometry args={[0.175, 0.115, 0.012]} />
          <meshStandardMaterial color="#090909" roughness={0.9} metalness={0.1} />
        </mesh>
        {/* Screen face */}
        <mesh position={[0.12, -0.78, 0.224]}>
          <boxGeometry args={[0.155, 0.095, 0.004]} />
          <meshStandardMaterial color="#1A1200" roughness={0.1} metalness={0.0}
            emissive="#CA8A04" emissiveIntensity={0.4} />
        </mesh>
        {/* LED segments */}
        {ledSegments.map((seg, i) => (
          <mesh key={i} position={[0.12 + seg.pos[0], -0.78 + seg.pos[1], 0.228 + seg.pos[2]]}>
            <boxGeometry args={seg.size} />
            <meshStandardMaterial {...matLED} />
          </mesh>
        ))}

        {/* ══ 13. BOTTOM CAP ══ */}
        <mesh position={[0, -1.04, 0]}>
          <cylinderGeometry args={[0.235, 0.220, 0.065, 28]} />
          <meshStandardMaterial {...matCap} />
        </mesh>
        {/* Bottom cap gold ring */}
        <mesh position={[0, -1.008, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.236, 0.006, 8, 32]} />
          <meshStandardMaterial {...matBand} />
        </mesh>
        {/* Very bottom disc */}
        <mesh position={[0, -1.073, 0]}>
          <cylinderGeometry args={[0.218, 0.210, 0.01, 28]} />
          <meshStandardMaterial {...matCap} />
        </mesh>

      </group>
    </>
  )
}

// ── Overlay ───────────────────────────────────────────────────────────────
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

// ── Fallback ──────────────────────────────────────────────────────────────
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
        camera={{ position: [0.4, 0.0, 4.8], fov: 42 }}
        shadows
        gl={async (props) => {
          const r = new THREE.WebGPURenderer({ ...props, antialias: true })
          await r.init()
          return r
        }}
      >
        <PostProcessing strength={0.9} threshold={0.7} />
        <Trimmer />
      </Canvas>
    </div>
  )
}
