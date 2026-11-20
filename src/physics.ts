import Matter from 'matter-js';

export const PALETTE = ['deepskyblue','dodgerblue','mediumspringgreen','limegreen','chartreuse','gold','orange','orangered','tomato','red','deeppink','hotpink','mediumvioletred','blueviolet','mediumpurple','cyan','aquamarine','yellow','springgreen','magenta'];
export interface Balloon { body: Matter.Body; knot: Matter.Body; constraints: Matter.Constraint[] }
export function createBalloon(x: number, y: number, random = Math.random): Balloon {
  const { Bodies, Constraint } = Matter;
  const color = PALETTE[Math.floor(random() * PALETTE.length)];
  const body = Bodies.circle(x, y, 30, { density: .02 + random() * .01, restitution: .95, frictionAir: .01, friction: .12, torque: 30 * (random() - .5), force: { x: 3 * (random() - .5), y: 0 }, render: { fillStyle: color } });
  const knot = Bodies.polygon(x, y + 33, 3, 5, { restitution: .95, friction: .02, density: .02 + random() * .01, frictionAir: .014, angle: Math.PI + .523, render: { fillStyle: color } });
  const constraints = [
    Constraint.create({ bodyA: body, bodyB: knot, pointA: { x: 0, y: 33 }, pointB: { x: 0, y: -4 }, length: 0, stiffness: .1, render: { visible: false } }),
    ...[-10,10].map(x => Constraint.create({ bodyA: body, bodyB: knot, pointA: { x, y: 33 }, pointB: { x, y: -14 }, length: 10, stiffness: .01, render: { visible: false } })),
  ];
  return { body, knot, constraints };
}
export function createBalloonWorld(width: number, height: number, count = 100, random = Math.random) {
  const engine = Matter.Engine.create();
  engine.gravity.y = .11;
  const balloons = Array.from({ length: count }, () => createBalloon(35 + random() * Math.max(0,width - 70), 35 + random() * Math.max(0,height / 2 - 70), random));
  for (const balloon of balloons) Matter.Composite.add(engine.world, [balloon.body, balloon.knot, ...balloon.constraints]);
  let walls: Matter.Body[] = [];
  function resize(nextWidth: number, nextHeight: number) {
    for (const wall of walls) Matter.Composite.remove(engine.world, wall);
    walls = [
      Matter.Bodies.rectangle(nextWidth / 2, nextHeight + 10, nextWidth + 40, 20, { isStatic: true, friction: .05, frictionStatic: .25, restitution: .95 }),
      Matter.Bodies.rectangle(-10, nextHeight / 2, 20, nextHeight * 3, { isStatic: true }),
      Matter.Bodies.rectangle(nextWidth + 10, nextHeight / 2, 20, nextHeight * 3, { isStatic: true }),
    ];
    Matter.Composite.add(engine.world, walls);
    for (const balloon of balloons) {
      const x = Math.max(32, Math.min(nextWidth - 32, balloon.body.position.x));
      const y = Math.max(32, Math.min(nextHeight - 45, balloon.body.position.y));
      const delta = { x: x - balloon.body.position.x, y: y - balloon.body.position.y };
      Matter.Body.translate(balloon.body, delta);
      Matter.Body.translate(balloon.knot, delta);
    }
  }
  resize(width, height);
  return { engine, balloons, resize };
}

export function liftBalloon(balloon: Balloon) {
  Matter.Body.applyForce(balloon.body, balloon.body.position, { x: 0, y: -balloon.body.mass * .018 });
}
