import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const TimelineVideo: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const eras = [
        { year: '1990s', tech: '286 DX 33', desc: 'The Foundations' },
        { year: '2000s', tech: 'Enterprise Infrastructure', desc: 'Scaling Complexity' },
        { year: '2010s', tech: 'Cloud & DevOps', desc: 'Modern Workflows' },
        { year: '2020s', tech: 'AI & Automation', desc: 'The Future' }
    ];

    return (
        <AbsoluteFill style={{ backgroundColor: '#050510', color: 'white', justifyContent: 'center', alignItems: 'center' }}>
            {eras.map((era, i) => {
                const startFrame = i * 200;
                const opacity = interpolate(frame, [startFrame, startFrame + 30, startFrame + 170, startFrame + 200], [0, 1, 1, 0], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp'
                });

                return (
                    <div key={era.year} style={{ opacity, position: 'absolute', textAlign: 'center' }}>
                        <h1 style={{ fontSize: 160, margin: 0, color: '#00d4ff' }}>{era.year}</h1>
                        <h2 style={{ fontSize: 80, margin: '20px 0' }}>{era.tech}</h2>
                        <p style={{ fontSize: 40, color: '#a0a0b0' }}>{era.desc}</p>
                    </div>
                );
            })}
        </AbsoluteFill>
    );
};
