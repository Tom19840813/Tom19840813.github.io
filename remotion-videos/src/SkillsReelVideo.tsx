import React from 'react';
import { interpolate, useCurrentFrame, AbsoluteFill, Sequence } from 'remotion';

export const SkillsReelVideo: React.FC = () => {
    const frame = useCurrentFrame();

    const skills = [
        { title: 'Infrastructure', icon: '🖥️', desc: 'Enterprise-grade networking & hardware' },
        { title: 'AI Integration', icon: '🤖', desc: 'Stable Diffusion, N8N, LLM Solutions' },
        { title: '3D Engineering', icon: '📐', desc: 'Precision modeling & 3D Printing' }
    ];

    return (
        <AbsoluteFill style={{ backgroundColor: '#050510', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {skills.map((skill, i) => (
                <Sequence from={i * 180} durationInFrames={180} key={skill.title}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 200, marginBottom: 40 }}>{skill.icon}</div>
                        <h1 style={{ fontSize: 100, color: '#00d4ff', margin: 0 }}>{skill.title}</h1>
                        <p style={{ fontSize: 50, color: '#a0a0b0', maxWidth: 1000, margin: '40px auto' }}>{skill.desc}</p>
                    </div>
                </Sequence>
            ))}
        </AbsoluteFill>
    );
};
