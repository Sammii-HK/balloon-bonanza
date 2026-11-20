# Balloon Bonanza local product verification

20 November 2026. Local candidate based on clean `4bb3edd`. This is an actual static local tool, not a deployment, recorded AI output or fabricated activity.

## Product and physics

Replaced the single floating theme button and default starter styles with a responsive playground: named Lucide controls, real pause/play, reset, 25/50/100 density choices, a selected-balloon marker and a keyboard alternative to dragging. The actual model remains a circle and triangular knot connected by one pin and two softer constraints, with the original palette, densities, restitution, air resistance, torque, initial force and small positive gravity. The new floor and side boundaries resize with the canvas. The room remains open above, so strong flings may leave the visible area until they fall back or the scene is reset.

The original full-window canvas never resized despite the README claim. A ResizeObserver now adjusts the renderer and boundaries while translating each knot with its body. Theme changes redraw the existing scene. Pause stops the Matter runner and render loop; a paused lift or One step advances a real single physics frame. Hidden tabs and reduced-motion preferences have explicit stop/start boundaries. Cleanup owns the loops, observer, media/visibility listeners, Mouse DOM handlers, canvas and Matter world. Wheel input is not used, so its default handler was detached to preserve page scrolling.

## Source checks

- Normal lint and build include the canonical Lucide source guard: zero blocking findings and zero review candidates.
- Normal test runs all eleven unchanged canonical regressions plus three real Matter physics cases. They verify 100 balloons retain 200 dynamic bodies, three boundary bodies and 300 balloon constraints; resizing does not duplicate walls/bodies or tear the body/knot offset; a lift produces a real upward force and changes a real step relative to an unlifted control.
- Lint, TypeScript/production build and all fourteen tests pass. Vite remains on its compatible version-six line, at 6.4.6; typescript-eslint remains on version eight, at 8.73.0. No broad major migration was forced.
- Initial dependency audit reported sixteen findings. The final resolved dependency tree reports zero. The existing Yarn lock retains the compatible updates.

## Actual Chrome checks

Desktop viewport 1144px and phone-sized viewport 390 by 844px:

- Actual 100-balloon scene, one canvas, correct local title and the new controls loaded. A transient browser-connection interruption occurred during the first screenshot attempt. It was recovered through the documented browser connection; the failed attempt is not counted as a screenshot or pause check.
- Pause stopped the actual selected position at `(313.902, 362.202)`. Switching from night to light while paused left both values exactly unchanged.
- Keyboard Right selected balloon 02. Up while paused advanced it from y314.697 to y313.352, keeping the simulation paused. Reset returned selection to 01 and retained exactly one canvas.
- Resizing to phone updated the actual canvas to 356 by 520 CSS pixels, 712 by 1040 drawing-buffer pixels at DPR2, and translated the selected body into the new bounds. The document width and scroll width both measured 390px. Every button measured at least 44px high.
- Choosing 25 changed the actual scene count and selection output; Play resumed the real scene. A pointer drag/fling moved the selected body, including travel above the open top. Space paused again; Right and One step worked on the phone-sized layout.
- The temporary viewport was reset and width 1144px confirmed before explicit browser handoff. No owner tabs were touched.

## Captures and limits

Actual unreleased local captures in `.codex-artifacts/`:

- `balloon-desktop-playground.jpg`: paused 100-balloon light-sky desktop view.
- `balloon-phone-playground.jpg`: paused 25-balloon phone view following real interaction.
- `balloon-phone-keyboard-controls.jpg`: actual selection and paused-step controls.

This is tuned rigid-body motion, not a buoyancy model. No FPS, broad browser, physical-touch, assistive-technology or universal no-leak certification is claimed. Reduced-motion and hidden-tab paths were inspected in source; operating-system preference and cross-tab lifecycle checks were not exercised in this focused browser pass. No service, provider, database, account, generation, model/audio download, publishing or deployment call ran.
