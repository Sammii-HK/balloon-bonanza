# Balloon Bonanza

A colourful Matter.js playground. Grab and fling balloons, choose how many are in the room, pause to look closer, or play using the keyboard.

Live at [balloon-bonanza.vercel.app](https://balloon-bonanza.vercel.app).

## How it works

Each balloon is a circle and a triangular knot joined by three constraints: one pin and two softer springs that keep the knot straight. Varied densities, high restitution, air resistance and a small amount of gravity shape the motion. The room has a floor and side walls, with open sky above.

## Controls

- Drag a balloon with a mouse or finger to send it in a new direction.
- Pause and Play stop and start the simulation. It also pauses when the tab is hidden, and starts paused if you prefer reduced motion.
- Focus the playground, then use Left and Right to choose a balloon, Up to give it a lift and Space to pause. The same actions are available as buttons.
- One step advances a single frame while paused.
- Start again, or choose 25, 50 or 100 balloons, to build a fresh scene.
- Switch between a light and a night sky. Your system colour preference is followed until you choose.

## Development

```sh
yarn install
yarn dev
yarn lint
yarn test
yarn build
```

Built with React 19, TypeScript, Vite 6, Matter.js and Lucide icons.
