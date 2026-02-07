import React from 'react';
import { interpolate, useCurrentFrame, AbsoluteFill } from 'remotion';

export const LabShowcaseVideo: React.FC = () => {
    const frame = useCurrentFrame();

    const projects = [
        { name: 'My own Chef', tags: 'AI Agent • Automation' },
        { name: 'Banana Nano Pro', tags: 'LLM • Prompt Eng' },
        { name: 'Retro Galaga', tags: 'Retro • Canvas' },
        { name: 'Snake Battle Arena', tags: 'Multiplayer • Arena' }
    ];

    return (
        <AbsoluteFill style={{ backgroundColor: '#050510', color: 'white' }}>
            <div style={{ padding: 100 }}>
                <h1 style={{ fontSize: 80, marginBottom: 50 }}>The Lab: Experimental Realm</h1>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 50 }}>
                    {projects.map((project, i) => {
                        const delay = i * 20;
                        const opacity = interpolate(frame - delay, [0, 30], [0, 1], { extrapolateLeft: 'clamp' });
                        const x = interpolate(frame - delay, [0, 30], [50, 0], { extrapolateLeft: 'clamp' });

                        return (
                            <div key={project.name} style={{
                                opacity,
                                transform: `translateX(${x}px)`,
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                padding: 60,
                                borderRadius: 40,
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                <h3 style={{ fontSize: 50, color: '#00d4ff', margin: 0 }}>{project.name}</h3>
                                <p style={{ fontSize: 30, color: '#ff6b9d', marginTop: 20 }}>{project.tags}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AbsoluteFill>
    );
};
