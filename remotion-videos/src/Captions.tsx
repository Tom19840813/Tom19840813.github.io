import React from 'react';
import { useCurrentFrame, interpolate, AbsoluteFill } from 'remotion';

export interface Word {
    text: string;
    start: number; // in frames
    end: number; // in frames
}

export const Captions: React.FC<{
    words: Word[];
    color?: string;
    activeColor?: string;
}> = ({ words, color = '#ffffff', activeColor = '#3b82f6' }) => {
    const frame = useCurrentFrame();

    return (
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '12px',
                padding: '40px',
                fontSize: '48px',
                fontWeight: 'bold',
                textAlign: 'center',
                fontFamily: 'Inter, sans-serif',
            }}
        >
            {words.map((word, i) => {
                const isActive = frame >= word.start && frame <= word.end;
                const opacity = isActive ? 1 : 0.3;
                const scale = isActive ? 1.1 : 1;

                return (
                    <span
                        key={i}
                        style={{
                            color: isActive ? activeColor : color,
                            opacity,
                            transform: `scale(${scale})`,
                            transition: 'all 0.1s ease-in-out',
                            display: 'inline-block',
                        }}
                    >
                        {word.text}
                    </span>
                );
            })}
        </div>
    );
};
