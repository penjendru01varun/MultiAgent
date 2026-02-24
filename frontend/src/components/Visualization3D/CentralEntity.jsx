import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CentralEntity = ({ state = 'idle', activeAgents = [] }) => {
    const pointsRef = useRef();
    const count = 50; // Main agents
    const ambientCount = 200;
    const totalCount = count + ambientCount;

    const particles = useMemo(() => {
        const positions = new Float32Array(totalCount * 3);
        const colors = new Float32Array(totalCount * 3);
        const sizes = new Float32Array(totalCount);
        const speeds = new Float32Array(totalCount);

        for (let i = 0; i < totalCount; i++) {
            // Random initial positions in a sphere
            const r = 2 + Math.random() * 0.5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);

            // Colors
            if (i < count) {
                // Main agents
                colors[i * 3] = 0.0;     // Cyan/Blue tones
                colors[i * 3 + 1] = 0.8;
                colors[i * 3 + 2] = 1.0;
                sizes[i] = 0.15;
                speeds[i] = 0.5 + Math.random();
            } else {
                // Ambient particles
                colors[i * 3] = 0.2;
                colors[i * 3 + 1] = 0.2;
                colors[i * 3 + 2] = 0.3;
                sizes[i] = 0.05;
                speeds[i] = 0.2 + Math.random() * 0.3;
            }
        }
        return { positions, colors, sizes, speeds };
    }, []);

    useFrame((state_frame, delta) => {
        const time = state_frame.clock.getElapsedTime();
        const positions = pointsRef.current.geometry.attributes.position.array;
        const sizes = pointsRef.current.geometry.attributes.size.array;

        for (let i = 0; i < totalCount; i++) {
            const i3 = i * 3;
            const speed = particles.speeds[i];

            // Orbit motion
            let orbitSpeed = state === 'thinking' ? 2.0 : 0.5;
            const angle = time * speed * orbitSpeed;

            // Apply some noise/wobble
            const noise = Math.sin(time + i) * 0.1;

            // Basic orbital rotation around Y
            const radius = Math.sqrt(positions[i3] ** 2 + positions[i3 + 2] ** 2);
            const currentAngle = Math.atan2(positions[i3 + 2], positions[i3]);
            const newAngle = currentAngle + delta * speed * orbitSpeed;

            positions[i3] = radius * Math.cos(newAngle);
            positions[i3 + 2] = radius * Math.sin(newAngle);
            positions[i3 + 1] += Math.sin(time * speed) * 0.002; // Slight vertical drift

            // Pulse intensity
            if (state === 'thinking') {
                sizes[i] = particles.sizes[i] * (1.2 + Math.sin(time * 5) * 0.2);
            } else {
                sizes[i] = particles.sizes[i] * (1.0 + Math.sin(time * 2 + i) * 0.1);
            }
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
        pointsRef.current.geometry.attributes.size.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={totalCount}
                    array={particles.positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={totalCount}
                    array={particles.colors}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-size"
                    count={totalCount}
                    array={particles.sizes}
                    itemSize={1}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.1}
                vertexColors
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
                sizeAttenuation={true}
            />
        </points>
    );
};

export default CentralEntity;
