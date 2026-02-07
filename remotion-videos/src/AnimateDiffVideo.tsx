import React from 'react';
import {
    interpolate,
    useCurrentFrame,
    AbsoluteFill,
    useVideoConfig,
    Img,
    staticFile,
    Sequence,
    spring,
    Audio
} from 'remotion';

export const AnimateDiffVideo: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames, width, height } = useVideoConfig();

    const opacity = interpolate(frame, [0, 20], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    const scale = interpolate(frame, [0, durationInFrames], [1, 1.2], {
        extrapolateLeft: 'clamp',
    });

    const textSpring = spring({
        frame,
        fps,
        config: {
            stiffness: 100,
        },
    });

    return (
        <AbsoluteFill style={{ backgroundColor: '#000' }}>
            <Audio src={staticFile('music.mp3')} volume={0.5} />
            <Img
                src={staticFile('animatediff.png')}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: `scale(${scale})`,
                    opacity: opacity,
                }}
            />

            <AbsoluteFill style={{
                background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.8))',
            }} />

            <Sequence from={20}>
                <div style={{
                    position: 'absolute',
                    bottom: 100,
                    width: '100%',
                    textAlign: 'center',
                    transform: `translateY(${interpolate(textSpring, [0, 1], [50, 0])}px)`,
                    opacity: textSpring,
                }}>
                    <h1 style={{
                        color: '#00d4ff',
                        fontSize: 120,
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: 10,
                        textShadow: '0 0 20px rgba(0,212,255,0.5)',
                        margin: 0,
                    }}>
                        AnimateDiff
                    </h1>
                    <p style={{
                        color: 'white',
                        fontSize: 40,
                        letterSpacing: 5,
                        opacity: 0.8,
                        marginTop: 20,
                    }}>
                        AI GENERATED ANIMATION
                    </p>
                </div>
            </Sequence>

            {/* Glitch Overlay */}
            {frame % 30 < 2 && (
                <AbsoluteFill style={{
                    backgroundColor: 'rgba(0,212,255,0.1)',
                    mixBlendMode: 'overlay',
                }} />
            )}
        </AbsoluteFill>
    );
};
