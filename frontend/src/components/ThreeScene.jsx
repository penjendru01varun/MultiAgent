import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls, Float, Stars } from '@react-three/drei'
import * as THREE from 'three'

const WagonModel = ({ bearings }) => {
    const meshRef = useRef(null)

    // Rotate wheels
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.children.forEach((child) => {
                if (child.name.includes('Wheel')) {
                    child.rotation.x += delta * 2
                }
            })
        }
    })

    return (
        <group ref={meshRef}>
            {/* Chassis */}
            <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[10, 0.5, 3]} />
                <meshStandardMaterial color="#0a1018" roughness={0.2} metalness={0.9} transparent opacity={0.6} />
            </mesh>

            {/* Bogies & Wheels */}
            {[-3.5, 3.5].map((bx, bi) => (
                <group key={bi} position={[bx, 0, 0]}>
                    {/* Bogie Frame */}
                    <mesh position={[0, 0.2, 0]}>
                        <boxGeometry args={[3, 0.3, 2.5]} />
                        <meshStandardMaterial color="#1a2028" metalness={0.8} />
                    </mesh>

                    {/* Axles & Wheels */}
                    {[-1, 1].map((ax, ai) => (
                        <group key={ai} position={[ax, 0, 0]}>
                            {/* Axle */}
                            <mesh rotation={[Math.PI / 2, 0, 0]}>
                                <cylinderGeometry args={[0.1, 0.1, 3.2, 16]} />
                                <meshStandardMaterial color="#2d3748" metalness={1} />
                            </mesh>

                            {/* Wheels */}
                            {[-1.5, 1.5].map((wz, wi) => {
                                const bearingIndex = (bi * 4) + (ai * 2) + (wi === -1.5 ? 0 : 1)
                                const bearing = (bearings && bearings[bearingIndex]) || { health: 100, status: 'HEALTHY' }
                                const isDirty = bearing.health < 80
                                const isCrit = bearing.health < 40

                                return (
                                    <group key={wi} position={[0, 0, wz]} name={`Wheel-${bi}-${ai}-${wi}`}>
                                        {/* Wheel Mesh */}
                                        <mesh rotation={[Math.PI / 2, 0, 0]}>
                                            <cylinderGeometry args={[0.8, 0.8, 0.4, 32]} />
                                            <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
                                        </mesh>
                                        <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1.05, 1.05, 0.1]}>
                                            <torusGeometry args={[0.8, 0.05, 16, 100]} />
                                            <meshBasicMaterial color={isCrit ? '#ff0055' : isDirty ? '#ffbe00' : '#00f3ff'} transparent opacity={0.3} />
                                        </mesh>

                                        {/* Bearing Indicator */}
                                        <mesh position={[0, 0, wi > 0 ? 0.25 : -0.25]}>
                                            <sphereGeometry args={[0.2, 16, 16]} />
                                            <meshStandardMaterial
                                                emissive={isCrit ? '#ff0055' : isDirty ? '#ffbe00' : '#00f3ff'}
                                                emissiveIntensity={bearing.health < 90 ? 2 : 0.5}
                                                color={isCrit ? '#ff0055' : isDirty ? '#ffbe00' : '#00f3ff'}
                                            />
                                        </mesh>
                                    </group>
                                )
                            })}
                        </group>
                    ))}
                </group>
            ))}

            {/* Underbody Cables / Details */}
            <mesh position={[0, 0.4, 0]}>
                <boxGeometry args={[8, 0.1, 1]} />
                <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={0.2} transparent opacity={0.3} />
            </mesh>
        </group>
    )
}

const ThreeScene = ({ bearings }) => {
    return (
        <Canvas shadows dpr={[1, 2]}>
            <PerspectiveCamera makeDefault position={[12, 8, 12]} fov={35} />
            <OrbitControls
                enablePan={false}
                minDistance={5}
                maxDistance={25}
                makeDefault
                autoRotate={false}
            />

            <color attach="background" args={['#060a0f']} />

            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f3ff" />
            <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#ff0055" />

            {/* Grid Floor */}
            <gridHelper args={[100, 50, '#00f3ff', '#1a2028']} position={[0, -0.8, 0]} alphaTest={0.5}>
                <meshStandardMaterial transparent opacity={0.1} />
            </gridHelper>

            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                <WagonModel bearings={bearings} />
            </Float>

            {/* Scan Lines / Effects */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.79, 0]}>
                <planeGeometry args={[100, 100]} />
                <meshBasicMaterial color="#000" transparent opacity={0.5} />
            </mesh>
        </Canvas>
    )
}

export default ThreeScene
