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

interface GenericShowcaseVideoProps {
    imageSrc: string;
    audioSrc: string;
    title: string;
    subtitle: string;
    accentColor?: string;
}

export const GenericShowcaseVideo: React.FC<GenericShowcaseVideoProps> = ({
    imageSrc,
    audioSrc,
    title,
    subtitle,
    accentColor = '#00d4ff'
}) => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    const opacity = interpolate(frame, [0, 20], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    const scale = interpolate(frame, [0, durationInFrames], [1, 1.15], {
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
            <Audio src={staticFile(audioSrc)} volume={0.5} />
            <Img
                src={staticFile(imageSrc)}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: `scale(${scale})`,
                    opacity: opacity,
                }}
            />

            <AbsoluteFill style={{
                background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.85))',
            }} />

            <Sequence from={15}>
                <div style={{
                    position: 'absolute',
                    bottom: 120,
                    width: '100%',
                    textAlign: 'center',
                    transform: `translateY(${interpolate(textSpring, [0, 1], [40, 0])}px)`,
                    opacity: textSpring,
                }}>
                    <h1 style={{
                        color: accentColor,
                        fontSize: 100,
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: 8,
                        textShadow: `0 0 20px ${accentColor}80`,
                        margin: 0,
                    }}>
                        {title}
                    </h1>
                    <p style={{
                        color: 'white',
                        fontSize: 35,
                        letterSpacing: 4,
                        opacity: 0.9,
                        marginTop: 15,
                        textTransform: 'uppercase'
                    }}>
                        {subtitle}
                    </p>
                </div>
            </Sequence>

            {/* Micro Glitch Effect */}
            {frame % 45 < 2 && (
                <AbsoluteFill style={{
                    backgroundColor: `${accentColor}10`,
                    mixBlendMode: 'overlay',
                }} />
            )}
        </AbsoluteFill>
    );
};
