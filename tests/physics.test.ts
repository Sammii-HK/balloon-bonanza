import { test } from 'node:test';
import assert from 'node:assert/strict';
import Matter from 'matter-js';
import { createBalloonWorld, liftBalloon } from '../src/physics.ts';

test('the hundred-balloon study retains two bodies and three constraints per balloon', () => {
  const world = createBalloonWorld(1000, 600, 100, () => .5);
  assert.equal(world.engine.gravity.y, .11);
  assert.equal(world.balloons.length, 100);
  assert.equal(Matter.Composite.allBodies(world.engine.world).filter(body => !body.isStatic).length, 200);
  assert.equal(Matter.Composite.allBodies(world.engine.world).filter(body => body.isStatic).length, 3);
  assert.equal(Matter.Composite.allConstraints(world.engine.world).length, 300);
  assert.deepEqual(world.balloons[0].constraints.map(c => c.stiffness), [.1,.01,.01]);
  assert.equal(world.balloons[0].body.restitution, .95);
});

test('resizing replaces bounds without duplicating bodies or tearing the body/knot offset', () => {
  const world = createBalloonWorld(1000, 600, 25, () => .5);
  const before = { x: world.balloons[0].knot.position.x - world.balloons[0].body.position.x, y: world.balloons[0].knot.position.y - world.balloons[0].body.position.y };
  world.resize(350, 500);
  world.resize(390, 520);
  assert.equal(Matter.Composite.allBodies(world.engine.world).length, 53);
  assert.equal(Matter.Composite.allConstraints(world.engine.world).length, 75);
  assert.ok(world.balloons.every(b => b.body.position.x >=32 && b.body.position.x <=358));
  const after = { x: world.balloons[0].knot.position.x - world.balloons[0].body.position.x, y: world.balloons[0].knot.position.y - world.balloons[0].body.position.y };
  assert.deepEqual(after, before);
  const floor = Matter.Composite.allBodies(world.engine.world).find(body => body.isStatic && body.position.x ===195);
  assert.equal(floor?.bounds.min.y, 520);
});

test('a keyboard lift applies real upward force and changes a real physics step', () => {
  const base = createBalloonWorld(1000, 600, 1, () => .5);
  const lifted = createBalloonWorld(1000, 600, 1, () => .5);
  liftBalloon(lifted.balloons[0]);
  assert.ok(lifted.balloons[0].body.force.y < 0);
  Matter.Engine.update(base.engine, 1000/60);
  Matter.Engine.update(lifted.engine, 1000/60);
  assert.ok(lifted.balloons[0].body.position.y < base.balloons[0].body.position.y);
});
