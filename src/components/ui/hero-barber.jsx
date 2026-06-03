import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { useAspect, useTexture } from '@react-three/drei'
import { useMemo, useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as THREE from 'three/webgpu'
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode.js'
import {
  abs, blendScreen, float, mod, mx_cell_noise_float,
  oneMinus, smoothstep, texture, uniform, uv, vec2, vec3,
  pass, mix, add,
} from 'three/tsl'
import './hero-barber.css'

const TEXTUREMAP = { src: 'https://i.postimg.cc/XYwvXN8D/img-4.png' }
const DEPTHMAP   = { src: 'https://i.postimg.cc/2SHKQh2q/raw-4.webp' }

extend(THREE)

function PostProcessing({ strength = 0.8, threshold = 1.2 }) {
  const { gl, scene, camera } = useThree()
  const progressRef = useRef({ value: 0 })

  const render = useMemo(() => {
    const pp = new THREE.PostProcessing(gl)
    const scenePass  = pass(scene, camera)
    const sceneColor = scenePass.getTextureNode('output')
    const bloomPass  = bloom(sceneColor, strength, 0.5, threshold)

    const uScan = uniform(0)
    progressRef.current = uScan

    const scanLine = smoothstep(0, float(0.05), abs(uv().y.sub(float(uScan.value))))
    // Gold scan line
    const goldOverlay = vec3(1.0, 0.78, 0.0).mul(oneMinus(scanLine)).mul(0.9)

    const withScan = mix(
      sceneColor,
      add(sceneColor, goldOverlay),
      smoothstep(0.9, 1.0, oneMinus(scanLine))
    )

    pp.outputNode = withScan.add(bloomPass)
    return pp
  }, [camera, gl, scene, strength, threshold])

  useFrame(({ clock }) => {
    progressRef.current.value = Math.sin(clock.getElapsedTime() * 0.45) * 0.5 + 0.5
    render.renderAsync()
  }, 1)

  return null
}

const W = 300, H = 300

function Scene() {
  const [rawMap, depthMap] = useTexture([TEXTUREMAP.src, DEPTHMAP.src])
  const meshRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => { if (rawMap && depthMap) setVisible(true) }, [rawMap, depthMap])

  const { material, uniforms } = useMemo(() => {
    const uPointer  = uniform(new THREE.Vector2(0))
    const uProgress = uniform(0)

    const tDepth = texture(depthMap)
    const tRaw   = texture(rawMap, uv().add(tDepth.r.mul(uPointer).mul(0.01)))

    // Recolor → warm gold/amber tones
    const luma = tRaw.r.mul(0.5).add(tRaw.g.mul(0.3)).add(tRaw.b.mul(0.2))
    const tMap = vec3(luma.mul(0.9), luma.mul(0.68), luma.mul(0.0))

    const aspect  = float(W).div(H)
    const tUv     = vec2(uv().x.mul(aspect), uv().y)
    const tiling  = vec2(120.0)
    const tiledUv = mod(tUv.mul(tiling), 2.0).sub(1.0)

    const brightness = mx_cell_noise_float(tUv.mul(tiling).div(2))
    const dist = float(tiledUv.length())
    const dot  = float(smoothstep(0.5, 0.49, dist)).mul(brightness)

    const flow = oneMinus(smoothstep(float(0), float(0.02), abs(tDepth.r.sub(uProgress))))

    // Gold dot mask — R and G both HDR, B=0 → warm amber/gold bloom
    const mask  = dot.mul(flow).mul(vec3(10.0, 7.8, 0.0))
    const final = blendScreen(tMap, mask)

    const mat = new THREE.MeshBasicNodeMaterial({
      colorNode: final,
      transparent: true,
      opacity: 0,
    })
    return { material: mat, uniforms: { uPointer, uProgress } }
  }, [rawMap, depthMap])

  const [w, h] = useAspect(W, H)

  useFrame(({ clock }) => {
    uniforms.uProgress.value = Math.sin(clock.getElapsedTime() * 0.45) * 0.5 + 0.5
    const mat = meshRef.current?.material
    if (mat && 'opacity' in mat)
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, visible ? 1 : 0, 0.07)
  })

  useFrame(({ pointer }) => { uniforms.uPointer.value = pointer })

  return (
    <mesh ref={meshRef} scale={[w * 0.4, h * 0.4, 1]} material={material}>
      <planeGeometry />
    </mesh>
  )
}

function Overlay({ onComplete }) {
  const words   = ['Sharp.', 'Precise.', 'Legendary.']
  const sub     = 'Premium cuts. Masterful technique. Zero compromise.'
  const [shown,   setShown]   = useState(0)
  const [subOn,   setSubOn]   = useState(false)
  const [btnOn,   setBtnOn]   = useState(false)
  const [delays]  = useState(() => words.map(() => Math.random() * 0.07))
  const [subDelay] = useState(() => Math.random() * 0.1)

  useEffect(() => {
    if (shown < words.length) {
      const t = setTimeout(() => setShown(n => n + 1), 550)
      return () => clearTimeout(t)
    }
    const t1 = setTimeout(() => setSubOn(true),  500)
    const t2 = setTimeout(() => setBtnOn(true), 1400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [shown])

  useEffect(() => {
    const t = setTimeout(onComplete, 7000)
    return () => clearTimeout(t)
  }, [onComplete])

  return (
    <div className="hb-overlay">
      <div className="hb-title">
        {words.map((w, i) => (
          <span
            key={i}
            className={`hb-word ${i < shown ? 'hb-in' : ''}`}
            style={{ animationDelay: `${i * 0.12 + delays[i]}s` }}
          >
            {w}
          </span>
        ))}
      </div>
      <p
        className={`hb-sub ${subOn ? 'hb-sub-in' : ''}`}
        style={{ animationDelay: `${words.length * 0.12 + 0.18 + subDelay}s` }}
      >
        {sub}
      </p>
      {btnOn && (
        <motion.button
          className="hb-btn"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          onClick={onComplete}
        >
          Enter the Shop
          <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
            <path d="M11 5V17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M6 12L11 17L16 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </motion.button>
      )}
    </div>
  )
}

function Fallback({ onComplete }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 3500)
    return () => clearTimeout(t)
  }, [onComplete])

  return (
    <motion.div className="hb-fallback"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }} style={{ textAlign: 'center' }}
      >
        <div className="hb-fb-logo">✦ OBSIDIAN</div>
        <h1 className="hb-fb-title">Sharp.<br /><em>Legendary.</em></h1>
        <p className="hb-fb-sub">Premium cuts. Masterful technique.</p>
      </motion.div>
    </motion.div>
  )
}

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
      <Canvas flat className="hb-canvas"
        gl={async (props) => {
          const r = new THREE.WebGPURenderer(props)
          await r.init()
          return r
        }}
      >
        <PostProcessing strength={0.8} threshold={1.2} />
        <Scene />
      </Canvas>
    </div>
  )
}
