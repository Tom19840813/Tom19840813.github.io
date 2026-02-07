import React from 'react';
import { AbsoluteFill, useVideoConfig, interpolate, useCurrentFrame } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { ServerModel } from './ServerModel';

export const ThreeDShowcaseVideo: React.FC = () => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();

    const cameraZ = interpolate(frame, [0, 150, 300], [10, 8, 12]);

    return (
        <AbsoluteFill style={{ backgroundColor: '#050510' }}>
            <ThreeCanvas
                width={width}
                height={height}
                camera={{
                    fov: 45,
                    near: 0.1,
                    far: 1000,
                    position: [0, 0, cameraZ]
                }}
            >
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#00d4ff" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />

                <ServerModel />
            </ThreeCanvas>

            {/* Cinematic Overlays */}
            <AbsoluteFill style={{
                background: 'radial-gradient(circle, transparent 20%, rgba(0,0,0,0.6) 100%)',
                pointerEvents: 'none'
            }} />

            <div style={{
                position: 'absolute',
                top: 80,
                width: '100%',
                textAlign: 'center',
                color: 'white',
                fontFamily: 'system-ui, sans-serif',
                textTransform: 'uppercase',
                letterSpacing: 15,
                opacity: interpolate(frame, [0, 40], [0, 1])
            }}>
                <h1 style={{ fontSize: 80, margin: 0, color: '#00d4ff', textShadow: '0 0 30px rgba(0,212,255,0.5)' }}>
                    Core Infrastructure
                </h1>
                <p style={{ fontSize: 30, opacity: 0.6 }}>3D Neural Rendering</p>
            </div>
        </AbsoluteFill>
    );
};
