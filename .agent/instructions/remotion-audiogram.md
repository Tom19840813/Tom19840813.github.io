# Remotion Audiogram Reference

This document captures the key patterns and components for creating audiograms with Remotion, inspired by the `remotion-dev/template-audiogram`.

## Key Components

### 1. Audio Visualizer
Uses `@remotion/media-utils` to process audio data and render a waveform.
- **Hook**: `useAudioData(src)`
- **Function**: `visualizeAudio({ fps, frame, audioData, numberOfSamples })`
- **Output**: An array of values (0 to 1) representing frequency amplitudes.

### 2. Synchronized Captions
Renders text words mapped to specific time ranges (frames or seconds).
- **Data Structure**: `Array<{ text: string, start: number, end: number }>`
- **Rendering**: Check `useCurrentFrame()` against each word's `start` and `end`.

### 3. Assets
- **Audio**: Typically optimized as MP3 or WAV.
- **Transcription**: Can be generated using OpenAI Whisper or provided as SRT/JSON.

## Best Practices
- **Blurry Backgrounds**: Use a blurred version of the album art or a relevant image to add depth.
- **Animations**: Add subtle scales or opacity transitions to the active word in captions.
- **Frame Rate**: Typically rendered at 30 or 60 fps for smooth visualization.

## Dependencies
- `remotion`
- `@remotion/media-utils`
- `@remotion/media` (for `<Audio />` component)
