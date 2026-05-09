import { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import TreasureChest from './TreasureChest.jsx'
import CoinEffect from './CoinEffect.jsx'
import { playChestOpenSound } from '../utils/sounds.js'
import jsQR from 'jsqr'

export default function ARScene({ onCollect }) {
  const [cameraStream, setCameraStream] = useState(null)
  const [chestOpen, setChestOpen] = useState(false)
  const [collected, setCollected] = useState(false)
  const [isScanning, setIsScanning] = useState(true)
  const isOpeningRef = useRef(false)
  const videoRef = useRef()
  const scanLoopRef = useRef()
  const canvasRef = useRef(document.createElement('canvas'))

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

  // Real-time QR Scanning Loop
  useEffect(() => {
    if (!isScanning || !cameraStream) return
    
    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    
    const scanFrame = () => {
      if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        })
        
        if (code) {
          console.log("QR Code detected:", code.data)
          setIsScanning(false)
          return // Stop scanning
        }
      }
      scanLoopRef.current = requestAnimationFrame(scanFrame)
    }
    
    scanLoopRef.current = requestAnimationFrame(scanFrame)
    
    return () => cancelAnimationFrame(scanLoopRef.current)
  }, [cameraStream, isScanning])

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
        <div className="glass" style={{ padding: '8px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '0.85rem' }}>
            {isScanning ? '🔍 Постерийн QR кодыг дахин уншуулна уу...' : collected ? '✅ Цуглуулсан!' : chestOpen ? '✨ Нээгдэж байна...' : '👆 Авдар дээр дарна уу'}
          </span>
          {isScanning && (
            <button 
              onClick={() => setIsScanning(false)}
              style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '4px 8px', borderRadius: 6, color: 'white', fontSize: '0.75rem', cursor: 'pointer' }}
            >
              Алгасах
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
