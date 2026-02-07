import React, { useMemo } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, random } from 'remotion';

export const ServerModel: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Deterministic particles
    const particles = useMemo(() => {
        return Array.from({ length: 50 }).map((_, i) => ({
            x: (random(`x-${i}`) - 0.5) * 10,
            y: (random(`y-${i}`) - 0.5) * 10,
            z: (random(`z-${i}`) - 0.5) * 10,
            speed: random(`speed-${i}`) * 2 + 1,
            size: random(`size-${i}`) * 0.05 + 0.02,
        }));
    }, []);

    const rotationY = interpolate(frame, [0, 300], [0, Math.PI * 2]);
    const floatY = Math.sin(frame / 30) * 0.2;

    return (
        <group rotation={[0.4, rotationY, 0]} position={[0, floatY, 0]}>
            {/* Main Server Rack Body */}
            <mesh>
                <boxGeometry args={[2, 3, 2]} />
                <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Glowing Panels */}
            {[...Array(5)].map((_, i) => (
                <mesh key={i} position={[0, i * 0.5 - 1, 1.01]}>
                    <boxGeometry args={[1.8, 0.2, 0.05]} />
                    <meshStandardMaterial
                        emissive="#00d4ff"
                        emissiveIntensity={Math.sin(frame / 10 + i) * 2 + 3}
                        color="#00d4ff"
                    />
                </mesh>
            ))}

            {/* Status Lights */}
            {[...Array(12)].map((_, i) => (
                <mesh key={i} position={[0.7, i * 0.2 - 1.1, 1.05]}>
                    <sphereGeometry args={[0.03, 16, 16]} />
                    <meshStandardMaterial
                        emissive={random(`light-${i}-${Math.floor(frame / 5)}`) > 0.5 ? "#00ff00" : "#555"}
                        emissiveIntensity={2}
                    />
                </mesh>
            ))}

            {/* Data Particles */}
            {particles.map((p, i) => {
                const pY = ((p.y + (frame * p.speed / 20)) % 10) - 5;
                return (
                    <mesh key={i} position={[p.x, pY, p.z]}>
                        <sphereGeometry args={[p.size, 8, 8]} />
                        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" transparent opacity={0.6} />
                    </mesh>
                );
            })}
        </group>
    );
};
