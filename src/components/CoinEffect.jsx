import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function CoinEffect({ active }) {
  const pointsRef = useRef()
  const count = 30

  const { positions, velocities, scales } = useMemo(() => {
    const p = new Float32Array(count * 3)
    const v = []
    const s = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      p[i * 3] = 0; p[i * 3 + 1] = 0.3; p[i * 3 + 2] = 0
      v.push(new THREE.Vector3((Math.random() - 0.5) * 2, 1 + Math.random() * 3, (Math.random() - 0.5) * 2))
      s[i] = 3 + Math.random() * 4
    }
    return { positions: p, velocities: v, scales: s }
  }, [])

  useFrame((_, delta) => {
    if (!pointsRef.current || !active) return
    const arr = pointsRef.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      arr[i*3] += velocities[i].x * delta
      arr[i*3+1] += velocities[i].y * delta
      arr[i*3+2] += velocities[i].z * delta
      velocities[i].y -= delta * 3
      if (arr[i*3+1] < -1) {
        arr[i*3] = 0; arr[i*3+1] = 0.3; arr[i*3+2] = 0
        velocities[i].set((Math.random()-0.5)*2, 1+Math.random()*3, (Math.random()-0.5)*2)
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  if (!active) return null

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#ffd700" size={0.08} transparent opacity={0.9} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  )
}
