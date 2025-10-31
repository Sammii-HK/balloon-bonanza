# Balloon Bonanza

A real-time physics simulation using Matter.js to render interactive balloons with realistic collision dynamics and constraint-based interactions.

<img width="1708" height="980" alt="Screenshot 2025-10-31 at 13 30 49" src="https://github.com/user-attachments/assets/5d75853a-03c5-4897-960c-75025e4f3e49" />

## Technical Implementation

### Physics Engine Architecture

Built on **Matter.js 0.20.0**, which implements a constraint-based physics solver using the **Sequential Impulse** algorithm. The engine operates at a fixed timestep, solving constraints iteratively to approximate real-world physics behavior.

### Collision Detection Mathematics

The simulation handles collision detection between 100+ circular and polygonal bodies. Matter.js uses **Sweep and Prune** (SAP) broad-phase detection combined with **SAT (Separating Axis Theorem)** for narrow-phase detection between convex shapes.

**Collision Response Formula:**

When two bodies collide, the impulse `J` applied to resolve the collision is calculated as:

```
J = -(1 + e) × (v_rel · n) / (1/m_a + 1/m_b)
```

Where:
- `e` = coefficient of restitution (0.95 in this implementation)
- `v_rel` = relative velocity vector between bodies
- `n` = collision normal vector
- `m_a`, `m_b` = masses of colliding bodies

The post-collision velocities are then:

```
v_a' = v_a + (J / m_a) × n
v_b' = v_b - (J / m_b) × n
```

### Balloon Composition

Each balloon consists of two rigid bodies connected by constraints:

1. **Balloon Body**: Circular body with radius `r = 30px`
   - Mass: `m = density × area = (0.02 + random(0, 0.01)) × π × 30²`
   - Density range: `[0.02, 0.03]` (varied per balloon for natural variation)

2. **Knot**: Triangular polygon (3 vertices, radius 5px)
   - Angle offset: `π + 0.523 radians` (inverted, ~30° tilt)
   - Positioned at `(x, y + 33)` relative to balloon center

### Constraint System

The balloon maintains its structural integrity through three **spring-damper constraints** connecting the body to the knot:

#### Pin Constraint (Primary Hinge)
```
length = 0 (hard constraint)
stiffness = 0.1
pointA: (0, 33) on balloon body
pointB: (0, -4) on knot
```

This creates a rotational hinge point. The constraint force `F` is calculated as:

```
F = stiffness × (current_distance - target_length) × direction_vector
```

#### Lateral Spring Constraints
Two additional constraints maintain the knot's angular alignment:

**Left Spring:**
```
length = 10px
stiffness = 0.01
pointA: (-10, 33) on balloon body
pointB: (-10, -14) on knot
```

**Right Spring:**
```
length = 10px  
stiffness = 0.01
pointA: (10, 33) on balloon body
pointB: (10, -14) on knot
```

The `length = 10px` creates a slight tension that keeps the knot oriented downward, while the low `stiffness = 0.01` allows natural oscillation during collisions.

### Force Physics

**Gravity:**
```
F_gravity = m × g
where g = [0, 0.11] m/s² (upward in Matter.js coordinates)
```

**Air Friction (Drag):**
The velocity-dependent drag force applied to each body:

```
F_drag = -frictionAir × velocity² × sign(velocity)
```

With `frictionAir = 0.01` for the balloon body and `0.014` for the knot, creating realistic terminal velocity behavior.

**Contact Friction (Coulomb Model):**
```
F_friction = min(μ × F_normal, |F_tangential|)
```

Where:
- Static friction coefficient: `0.25` (walls)
- Dynamic friction coefficient: `0.05` (walls), `0.12` (balloon body), `0.02` (knot)

The lower friction on the knot allows it to slide more freely during collisions, creating a more dynamic visual effect.

### Restitution (Bounciness)

All bodies use `restitution = 0.95`, meaning they retain 95% of their relative velocity after collision:

```
v_after = e × v_before
```

This high restitution value creates the characteristic bouncy balloon behavior, with minimal energy loss on each collision.

### Initial Conditions & Randomization

Each balloon is initialized with randomized properties:
- Initial position: `x ∈ [0, window.innerWidth]`, `y ∈ [0, window.innerHeight/2]`
- Initial torque: `τ ∈ [-15, 15]` N·m
- Initial horizontal force: `F_x ∈ [-1.5, 1.5]` N
- Density variation: `ρ ∈ [0.02, 0.03]` kg/m²

This randomization ensures natural dispersion and prevents synchronized motion patterns.

### Mouse Interaction Physics

The mouse constraint uses a spring-damper system to connect the cursor position to the nearest body:

```
stiffness = 0.05
```

The constraint creates a virtual spring between mouse and body, allowing drag and release mechanics. The low stiffness prevents excessive throwing forces while maintaining responsive interaction.

### Boundary Conditions

Static walls are positioned to create a closed system:
- Ground: `y = window.innerHeight`, `width = window.innerWidth`, `height = 20px`
- Side walls: `x = -10` and `x = window.innerWidth + 10`, extending beyond viewport

All walls use `isStatic = true`, meaning they have infinite mass and don't respond to collisions, only applying forces to dynamic bodies.

### Performance Considerations

The simulation runs with:
- **100 simultaneous balloons** (200 rigid bodies + 300 constraints)
- **Fixed timestep solver** iterations per frame
- **60 FPS target** using `Runner` with automatic delta timing

The constraint solver iterates multiple times per frame to converge on stable solutions, with collision pairs resolved using the impulse-based method described above.

## Technology Stack

- **React 19** - Component framework with Hooks API (`useRef`, `useEffect`) for managing lifecycle and DOM references
- **TypeScript 5.7** - Type-safe implementation with proper typing for Matter.js engine references and DOM refs
- **Matter.js 0.20.0** - 2D physics engine implementing constraint-based rigid body dynamics
- **Vite 6.2** - Build tool and development server with HMR (Hot Module Replacement) for rapid iteration
- **ESLint 9** - Code quality and linting with React-specific rules
