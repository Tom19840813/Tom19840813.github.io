import React from 'react';
import {
    TransitionSeries,
    springTiming,
    linearTiming
} from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { wipe } from '@remotion/transitions/wipe';
import { AnimateDiffVideo } from './AnimateDiffVideo';
import { GenericShowcaseVideo } from './GenericShowcaseVideo';
import { ThreeDShowcaseVideo } from './ThreeDShowcaseVideo';

export const MasterReel: React.FC = () => {
    return (
        <TransitionSeries>
            {/* 3D Intro */}
            <TransitionSeries.Sequence durationInFrames={150}>
                <ThreeDShowcaseVideo />
            </TransitionSeries.Sequence>

            <TransitionSeries.Transition
                timing={springTiming({ config: { damping: 200 } })}
                presentation={fade()}
            />

            {/* Intro: AnimateDiff */}
            <TransitionSeries.Sequence durationInFrames={150}>
                <AnimateDiffVideo />
            </TransitionSeries.Sequence>

            <TransitionSeries.Transition
                timing={springTiming({ config: { damping: 200 } })}
                presentation={fade()}
            />

            {/* AI Art Showcase */}
            <TransitionSeries.Sequence durationInFrames={150}>
                <GenericShowcaseVideo
                    imageSrc="ai-art.jpg"
                    audioSrc="music.mp3"
                    title="Neural Aesthetics"
                    subtitle="Visionary AI Art"
                    accentColor="#bc00ff"
                />
            </TransitionSeries.Sequence>

            <TransitionSeries.Transition
                timing={linearTiming({ durationInFrames: 30 })}
                presentation={wipe({ direction: 'from-left' })}
            />

            {/* Three Body Showcase */}
            <TransitionSeries.Sequence durationInFrames={150}>
                <GenericShowcaseVideo
                    imageSrc="3body.jpg"
                    audioSrc="music.mp3"
                    title="Liquid Cosmos"
                    subtitle="Celestial Mechanics"
                    accentColor="#ff3e3e"
                />
            </TransitionSeries.Sequence>

            <TransitionSeries.Transition
                timing={springTiming({ config: { damping: 100 } })}
                presentation={fade()}
            />

            {/* VR Reality */}
            <TransitionSeries.Sequence durationInFrames={150}>
                <GenericShowcaseVideo
                    imageSrc="vr-reality.png"
                    audioSrc="music.mp3"
                    title="New Horizons"
                    subtitle="Virtual Realities"
                    accentColor="#00fbff"
                />
            </TransitionSeries.Sequence>

            <TransitionSeries.Transition
                timing={linearTiming({ durationInFrames: 30 })}
                presentation={wipe({ direction: 'from-top' })}
            />

            {/* Engineering */}
            <TransitionSeries.Sequence durationInFrames={150}>
                <GenericShowcaseVideo
                    imageSrc="build.jpg"
                    audioSrc="music.mp3"
                    title="Precision Build"
                    subtitle="Structural Excellence"
                    accentColor="#ffa200"
                />
            </TransitionSeries.Sequence>

            <TransitionSeries.Transition
                timing={springTiming({ config: { damping: 200 } })}
                presentation={fade()}
            />

            {/* Outro: Nike */}
            <TransitionSeries.Sequence durationInFrames={150}>
                <GenericShowcaseVideo
                    imageSrc="nike.jpg"
                    audioSrc="music.mp3"
                    title="Infinite Energy"
                    subtitle="Performance Redefined"
                    accentColor="#ffffff"
                />
            </TransitionSeries.Sequence>
        </TransitionSeries>
    );
};
