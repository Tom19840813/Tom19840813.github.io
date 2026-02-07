# Remotion Development Guidelines

This document contains the core principles and system prompt for developing Remotion videos in this project. Use these rules for every Remotion-related task.

## About Remotion
Remotion is a framework that can create videos programmatically based on React.js. All output should be valid React code and written in TypeScript.

## Project Structure
- **Entry File**: `src/index.ts` (calls `registerRoot`).
- **Root File**: `src/Root.tsx` (contains `<Composition>` definitions).
- **Default Config**: 
  - FPS: 30
  - Width: 1920
  - Height: 1080
  - ID: `MyComp`

## Component Rules
- Use `<Video>` and `<Audio>` from `@remotion/media`.
- Use `<Img>` from `remotion` for static images.
- Use `<Gif>` from `@remotion/gif` for animated GIFs.
- **Assets**: Use `staticFile()` for files in the `public/` folder.
- **Layering**: Use `AbsoluteFill` for stacking elements.
- **Timing**: Use `Sequence`, `Series`, and `TransitionSeries` (from `@remotion/transitions`).
- **Randomness**: Use `random(seed)` from `remotion` instead of `Math.random()`.
- **Animation**: 
  - Use `interpolate(frame, [in], [out], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })`.
  - Use `spring({ fps, frame, config: { damping: 200 } })`.

## Rendering
- CLI: `npx remotion render [id]`
- Still: `npx remotion still [id]`
- Lambda: Follow `remotion.dev/docs/lambda` procedures if required.
