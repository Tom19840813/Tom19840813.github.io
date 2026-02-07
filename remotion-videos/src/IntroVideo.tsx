import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const IntroVideo: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, height, width } = useVideoConfig();

    const entrance = spring({
        frame,
        fps,
        config: {
            damping: 12,
        },
    });

    const logoScale = interpolate(entrance, [0, 1], [0, 1.5]);
    const logoOpacity = interpolate(frame, [0, 20], [0, 1]);

    const titleReveal = spring({
        frame: frame - 30,
        fps,
        config: { damping: 10 }
    });

    return (
        <div className="container" style={{ backgroundColor: '#050510' }}>
            <div
                style={{
                    transform: `scale(${logoScale})`,
                    opacity: logoOpacity,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <div
                    className="title"
                    style={{
                        fontSize: 200,
                        letterSpacing: -10,
                    }}
                >
                    TM
                </div>
                <div style={{
                    color: '#e0e0e0',
                    fontSize: 40,
                    fontWeight: 600,
                    marginTop: 20,
                    opacity: titleReveal,
                    transform: `translateY(${(1 - titleReveal) * 20}px)`
                }}>
                    30+ Years of IT Excellence
                </div>
            </div>
        </div>
    );
};
