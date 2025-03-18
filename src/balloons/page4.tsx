'use client'

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
      engineRef.current.world.gravity.y = 0.11; // Minor gravity increase for slight bounce reduction
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
        friction: 0.12, // Slightly increased friction to reduce sliding
        frictionStatic: 0.25,
        restitution: 0.88, // Very small reduction in bounce
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

      // Balloon body (circle)
      const balloonBody = Bodies.circle(x, y, 30, {
        density: 0.028, // Slight density tweak for balance
        restitution: 0.88, // Very small reduction in bounce
        frictionAir: 0.014, // Fine-tuned air friction to slightly slow movement
        friction: 0.12, // Minor friction increase to limit sliding
        torque: 30 * (Math.random() - 0.5),
        force: {x: 3 * (Math.random() - 0.5), y: 0},
        render: { fillStyle: color, visible: true },
      });

      // Knot (triangle) with top corner trimmed and slightly overlapped
      const knot = Bodies.polygon(x, y + 33, 3, 5, {
        restitution: 0.88, // Ensuring bounce effect
        friction: 0.02, // Reduce friction to improve bounce
        render: { visible: false, opacity: 0 },
        render: { visible: false, opacity: 0 },
        density: 0.1,
        restitution: 0.88,
        frictionAir: 0.014,
        angle: Math.PI + 0.523,
        render: { fillStyle: color },
      });

      const constraint = Constraint.create({
        bodyA: balloonBody,
        bodyB: knot,
        pointA: { x: 0, y: 33 },
        pointB: { x: 0, y: -4 },
        length: -2, // Slight negative length to create an overlapping effect
        stiffness: 0.5, // Increased stiffness for better hinge behavior
        dampening: 0.5,
      });

      World.add(world, balloonBody);
      World.add(world, knot);
      World.add(world, constraint);

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
        render: { visible: false, opacity: 0 },
      },
    });
    World.add(world, mouseConstraint);

    return () => {
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
