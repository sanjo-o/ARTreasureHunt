import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Procedural 3D Treasure Chest
 * No external model files needed — pure Three.js geometry
 */
export default function TreasureChest({ onOpen, isOpen }) {
  const groupRef = useRef()
  const lidRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Materials
  const woodMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#5c3317',
    roughness: 0.7,
    metalness: 0.1,
  }), [])

  const goldMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ffd700',
    roughness: 0.3,
    metalness: 0.8,
    emissive: '#b8860b',
    emissiveIntensity: 0.2,
  }), [])

  const innerMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#8b0000',
    roughness: 0.6,
  }), [])

  const glowMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ffd700',
    emissive: '#ffd700',
    emissiveIntensity: 1.5,
    transparent: true,
    opacity: 0.6,
  }), [])

  // Animate lid opening and floating
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05
      // Hover scale
      const scale = hovered && !isOpen ? 1.05 : 1
      groupRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1)
    }

    if (lidRef.current) {
      // Lid opening animation
      const targetAngle = isOpen ? -Math.PI * 0.7 : 0
      lidRef.current.rotation.x += (targetAngle - lidRef.current.rotation.x) * 0.05
    }
  })

  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation()
        if (!isOpen && onOpen) onOpen()
      }}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default' }}
    >
      {/* ── Chest Body (bottom box) ── */}
      <mesh position={[0, 0, 0]} material={woodMat} castShadow>
        <boxGeometry args={[1.2, 0.6, 0.8]} />
      </mesh>

      {/* Gold trim strips on body */}
      <mesh position={[0, 0.31, 0]} material={goldMat}>
        <boxGeometry args={[1.22, 0.04, 0.82]} />
      </mesh>
      <mesh position={[0, -0.31, 0]} material={goldMat}>
        <boxGeometry args={[1.22, 0.04, 0.82]} />
      </mesh>

      {/* Front lock plate */}
      <mesh position={[0, 0.1, 0.41]} material={goldMat}>
        <boxGeometry args={[0.2, 0.25, 0.02]} />
      </mesh>

      {/* Lock keyhole circle */}
      <mesh position={[0, 0.08, 0.425]} material={woodMat}>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>

      {/* Corner reinforcements */}
      {[[-0.59, 0, 0.39], [0.59, 0, 0.39], [-0.59, 0, -0.39], [0.59, 0, -0.39]].map((pos, i) => (
        <mesh key={i} position={pos} material={goldMat}>
          <boxGeometry args={[0.06, 0.62, 0.06]} />
        </mesh>
      ))}

      {/* ── Lid (hinged at back) ── */}
      <group position={[0, 0.3, -0.4]} ref={lidRef}>
        {/* Lid main body */}
        <mesh position={[0, 0.2, 0.4]} material={woodMat} castShadow>
          <boxGeometry args={[1.2, 0.35, 0.8]} />
        </mesh>

        {/* Lid gold trim */}
        <mesh position={[0, 0.38, 0.4]} material={goldMat}>
          <boxGeometry args={[1.22, 0.04, 0.82]} />
        </mesh>

        {/* Lid arch (makes it look rounded on top) */}
        <mesh position={[0, 0.3, 0.4]} material={woodMat}>
          <cylinderGeometry args={[0.6, 0.6, 1.18, 16, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#5c3317" roughness={0.7} />
        </mesh>

        {/* Lid inner side (red velvet) */}
        <mesh position={[0, 0.04, 0.4]} material={innerMat}>
          <boxGeometry args={[1.1, 0.02, 0.7]} />
        </mesh>
      </group>

      {/* ── Treasure inside (visible when open) ── */}
      {isOpen && (
        <group>
          {/* Gold coins pile */}
          {[...Array(12)].map((_, i) => (
            <mesh
              key={`coin-${i}`}
              position={[
                (Math.random() - 0.5) * 0.6,
                0.1 + Math.random() * 0.2,
                (Math.random() - 0.5) * 0.4,
              ]}
              rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
              material={goldMat}
            >
              <cylinderGeometry args={[0.06, 0.06, 0.015, 16]} />
            </mesh>
          ))}

          {/* Glowing gem */}
          <mesh position={[0, 0.25, 0]} material={glowMat}>
            <octahedronGeometry args={[0.1]} />
          </mesh>

          {/* Light from inside chest */}
          <pointLight position={[0, 0.3, 0]} color="#ffd700" intensity={3} distance={2} />
        </group>
      )}

      {/* ── Base glow ring ── */}
      <mesh position={[0, -0.32, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.8, 32]} />
        <meshBasicMaterial color="#ffd700" transparent opacity={hovered ? 0.3 : 0.1} />
      </mesh>
    </group>
  )
}
