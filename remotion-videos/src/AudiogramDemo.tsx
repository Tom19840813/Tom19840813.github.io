import React from 'react';
import {
    AbsoluteFill,
    Audio,
    staticFile,
    useVideoConfig,
    Img,
    interpolate,
    useCurrentFrame,
} from 'remotion';
import { AudioVisualizer } from './AudioVisualizer';
import { Captions, Word } from './Captions';

const music = staticFile('music.mp3');
const background = staticFile('ai-art.jpg');

const words: Word[] = [
    { text: 'Welcome', start: 0, end: 15 },
    { text: 'to', start: 16, end: 25 },
    { text: 'the', start: 26, end: 35 },
    { text: 'future', start: 36, end: 60 },
    { text: 'of', start: 61, end: 75 },
    { text: 'video', start: 76, end: 90 },
    { text: 'creation', start: 91, end: 120 },
    { text: 'with', start: 121, end: 135 },
    { text: 'Remotion.', start: 136, end: 180 },
];

export const AudiogramDemo: React.FC = () => {
    const { width, height, durationInFrames } = useVideoConfig();
    const frame = useCurrentFrame();

    const opacity = interpolate(frame, [0, 30], [0, 1], {
        extrapolateRight: 'clamp',
    });

    return (
        <AbsoluteFill style={{ backgroundColor: '#0f172a' }}>
            {/* Background Image with Blur */}
            <AbsoluteFill>
                <Img
                    src={background}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'blur(10px) brightness(0.4)',
                        transform: 'scale(1.1)',
                    }}
                />
            </AbsoluteFill>

            <AbsoluteFill
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity,
                }}
            >
                {/* Album Art / Center Piece */}
                <div
                    style={{
                        width: '400px',
                        height: '400px',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        marginBottom: '60px',
                        border: '4px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <Img
                        src={background}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                </div>

                {/* Audio Visualizer */}
                <AudioVisualizer audioSrc={music} color="#60a5fa" />

                {/* Captions */}
                <Captions words={words} activeColor="#60a5fa" />
            </AbsoluteFill>

            <Audio src={music} />
        </AbsoluteFill>
    );
};
