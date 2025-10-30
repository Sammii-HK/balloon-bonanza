'use client'

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";

const BalloonPop = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const poppedBalloons = useRef(new Set());
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const { Engine, Render, Runner, Bodies, World, Constraint, Mouse, MouseConstraint } = Matter;
    const poppedBalloonsSet = poppedBalloons.current;
    
    // Initialize Matter.js engine only once
    if (!engineRef.current) {
      const engine = Engine.create();
      engine.world.gravity.y = 0.11; // Minor gravity increase for slight bounce reduction
      engineRef.current = engine;
    }
    const engine = engineRef.current;
    if (!engine || !sceneRef.current) return;
    const { world } = engine;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: isDarkMode ? "#1a1a2e" : "#e0f7fa",
      },
    });
    renderRef.current = render;

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Create walls to contain balloons
    const walls = [
      Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 20, {
        isStatic: true,
        friction: 0.05, // Slightly increased friction to reduce sliding
        frictionStatic: 0.25,
        restitution: 0.95, // Very small reduction in bounce
      }), // Ground
      Bodies.rectangle(-10, window.innerHeight / 2, 20, window.innerHeight * 2, { isStatic: true }), // Left wall
      Bodies.rectangle(window.innerWidth + 10, window.innerHeight / 2, 20, window.innerHeight * 2, { isStatic: true }), // Right wall
    ];
    World.add(world, walls);

    const balloons = [];
    // const availableColors = ["magenta", "blue", "purple", "pink", "turquoise", "deeppink", "hotpink", "orchid", "paleturquoise", "plum", "thistle", "mediumturquoise"];
    // const availableColors = [
    //   "#FFC0CB", // Pink
    //   "#FFB6C1", // Light Pink
    //   "#FFD1DC", // Cotton Candy
    //   "#FF9AA2", // Soft Coral
    //   "#FFDAC1", // Peach
    //   "#FFF4E0", // Cream
    //   "#FFDDC1", // Pastel Orange
    //   "#FFFFE0", // Light Yellow
    //   "#E6E6FA", // Lavender
    //   "#D8BFD8", // Thistle
    //   "#B39EB5", // Mauve
    //   "#A7C7E7", // Baby Blue
    //   "#B5EAD7", // Mint Green
    //   "#C7CEEA", // Periwinkle
    //   "#D4A5A5", // Dusty Rose
    //   "#F4C2C2", // Bubblegum
    //   "#E0BBE4", // Lilac
    //   "#FFABAB", // Blush
    //   "#F7CAC9", // Rose Quartz
    //   "#FFCBDB", // Pastel Pink
    // ];
    // const availableColors = [
    //   "pink",
    //   "lightpink",
    //   "hotpink",
    //   "deeppink",
    //   "mistyrose",
    //   "peachpuff",
    //   "lavenderblush",
    //   "papayawhip",
    //   "moccasin",
    //   "lemonchiffon",
    //   "lightgoldenrodyellow",
    //   "palegoldenrod",
    //   "lavender",
    //   "thistle",
    //   "plum",
    //   "violet",
    //   "lightblue",
    //   "powderblue",
    //   "honeydew",
    //   "mintcream"
    // ];

    const availableColors = [
      "deepskyblue",  
      "dodgerblue",  
      "mediumspringgreen",  
      "limegreen",  
      "chartreuse",  
      "gold",  
      "orange",  
      "orangered",  
      "tomato",  
      "red",  
      "deeppink",  
      "hotpink",  
      "mediumvioletred",  
      "blueviolet",  
      "mediumpurple",  
      "cyan",  
      "aquamarine",  
      "yellow",  
      "springgreen",  
      "magenta"
    ];
    
    
    const createBalloon = (x: number, y: number) => {
      // if (availableColors.length === 0) return;
      const color = availableColors[Math.floor(Math.random() * availableColors.length)];

      // Balloon body (circle)
      const balloonBody = Bodies.circle(x, y, 30, {
        density: 0.02 + Math.random() * 0.01, // Slight density tweak for balance
        restitution: 0.95, // Very small reduction in bounce
        frictionAir: 0.01, // Fine-tuned air friction to slightly slow movement
        friction: 0.12, // Minor friction increase to limit sliding
        torque: 30 * (Math.random() - 0.5),
        force: {x: 3 * (Math.random() - 0.5), y: 0},
        render: { fillStyle: color, visible: true },
      });

      // Knot (triangle) with top corner trimmed and slightly overlapped
      const knot = Bodies.polygon(x, y + 33, 3, 5, {
        restitution: 0.95, // Ensuring bounce effect
        friction: 0.02, // Reduce friction to improve bounce
        density: 0.02 + Math.random() * 0.01,
        frictionAir: 0.014,
        angle: Math.PI + 0.523,
        render: { fillStyle: color },
      });

      const pinConstraint = Constraint.create({
        bodyA: balloonBody,
        bodyB: knot,
        render: { visible: false },
        pointA: { x: 0, y: 33 },
        pointB: { x: 0, y: -4 },
        length: 0,
        stiffness: 0.1, // Increased stiffness for better hinge behavior
      });

      // keeps the knot straight
      const leftSpring = Constraint.create({
        bodyA: balloonBody,
        bodyB: knot,
        render: { visible: false },
        pointA: { x: -10, y: 33 },
        pointB: { x: -10, y: -14 },
        length: 10, // Slight negative length to create an overlapping effect
        stiffness: 0.01, // Increased stiffness for better hinge behavior
      });

      const rightSpring = Constraint.create({
        bodyA: balloonBody,
        bodyB: knot,
        render: { visible: false },
        pointA: { x: 10, y: 33 },
        pointB: { x: 10, y: -14 },
        length: 10, 
        stiffness: 0.01,
      });

      World.add(world, balloonBody);
      World.add(world, knot);
      World.add(world, pinConstraint);
      World.add(world, leftSpring);
      World.add(world, rightSpring);

      balloons.push(balloonBody);
    };

    for (let i = 0; i < 100; i++) {
      createBalloon(Math.random() * window.innerWidth, Math.random() * window.innerHeight / 2);
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
      World.remove(world, mouseConstraint);
      Render.stop(render);
      World.clear(world, false);
      Engine.clear(engine);
      Runner.stop(runner);
      render.canvas.remove();
      poppedBalloonsSet.clear();
    };
  }, []);

  // Update background when theme changes without recreating the simulation
  useEffect(() => {
    if (renderRef.current) {
      renderRef.current.options.background = isDarkMode ? "#1a1a2e" : "#e0f7fa";
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <div ref={sceneRef} style={{ width: "100vw", height: "100vh" }} />
      <button
        onClick={toggleTheme}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          padding: "10px 20px",
          borderRadius: "8px",
          border: "1px solid",
          backgroundColor: isDarkMode ? "#2a2a3e" : "#ffffff",
          color: isDarkMode ? "#ffffff" : "#000000",
          borderColor: isDarkMode ? "#ffffff" : "#000000",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "500",
          transition: "all 0.3s ease",
        }}
      >
        {isDarkMode ? "☀️ Light" : "🌙 Dark"}
      </button>
    </div>
  );
};

export default BalloonPop;
