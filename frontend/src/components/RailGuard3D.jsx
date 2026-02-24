import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, Stars, Float, Trail, Sparkles } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

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

// Agent 3D Component with unique animations per type
const Agent3D = ({ agentId, position = [0, 0, 0], isActive = true, scale = 1 }) => {
  const meshRef = useRef()
  const glowRef = useRef()
  const [time, setTime] = useState(0)
  
  const color = AGENT_COLORS[agentId] || '#00f3ff'
  const agentNum = parseInt(agentId.replace('A', ''))
  
  // Different animations based on category
  const getAnimation = () => {
    if (agentNum <= 10) {
      // Sensory - pulsing/breathing
      return { scale: [1, 1.05, 1], emissiveIntensity: [0.5, 1, 0.5] }
    } else if (agentNum <= 18) {
      // Processing - rotating
      return { rotation: [0, time * 2, 0] }
    } else if (agentNum <= 30) {
      // Inspection - scanning
      return { position: [position[0], position[1] + Math.sin(time * 2) * 0.1, position[2]] }
    } else if (agentNum <= 38) {
      // Prediction - glowing
      return { scale: [1 + Math.sin(time * 3) * 0.1, 1 + Math.sin(time * 3) * 0.1, 1] }
    } else if (agentNum <= 44) {
      // Decision - urgent pulse
      return { scale: [1.1, 1.1, 1.1] }
    } else {
      // Communication - orbiting
      return { rotation: [time, time * 0.5, 0] }
    }
  }
  
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime
      setTime(t)
      
      // Apply category-specific animations
      if (agentNum <= 10) {
        // Sensory - breathing
        meshRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05)
        if (glowRef.current) {
          glowRef.current.material.opacity = 0.3 + Math.sin(t * 2) * 0.2
        }
      } else if (agentNum <= 18) {
        // Processing - rotating
        meshRef.current.rotation.y = t * 0.5
      } else if (agentNum <= 30) {
        // Inspection - floating
        meshRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.15
      } else if (agentNum <= 38) {
        // Prediction - crystalizing glow
        meshRef.current.material.emissiveIntensity = 0.5 + Math.sin(t * 3) * 0.3
      } else if (agentNum <= 44) {
        // Decision - urgent pulse
        meshRef.current.scale.setScalar(1 + Math.sin(t * 4) * 0.1)
      } else {
        // Communication - network rotation
        meshRef.current.rotation.x = Math.sin(t * 0.5) * 0.3
        meshRef.current.rotation.z = Math.cos(t * 0.3) * 0.3
      }
    }
  })
  
  // Different geometries based on agent type
  const getGeometry = () => {
    if (agentNum === 1) return <octahedronGeometry args={[0.5]} />
    if (agentNum === 2) return <sphereGeometry args={[0.45, 16, 16]} />
    if (agentNum === 3) return <torusGeometry args={[0.3, 0.15, 16, 32]} />
    if (agentNum === 4) return <boxGeometry args={[0.5, 0.5, 0.5]} />
    if (agentNum === 5) return <cylinderGeometry args={[0.3, 0.3, 0.5, 8]} />
    return <icosahedronGeometry args={[0.4]} />
  }
  
  return (
    <group position={position} scale={scale}>
      {/* Main agent body */}
      <mesh ref={meshRef}>
        {getGeometry()}
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={isActive ? 0.8 : 0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Outer glow */}
      <mesh ref={glowRef} scale={1.5}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.2} 
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Connection points for network visualization */}
      {agentNum > 44 && (
        <>
          {[0, 90, 180, 270].map((deg) => (
            <mesh 
              key={deg}
              position={[
                Math.cos(deg * Math.PI / 180) * 0.6,
                0,
                Math.sin(deg * Math.PI / 180) * 0.6
              ]}
            >
              <sphereGeometry args={[0.08]} />
              <meshBasicMaterial color={color} />
            </mesh>
          ))}
        </>
      )}
    </group>
  )
}

// Data flow particles
const DataFlowParticles = ({ count = 100 }) => {
  const particlesRef = useRef()
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return pos
  }, [count])
  
  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += 0.01
        if (positions[i * 3 + 1] > 3) {
          positions[i * 3 + 1] = -3
        }
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
      </bufferGeometry>
      <pointsMaterial 
        size={0.05} 
        color="#00f3ff" 
        transparent 
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

// Railway Wagon (simplified 3D model)
const RailwayWagon = ({ position = [0, -2, 0] }) => {
  const wagonRef = useRef()
  
  useFrame((state) => {
    if (wagonRef.current) {
      wagonRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02
    }
  })
  
  return (
    <group ref={wagonRef} position={position}>
      {/* Main body */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[8, 3, 2.5]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.3} />
      </mesh>
      
      {/* Wheels */}
      {[[-3, 0, 1.5], [-3, 0, -1.5], [3, 0, 1.5], [3, 0, -1.5]].map((pos, i) => (
        <group key={i} position={pos}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
            <meshStandardMaterial color="#333" metalness={0.8} roughness={0.4} />
          </mesh>
          {/* Wheel glow ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.42, 0.02, 16, 32]} />
            <meshBasicMaterial color="#00f3ff" />
          </mesh>
        </group>
      ))}
      
      {/* Bogies */}
      {[-2.5, 2.5].map((x, i) => (
        <mesh key={`bogie-${i}`} position={[x, 0.3, 0]}>
          <boxGeometry args={[2, 0.4, 2]} />
          <meshStandardMaterial color="#222" metalness={0.7} roughness={0.5} />
        </mesh>
      ))}
      
      {/* Couplers */}
      <mesh position={[-4.2, 1, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.8, 16]} />
        <meshStandardMaterial color="#444" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[4.2, 1, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.8, 16]} />
        <meshStandardMaterial color="#444" metalness={0.9} roughness={0.2} />
      </mesh>
      
      {/* Sensor indicators */}
      {[[-3, 2.6, 1], [-3, 2.6, -1], [3, 2.6, 1], [3, 2.6, -1], [0, 2.6, 0]].map((pos, i) => (
        <mesh key={`sensor-${i}`} position={pos}>
          <sphereGeometry args={[0.1]} />
          <meshBasicMaterial color={['#00f3ff', '#ff4444', '#ffa502', '#7bed9f', '#a55eea'][i]} />
        </mesh>
      ))}
    </group>
  )
}

// Network connections between agents
const NetworkConnections = ({ agents }) => {
  const linesRef = useRef()
  
  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })
  
  // Create connections between nearby agents
  const connections = useMemo(() => {
    const conns = []
    const positions = agents.slice(0, 20).map((_, i) => [
      Math.cos(i * 0.3) * 4,
      Math.sin(i * 0.5) * 2 + 2,
      Math.sin(i * 0.3) * 4
    ])
    
    for (let i = 0; i < positions.length - 1; i++) {
      conns.push({
        start: positions[i],
        end: positions[i + 1],
        color: AGENT_COLORS[`A${i + 1}`] || '#00f3ff'
      })
    }
    return conns
  }, [agents])
  
  return (
    <group>
      {connections.map((conn, i) => (
        <mesh key={i}>
          <cylinderGeometry args={[0.01, 0.01, 1, 8]} />
          <meshBasicMaterial color={conn.color} transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  )
}

// Main 3D Scene
const RailGuard3DScene = () => {
  const [agents] = useState(() => 
    Array.from({ length: 50 }, (_, i) => `A${i + 1}`)
  )
  
  // Calculate agent positions in a 3D orbital layout
  const agentPositions = useMemo(() => {
    return agents.map((agentId, i) => {
      const angle = (i / 50) * Math.PI * 2
      const radius = 4 + Math.sin(i * 0.2) * 1
      const height = 2 + Math.cos(i * 0.3) * 1.5
      return [
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      ]
    })
  }, [agents])
  
  return (
    <>
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 5, 12]} fov={50} />
      <OrbitControls 
        enablePan={true} 
        enableZoom={true} 
        enableRotate={true}
        autoRotate
        autoRotateSpeed={0.5}
        maxDistance={30}
        minDistance={5}
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00f3ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff4444" />
      <spotLight 
        position={[0, 15, 0]} 
        angle={0.3} 
        penumbra={1} 
        intensity={1} 
        color="#ffffff"
      />
      
      {/* Environment */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <fog attach="fog" args={['#0a0a15', 10, 50]} />
      
      {/* Main elements */}
      <RailwayWagon position={[0, -1, 0]} />
      
      {/* Agents in orbital formation */}
      {agents.map((agentId, i) => (
        <Agent3D 
          key={agentId}
          agentId={agentId}
          position={agentPositions[i]}
          scale={0.8}
        />
      ))}
      
      {/* Data flow particles */}
      <DataFlowParticles count={200} />
      
      {/* Ambient sparkles */}
      <Sparkles 
        count={100} 
        scale={12} 
        size={2} 
        speed={0.4} 
        opacity={0.5}
        color="#00f3ff"
      />
      
      {/* Post-processing */}
      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          height={300}
          intensity={1.5}
        />
        <ChromaticAberration 
          blendFunction={BlendFunction.NORMAL}
          offset={[0.001, 0.001]}
        />
        <Vignette eskil={false} offset={0.1} darkness={0.5} />
        <Noise opacity={0.02} />
      </EffectComposer>
    </>
  )
}

// Cinematic camera controller
const CinematicCamera = ({ phase = 'intro' }) => {
  const { camera } = useThree()
  const startPos = useRef([0, 5, 12])
  
  useEffect(() => {
    switch(phase) {
      case 'intro':
        camera.position.set(15, 8, 15)
        break
      case 'dataflow':
        camera.position.set(0, 3, 8)
        break
      case 'detail':
        camera.position.set(5, 2, 5)
        break
      case 'network':
        camera.position.set(0, 12, 0)
        break
    }
  }, [phase, camera])
  
  useFrame(() => {
    camera.lookAt(0, 1, 0)
  })
  
  return null
}

export { RailGuard3DScene, Agent3D, DataFlowParticles, RailwayWagon, CinematicCamera }
