import { useEffect, useRef } from "react";
import Matter from "matter-js";

const BalloonPop = () => {
  const sceneRef = useRef(null);
  const poppedBalloons = useRef(new Set());
  const engineRef = useRef(null);

  useEffect(() => {
    const { Engine, Render, Runner, Bodies, World, Events, Body, Mouse, MouseConstraint, Vector, Constraint } = Matter;
    
    // Initialize Matter.js engine only once
    if (!engineRef.current) {
      engineRef.current = Engine.create();
      Matter.Resolver._restingThresh = 0.000001;
      engineRef.current.world.gravity.y = 0.1; // Balanced gravity for controlled descent
    }
    const engine = engineRef.current;
    const { world } = engine;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: "#e0f7fa",
      },
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Create walls to contain balloons
    const walls = [
      Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 20, {
        isStatic: true,
        friction: 0.001, // Lower friction for better bounce
        frictionStatic: 0,
        restitution: 1, // Maximum bounce effect
      }), // Ground
      Bodies.rectangle(-10, window.innerHeight / 2, 20, window.innerHeight * 2, { isStatic: true }), // Left wall
      Bodies.rectangle(window.innerWidth + 10, window.innerHeight / 2, 20, window.innerHeight * 2, { isStatic: true }), // Right wall
    ];
    World.add(world, walls);

    const balloons = [];
    const availableColors = ["red", "blue", "green", "yellow", "purple", "orange", "pink"];
    
    const createBalloon = (x, y, index) => {
      if (availableColors.length === 0) return;
      const color = availableColors.splice(index % availableColors.length, 1)[0];
      const initialSpin = (Math.random() - 0.5) * 0.01; // Reduced spin to prevent excessive rotation

      // Balloon body (circle)
      const balloonBody = Bodies.circle(x, y, 30, {
        density: 0.2,
        // mass: 0.001,
        restitution: 1, // Maximum bounce effect
        frictionAir: 0.00001, // Lower air friction to retain bounce energy
        render: { fillStyle: color },
      });

      //Knot (triangle) slightly overlapping the bottom of the balloon
      const knot = Bodies.polygon(x, y + 31, 3, 6, {
        density: 0.2,
        //mass: 0.0005,
        restitution: 1,
        frictionAir: 0.001,
        angle: Math.PI + 0.523,
        render: { fillStyle: color },
      });

      const constraint = Constraint.create({
        bodyA: balloonBody,
        bodyB: knot,
        pointA: {x: 0, y: 31},
        pointB: {x: 0, y: -6},
        length: 0,
        stiffness: 0.7
      })

      // Create a compound body (balloon + knot)
      // const balloon = Body.create({
      //   parts: [balloonBody, knot],
      //   // inertia: 5,
      //   // friction: 0.0005,
      //   // angularDamping: 0.05, // Lower damping for more natural spin retention
      //   // torque: initialSpin,
      // });

      World.add(world, balloonBody);
      World.add(world, knot);
      World.add(world, constraint)

      balloons.push(balloonBody);
    };

    for (let i = 0; i < 7; i++) {
      createBalloon(Math.random() * window.innerWidth, Math.random() * window.innerHeight / 2, i);
    }

    // Add mouse interaction
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.05, // Further reduced stiffness to limit throwing force
        render: { visible: false },
      },
    });
    World.add(world, mouseConstraint);

    return () => {
      Events.off(engine, "collisionStart", handleCollision);
      World.remove(world, mouseConstraint);
      Render.stop(render);
      World.clear(world);
      Engine.clear(engine);
      Runner.stop(runner);
      render.canvas.remove();
      poppedBalloons.current.clear();
    };
  }, []);

  return <div ref={sceneRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default BalloonPop;
