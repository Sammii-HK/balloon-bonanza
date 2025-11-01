# Balloon Bonanza

A real-time physics simulation featuring interactive balloons with realistic collision dynamics.

<img width="1708" height="980" alt="Screenshot 2025-10-31 at 13 30 49" src="https://github.com/user-attachments/assets/5d75853a-03c5-4897-960c-75025e4f3e49" />

## Features

- **Real-time Physics Simulation** - 100 balloons with independent physics properties
- **Interactive Controls** - Drag and interact with balloons using mouse controls
- **Constraint-Based Balloons** - Each balloon consists of a body and knot connected via spring constraints
- **Light/Dark Mode** - Automatically detects system preferences with manual override
- **Optimized Performance** - Maintains 60 FPS with 200+ rigid bodies and 300+ constraints

## Technical Highlights

The simulation uses Matter.js's constraint-based physics engine to create realistic balloon behavior. Each balloon is composed of two connected rigid bodies (a circular balloon and triangular knot) linked by spring-damper constraints. This creates natural movement where the knot oscillates and responds to collisions while maintaining structural integrity.

Collision detection handles interactions between 100+ circular and polygonal bodies simultaneously, with tuned physics parameters for realistic balloon behavior including high restitution (bounciness), varied densities, and air friction effects.

The implementation uses React hooks to manage the physics engine lifecycle, ensuring proper cleanup and preventing memory leaks. The canvas background dynamically updates based on theme preference, and the simulation seamlessly adapts to window resizing.

## Technology Stack

- **React 19** - Component framework with Hooks API for lifecycle management
- **TypeScript 5.7** - Type-safe implementation with proper Matter.js type definitions
- **Matter.js 0.20.0** - 2D physics engine for rigid body dynamics and collision detection
- **Vite 6.2** - Build tool and development server with HMR
- **ESLint 9** - Code quality and linting
