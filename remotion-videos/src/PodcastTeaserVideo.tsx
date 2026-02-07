import React from 'react';
import { interpolate, useCurrentFrame, AbsoluteFill, spring } from 'remotion';

export const PodcastTeaserVideo: React.FC = () => {
    const frame = useCurrentFrame();

    const glow = interpolate(Math.sin(frame / 10), [-1, 1], [0.5, 1]);
    const scale = spring({ frame, fps: 30, config: { damping: 10 } });

    return (
        <AbsoluteFill style={{
            backgroundColor: '#050510',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden'
        }}>
            {/* Background Glow */}
            <div style={{
                position: 'absolute',
                width: 800,
                height: 800,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0, 212, 255, 0.2) 0%, transparent 70%)',
                opacity: glow,
                transform: `scale(${scale})`
            }} />

            <div style={{ textAlign: 'center', zIndex: 1, transform: `scale(${scale})` }}>
                <h2 style={{ color: '#ff6b9d', fontSize: 60, letterSpacing: 10, textTransform: 'uppercase' }}>Coming Soon</h2>
                <h1 style={{
                    fontSize: 140,
                    fontWeight: 800,
                    margin: '20px 0',
                    background: 'linear-gradient(45deg, #00d4ff, #ff6b9d)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>Gemini Interactive Podcast</h1>
                <p style={{ color: '#e0e0e0', fontSize: 40, fontWeight: 500 }}>A Real-time Multimodal Experience</p>
            </div>
        </AbsoluteFill>
    );
};
