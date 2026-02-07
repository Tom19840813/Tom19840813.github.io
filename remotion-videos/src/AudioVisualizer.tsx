import React from 'react';
import {
    useCurrentFrame,
    useVideoConfig,
    AbsoluteFill,
    interpolate,
} from 'remotion';
import { useAudioData, visualizeAudio } from '@remotion/media-utils';

export const AudioVisualizer: React.FC<{
    audioSrc: string;
    barCount?: number;
    color?: string;
}> = ({ audioSrc, barCount = 64, color = '#3b82f6' }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const audioData = useAudioData(audioSrc);

    if (!audioData) {
        return null;
    }

    const visualization = visualizeAudio({
        fps,
        frame,
        audioData,
        numberOfSamples: barCount,
    });

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-end',
                justifyContent: 'center',
                gap: '4px',
                height: '100px',
                width: '100%',
            }}
        >
            {visualization.map((v, i) => {
                const height = interpolate(v, [0, 1], [10, 100], {
                    extrapolateRight: 'clamp',
                });
                return (
                    <div
                        key={i}
                        style={{
                            width: '8px',
                            height: `${height}px`,
                            backgroundColor: color,
                            borderRadius: '4px',
                        }}
                    />
                );
            })}
        </div>
    );
};
