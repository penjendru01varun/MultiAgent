import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls, Float, Stars, Sparkles, Trail } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise, Scanline } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

// Color palette
const COLORS = {
  cyan: '#00f3ff',
  red: '#ff0055',
  amber: '#ffbe00',
  green: '#00ff9d',
  purple: '#a55eea',
  blue: '#3366ff'
}

// Agent color mapping
const AGENT_COLORS = {
  A1: '#00f3ff', A2: '#ff4444', A3: '#aa6dc9', A4: '#ff9f43', A5: '#54a0ff',
  A6: '#00d2d3', A7: '#5f27cd', A8: '#ee5253', A9: '#10ac84', A10: '#f368e0',
  A11: '#00d2d3', A12: '#ff9f43', A13: '#54a0ff', A14: '#5f27cd', A15: '#ff6b6b',
  A16: '#a55eea', A17: '#2ed573', A18: '#ff4757', A19: '#ff6b6b', A20: '#ffa502',
  A21: '#ff4757', A22: '#5352ed', A23: '#2ed573', A24: '#1e90ff', A25: '#ff7f50',
  A26: '#7bed9f', A27: '#eccc68', A28: '#a55eea', A29: '#ff6348', A30: '#70a1ff',
  A31: '#7bed9f', A32: '#a29bfe', A33: '#ffeaa7', A34: '#fd79a8', A35: '#00cec9',
  A36: '#fab1a0', A37: '#fdcb6e', A38: '#81ecec', A39: '#ff4757', A40: '#ffa502',
  A41: '#2ed573', A42: '#ff6b81', A43: '#70a1ff', A44: '#dfe6e9', A45: '#00d2d3',
  A46: '#a29bfe', A47: '#ffeaa7', A48: '#fd79a8', A49: '#00cec9', A50: '#2ed573'
}

// Agent 3D visualization component
const AgentOrb3D = ({ agentId, position, status = 'active', scale = 1 }) => {
  const meshRef = useRef()
  const glowRef = useRef()
  const [time, setTime] = useState(0)
  
  const color = AGENT_COLORS[agentId] || COLORS.cyan
  const agentNum = parseInt(agentId.replace('A', ''))
  
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime
      
      // Category-specific animations
      if (agentNum <= 10) {
        // Sensory - breathing/pulsing
        meshRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.08)
        if (glowRef.current) {
          glowRef.current.material.opacity = 0.2 + Math.sin(t * 2) * 0.15
        }
      } else if (agentNum <= 18) {
        // Processing - rotating
        meshRef.current.rotation.y = t * 0.5
        meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.2
      } else if (agentNum <= 30) {
        // Inspection - floating/scanning
        meshRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.15
      } else if (agentNum <= 38) {
        // Prediction - crystalizing glow
        meshRef.current.material.emissiveIntensity = 0.5 + Math.sin(t * 3) * 0.4
      } else if (agentNum <= 44) {
        // Decision - urgent pulsing
        meshRef.current.scale.setScalar(1 + Math.sin(t * 5) * 0.12)
      } else {
        // Communication - network rotation
        meshRef.current.rotation.z = t * 0.3
        meshRef.current.rotation.x = Math.sin(t * 0.5) * 0.3
      }
    }
  })
  
  const getStatusColor = () => {
    switch(status) {
      case 'critical': return COLORS.red
      case 'warning': return COLORS.amber
      case 'idle': return '#444444'
      default: return color
    }
  }
  
  // Different geometries for different agent types
  const getGeometry = () => {
    if (agentNum <= 10) return <sphereGeometry args={[0.3, 32, 32]} />
    if (agentNum <= 18) return <octahedronGeometry args={[0.3]} />
    if (agentNum <= 30) return <boxGeometry args={[0.4, 0.4, 0.4]} />
    if (agentNum <= 38) return <dodecahedronGeometry args={[0.3]} />
    if (agentNum <= 44) return <coneGeometry args={[0.25, 0.5, 6]} />
    return <torusGeometry args={[0.25, 0.1, 16, 32]} />
  }
  
  return (
    <group position={position} scale={scale}>
      {/* Main orb */}
      <mesh ref={meshRef}>
        {getGeometry()}
        <meshStandardMaterial 
          color={getStatusColor()}
          emissive={getStatusColor()}
          emissiveIntensity={status === 'active' ? 0.8 : 0.2}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
      
      {/* Outer glow */}
      <mesh ref={glowRef} scale={1.8}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial 
          color={getStatusColor()} 
          transparent 
          opacity={0.25} 
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Connection nodes for communication agents */}
      {agentNum > 44 && (
        <>
          {[0, 90, 180, 270].map((deg, i) => (
            <mesh 
              key={i}
              position={[
                Math.cos(deg * Math.PI / 180) * 0.45,
                0,
                Math.sin(deg * Math.PI / 180) * 0.45
              ]}
            >
              <sphereGeometry args={[0.05]} />
              <meshBasicMaterial color={getStatusColor()} />
            </mesh>
          ))}
        </>
      )}
    </group>
  )
}

// Data particle system
const DataParticles = ({ count = 300 }) => {
  const particlesRef = useRef()
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15
      pos[i * 3 + 1] = Math.random() * 6 - 1
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15
    }
    return pos
  }, [count])
  
  const colors = useMemo(() => {
    const cols = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const color = new THREE.Color(Object.values(AGENT_COLORS)[Math.floor(Math.random() * 50)])
      cols[i * 3] = color.r
      cols[i * 3 + 1] = color.g
      cols[i * 3 + 2] = color.b
    }
    return cols
  }, [count])
  
  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += 0.008
        if (positions[i * 3 + 1] > 4) {
          positions[i * 3 + 1] = -2
        }
        // Slight horizontal drift
        positions[i * 3] += Math.sin(state.clock.elapsedTime + i) * 0.001
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.06} 
        vertexColors
        transparent 
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Railway wagon 3D model
const Wagon3D = ({ health = {} }) => {
  const groupRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.01
    }
  })
  
  return (
    <group ref={groupRef} position={[0, -1.5, 0]}>
      {/* Main body */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[8, 2.5, 2.2]} />
        <meshStandardMaterial color="#0a0a12" metalness={0.95} roughness={0.15} />
      </mesh>
      
      {/* Transparent panel */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[6, 1.5, 2]} />
        <meshStandardMaterial color="#00f3ff" transparent opacity={0.1} />
      </mesh>
      
      {/* Wheels */}
      {[[-3, 0, 1.3], [-3, 0, -1.3], [3, 0, 1.3], [3, 0, -1.3]].map((pos, i) => (
        <group key={i} position={pos}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 0.25, 32]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.3} />
          </mesh>
          {/* Health glow ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.38, 0.015, 8, 32]} />
            <meshBasicMaterial color={health[`bearing_${i}`] > 60 ? COLORS.green : COLORS.amber} />
          </mesh>
        </group>
      ))}
      
      {/* Bogies */}
      {[-2.5, 2.5].map((x, i) => (
        <mesh key={i} position={[x, 0.2, 0]}>
          <boxGeometry args={[1.8, 0.35, 1.8]} />
          <meshStandardMaterial color="#151520" metalness={0.85} roughness={0.25} />
        </mesh>
      ))}
      
      {/* Couplers */}
      {[-4.1, 4.1].map((x, i) => (
        <mesh key={i} position={[x, 0.8, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
          <meshStandardMaterial color="#333340" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
      
      {/* Sensor lights */}
      {[[-3, 2.7, 1], [-3, 2.7, -1], [3, 2.7, 1], [3, 2.7, -1], [0, 2.7, 0]].map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.08]} />
          <meshBasicMaterial color={[COLORS.cyan, COLORS.red, COLORS.green, COLORS.amber, COLORS.purple][i]} />
        </mesh>
      ))}
    </group>
  )
}

// Main Three.js scene
const ThreeScene = ({ bearings = [], phase = 'normal' }) => {
  // Generate 50 agent positions in orbital formation
  const agentPositions = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => {
      const angle = (i / 50) * Math.PI * 2
      const radius = 4.5 + Math.sin(i * 0.3) * 1
      const height = 2 + Math.cos(i * 0.4) * 1.5
      return [
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      ]
    })
  }, [])
  
  // Generate health data for bearings
  const healthData = useMemo(() => {
    const data = {}
    for (let i = 0; i < 4; i++) {
      data[`bearing_${i}`] = 60 + Math.random() * 40
    }
    return data
  }, [])
  
  return (
    <Canvas 
      shadows 
      dpr={[1, 2]} 
      gl={{ 
        antialias: true,
        alpha: false,
        powerPreference: "high-performance"
      }}
    >
      <PerspectiveCamera makeDefault position={[0, 6, 14]} fov={45} />
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        autoRotate={phase === 'cinematic'}
        autoRotateSpeed={0.3}
        maxDistance={35}
        minDistance={6}
      />

      {/* Environment */}
      <color attach="background" args={['#020208']} />
      <fog attach="fog" args={['#020208', 15, 50]} />
      <Stars radius={100} depth={50} count={4000} factor={5} saturation={0} fade speed={0.5} />

      {/* Lighting */}
      <ambientLight intensity={0.15} />
      <pointLight position={[8, 12, 8]} intensity={1.2} color={COLORS.cyan} />
      <pointLight position={[-8, 8, -8]} intensity={0.8} color={COLORS.red} />
      <spotLight 
        position={[0, 18, 0]} 
        angle={0.4} 
        penumbra={0.8} 
        intensity={1.5} 
        color="#ffffff"
        castShadow
      />

      {/* Main elements */}
      <Wagon3D health={healthData} />

      {/* 50 Agent orbs */}
      {agentPositions.map((pos, i) => (
        <AgentOrb3D 
          key={`A${i + 1}`}
          agentId={`A${i + 1}`}
          position={pos}
          status={Math.random() > 0.85 ? 'warning' : Math.random() > 0.95 ? 'critical' : 'active'}
          scale={0.9}
        />
      ))}

      {/* Data particles */}
      <DataParticles count={400} />

      {/* Ambient sparkles */}
      <Sparkles 
        count={150}
        scale={18}
        size={2}
        speed={0.3}
        opacity={0.4}
        color={COLORS.cyan}
      />

      {/* Grid floor */}
      <gridHelper args={[60, 40, '#00f3ff', '#0a1520']} position={[0, -2, 0]}>
        <meshBasicMaterial transparent opacity={0.15} />
      </gridHelper>

      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.15}
          luminanceSmoothing={0.9}
          height={300}
          intensity={phase === 'cinematic' ? 2.5 : 1.2}
        />
        <ChromaticAberration 
          blendFunction={BlendFunction.NORMAL}
          offset={phase === 'cinematic' ? [0.003, 0.003] : [0.001, 0.001]}
        />
        <Vignette 
          eskil={false} 
          offset={0.1} 
          darkness={0.6} 
        />
        <Noise 
          opacity={phase === 'cinematic' ? 0.04 : 0.02} 
        />
      </EffectComposer>
    </Canvas>
  )
}

export default ThreeScene
