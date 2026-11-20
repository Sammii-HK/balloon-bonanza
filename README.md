# Balloon Bonanza

A colourful Matter.js playground. Grab and fling balloons, choose how many are in the room, pause to look closer, or play using the keyboard.

## The actual model

Each balloon is a circle and a triangular knot joined by three constraints: one pin and two softer connections. The original bright palette, density range, restitution, air resistance, rotation/initial force and small positive gravity are retained. This is tuned rigid-body motion, not a buoyancy or gas simulation.

The initial 100-balloon world contains 200 dynamic bodies, three boundary bodies and 300 balloon constraints, plus the mouse constraint while the interactive scene is mounted. Counts of 25 and 50 give the same two-body construction more space. The room has a floor and side boundaries, with open space above. A keyboard lift applies an upward force rather than teleporting a balloon.

## Controls

- Drag a balloon with a pointer or touch. The surrounding page remains scrollable.
- Pause/Play controls both the physics runner and rendering loop. Hidden tabs stop both loops. Reduced-motion preference starts paused, with explicit Play available.
- Focus the playground: Left/Right select a balloon, Up gives it a lift, and Space pauses or resumes. The same actions have labelled buttons.
- One step advances a single physics frame while paused. A paused lift also advances one frame so its effect can be examined.
- Start again or choose a count to create a new scene. Resize changes the canvas and boundaries while translating each body's knot with it.
- Light and night skies update the existing renderer. System colour preference is followed until you make a manual choice.

The selected balloon has a dashed ring. Canvas artwork is decorative to assistive technology; labelled controls and selection output provide the keyboard alternative. Physical touch, browser and assistive-technology coverage are separate from the local responsive review.

## Local development

```sh
npm install
npm run dev
npm run lint
npm test
npm run build
```

The existing Yarn lock records the compatible dependency updates. The build is a local static Vite site; there are no provider, account, database or generation calls. Normal lint/build include the canonical Lucide source check, and normal tests include its eleven regressions plus meaningful physics cases. All interface icons are named Lucide components; the balloon shapes remain canvas artwork.

Scene cleanup stops both loops, disconnects resizing and visibility/media listeners, removes canvas mouse/touch handlers and clears Matter resources. Rendering uses a capped device-pixel ratio. These implementation boundaries are not a measured frame-rate or universal no-leak claim. No fixed FPS or broad device compatibility claim is made.
