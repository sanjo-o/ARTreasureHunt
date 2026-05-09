import { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import TreasureChest from './TreasureChest.jsx'
import CoinEffect from './CoinEffect.jsx'
import { playChestOpenSound } from '../utils/sounds.js'

export default function ARScene({ onCollect }) {
  const [cameraStream, setCameraStream] = useState(null)
  const [chestOpen, setChestOpen] = useState(false)
  const [collected, setCollected] = useState(false)
  const [isScanning, setIsScanning] = useState(true)
  const isOpeningRef = useRef(false)
  const videoRef = useRef()

  // Try to get camera feed for AR-like background
  useEffect(() => {
    let stream = null
    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        })
        setCameraStream(stream)
      } catch (err) {
        console.log('Camera not available, using 3D-only mode')
      }
    }
    startCamera()
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop())
    }
  }, [])

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream
    }
  }, [cameraStream])

  // Scanning effect delay
  useEffect(() => {
    const timer = setTimeout(() => setIsScanning(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  const handleOpenChest = () => {
    if (collected || isOpeningRef.current) return
    isOpeningRef.current = true
    setChestOpen(true)
    playChestOpenSound()
    setTimeout(() => {
      setCollected(true)
      if (onCollect) onCollect()
    }, 1500)
  }

  return (
    <div className="ar-container">
      {/* Camera background */}
      {cameraStream && (
        <video ref={videoRef} autoPlay playsInline muted
          style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}

      {/* 3D scene overlay */}
      {!cameraStream && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 40%, #2d1810 100%)'
        }} />
      )}

      {/* Scanner Overlay */}
      {isScanning && (
        <div className="scanner-overlay">
          <div className="scanner-corners"></div>
          <div className="scanner-grid"></div>
          <div className="scanner-laser"></div>
        </div>
      )}

      {/* Three.js Canvas */}
      <Canvas
        className="ar-canvas"
        camera={{ position: [0, 1.5, 3], fov: 50 }}
        style={{ position: 'absolute', inset: 0, zIndex: 1 }}
        gl={{ alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#ffeedd" />
        <pointLight position={[-3, 2, -3]} intensity={0.5} color="#ffd700" />

        <Suspense fallback={null}>
          {!isScanning && <TreasureChest onOpen={handleOpenChest} isOpen={chestOpen} />}
          {!isScanning && <CoinEffect active={chestOpen} />}
        </Suspense>

        {!cameraStream && <Environment preset="sunset" background={false} />}
        <OrbitControls
          enablePan={false} enableZoom={false}
          minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>

      {/* HUD overlay */}
      <div className="ar-hud">
        <div className="glass" style={{ padding: '8px 16px', borderRadius: 12 }}>
          <span style={{ fontSize: '0.85rem' }}>
            {isScanning ? '🔍 Орчин хайж байна...' : collected ? '✅ Цуглуулсан!' : chestOpen ? '✨ Нээгдэж байна...' : '👆 Авдар дээр дарна уу'}
          </span>
        </div>
      </div>
    </div>
  )
}
