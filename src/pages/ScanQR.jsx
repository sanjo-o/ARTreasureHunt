import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import jsQR from 'jsqr'
import PlayerForm from '../components/PlayerForm.jsx'
import { getPlayer } from '../utils/api.js'

export default function ScanQR() {
  const [player, setPlayer] = useState(getPlayer())
  const [cameraStream, setCameraStream] = useState(null)
  const videoRef = useRef()
  const scanLoopRef = useRef()
  const canvasRef = useRef(document.createElement('canvas'))
  const navigate = useNavigate()

  useEffect(() => {
    if (!player) return
    let stream = null
    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        })
        setCameraStream(stream)
      } catch (err) {
        console.log('Camera not available')
      }
    }
    startCamera()
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop())
    }
  }, [player])

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream
    }
  }, [cameraStream])

  useEffect(() => {
    if (!cameraStream) return
    
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
        
        if (code && code.data) {
          // Look for /hunt/poster/:id
          const match = code.data.match(/\/hunt\/poster\/(\d+)/)
          if (match) {
            const pid = match[1]
            console.log("Found Poster ID:", pid)
            // Navigate to the poster page immediately
            navigate(`/hunt/poster/${pid}`, { state: { scanned: true }, replace: true })
            return
          }
        }
      }
      scanLoopRef.current = requestAnimationFrame(scanFrame)
    }
    
    scanLoopRef.current = requestAnimationFrame(scanFrame)
    return () => cancelAnimationFrame(scanLoopRef.current)
  }, [cameraStream, navigate])

  if (!player) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <PlayerForm onRegistered={setPlayer} />
      </div>
    )
  }

  return (
    <div className="ar-container">
      {cameraStream && (
        <video ref={videoRef} autoPlay playsInline muted
          style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
      
      <div className="scanner-overlay">
        <div className="scanner-corners"></div>
        <div className="scanner-grid"></div>
        <div className="scanner-laser"></div>
      </div>

      <div className="ar-hud">
        <div className="glass" style={{ padding: '8px 16px', borderRadius: 12 }}>
          <span style={{ fontSize: '0.85rem' }}>
            🔍 Эрдэнэсийн QR кодыг камертаа харуулна уу...
          </span>
        </div>
      </div>
    </div>
  )
}
