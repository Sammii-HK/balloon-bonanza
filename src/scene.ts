import Matter from 'matter-js';
import { createBalloonWorld, liftBalloon } from './physics';

export function createScene(element: HTMLDivElement, count: number, onSelect: (index: number) => void) {
  const { Engine, Render, Runner, Mouse, MouseConstraint, Composite, Events } = Matter;
  const size = () => ({ width: Math.max(200, Math.round(element.clientWidth)), height: Math.max(200, Math.round(element.clientHeight)) });
  const { width, height } = size();
  const world = createBalloonWorld(width, height, count);
  const render = Render.create({ element, engine: world.engine, options: { width, height, wireframes: false, background: '#f1ece3', pixelRatio: Math.min(window.devicePixelRatio || 1, 2) } });
  render.canvas.setAttribute('aria-hidden', 'true');
  render.canvas.dataset.balloonCount = String(count);
  const runner = Runner.create();
  // Matter 0.20 owns these DOM handlers; the 0.19 declaration omits them.
  const mouse = Mouse.create(render.canvas) as Matter.Mouse & Record<'mousemove' | 'mousedown' | 'mouseup' | 'mousewheel', EventListener>;
  // Wheel input is not used by this playground; keep normal page scrolling.
  render.canvas.removeEventListener('wheel', mouse.mousewheel);
  const grab = MouseConstraint.create(world.engine, { mouse, constraint: { stiffness: .05, render: { visible: false } } });
  Composite.add(world.engine.world, grab);
  let selected = 0;
  let running = false;
  let disposed = false;
  let highlight = '#302935';
  const draw = () => { if (!disposed) Render.world(render); };
  const annotate = () => {
    const body = world.balloons[selected]?.body;
    if (!body) return;
    render.canvas.dataset.selectedX = body.position.x.toFixed(3);
    render.canvas.dataset.selectedY = body.position.y.toFixed(3);
    render.canvas.dataset.running = String(running);
    const context = render.context;
    context.save();
    context.strokeStyle = highlight;
    context.lineWidth = 2;
    context.setLineDash([4,4]);
    context.beginPath();
    context.arc(body.position.x, body.position.y, 36, 0, Math.PI * 2);
    context.stroke();
    context.restore();
  };
  Events.on(render, 'afterRender', annotate);
  const select = (index: number) => { selected = (index + count) % count; onSelect(selected); draw(); };
  const drag = (event: Matter.IEvent<Matter.MouseConstraint> & { body?: Matter.Body }) => {
    const index = world.balloons.findIndex(balloon => balloon.body === event.body || balloon.knot === event.body);
    if (index >= 0) select(index);
  };
  Events.on(grab, 'startdrag', drag);
  const setRunning = (next: boolean) => {
    if (disposed || next === running) return;
    running = next;
    if (next) { Runner.run(runner, world.engine); Render.run(render); }
    else { Runner.stop(runner); Render.stop(render); draw(); }
  };
  const observer = new ResizeObserver(() => {
    if (disposed) return;
    const sizeNow = size();
    world.resize(sizeNow.width, sizeNow.height);
    // This runtime API was added after the installed declaration's release.
    (Render as typeof Render & { setSize(render: Matter.Render, width: number, height: number): void }).setSize(render, sizeNow.width, sizeNow.height);
    draw();
  });
  observer.observe(element);
  draw();
  return {
    setRunning,
    select,
    lift() { liftBalloon(world.balloons[selected]); if (!running) { Engine.update(world.engine, 1000 / 60); draw(); } },
    step() { if (!running) { Engine.update(world.engine, 1000 / 60); draw(); } },
    theme(dark: boolean) { render.options.background = dark ? '#19181f' : '#f1ece3'; highlight = dark ? '#fff7ea' : '#302935'; draw(); },
    dispose() {
      if (disposed) return;
      setRunning(false);
      disposed = true;
      observer.disconnect();
      Events.off(render, 'afterRender', annotate);
      Events.off(grab, 'startdrag', drag);
      // Mouse.create owns these listeners; clearing its event data alone does
      // not detach DOM listeners or release touch/wheel handling.
      for (const [name, handler] of [['mousemove',mouse.mousemove],['mousedown',mouse.mousedown],['mouseup',mouse.mouseup],['wheel',mouse.mousewheel],['touchmove',mouse.mousemove],['touchstart',mouse.mousedown],['touchend',mouse.mouseup]] as const) render.canvas.removeEventListener(name, handler as EventListener);
      Mouse.clearSourceEvents(mouse);
      Composite.clear(world.engine.world, false);
      Engine.clear(world.engine);
      render.canvas.remove();
      render.textures = {};
    },
  };
}
export type BalloonScene = ReturnType<typeof createScene>;
