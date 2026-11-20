import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Circle, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Moon, Pause, Play, RotateCcw, StepForward, Sun } from 'lucide-react';
import { createScene, type BalloonScene } from './scene';
import './App.css';

const preference = (query: string) => typeof window !== 'undefined' && Boolean(window.matchMedia?.(query).matches);

export default function BalloonBonanza() {
  const sceneElement = useRef<HTMLDivElement>(null);
  const scene = useRef<BalloonScene | null>(null);
  const [dark, setDark] = useState(() => preference('(prefers-color-scheme: dark)'));
  const [paused, setPaused] = useState(() => preference('(prefers-reduced-motion: reduce)'));
  const [visible, setVisible] = useState(() => !document.hidden);
  const [count, setCount] = useState(100);
  const [generation, setGeneration] = useState(0);
  const [selected, setSelected] = useState(0);
  const manualTheme = useRef(false);
  const preferences = useRef({ dark, paused });
  useEffect(() => { preferences.current = { dark, paused }; }, [dark, paused]);

  useEffect(() => {
    if (!sceneElement.current) return;
    const instance = createScene(sceneElement.current, count, setSelected);
    scene.current = instance;
    instance.theme(preferences.current.dark);
    instance.setRunning(!preferences.current.paused && !document.hidden);
    setSelected(0);
    const visibility = () => { setVisible(!document.hidden); instance.setRunning(!preferences.current.paused && !document.hidden); };
    document.addEventListener('visibilitychange', visibility);
    return () => { document.removeEventListener('visibilitychange', visibility); instance.dispose(); scene.current = null; };
  }, [count, generation]);
  useEffect(() => { scene.current?.theme(dark); }, [dark]);
  useEffect(() => { scene.current?.setRunning(!paused && !document.hidden); }, [paused]);
  useEffect(() => {
    const color = window.matchMedia('(prefers-color-scheme: dark)');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onColor = (event: MediaQueryListEvent) => { if (!manualTheme.current) setDark(event.matches); };
    const onMotion = (event: MediaQueryListEvent) => { if (event.matches) setPaused(true); };
    color.addEventListener('change', onColor);
    motion.addEventListener('change', onMotion);
    return () => { color.removeEventListener('change', onColor); motion.removeEventListener('change', onMotion); };
  }, []);

  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (!['ArrowLeft','ArrowRight','ArrowUp',' '].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'ArrowLeft') scene.current?.select(selected - 1);
    if (event.key === 'ArrowRight') scene.current?.select(selected + 1);
    if (event.key === 'ArrowUp') scene.current?.lift();
    if (event.key === ' ') setPaused(value => !value);
  }
  const running = !paused && visible;
  return <div className="balloon-app" data-theme={dark ? 'dark' : 'light'}>
    <div className="page-shell">
      <header><a className="wordmark" href="./">balloon<br/><span>bonanza.</span></a><a className="story-link" href="https://sammii.dev/projects/balloon-bonanza/">Behind the bounce<ArrowUpRight size={16} aria-hidden="true" /></a></header>
      <main>
        <section className="intro" aria-labelledby="title"><div><p className="eyebrow">A COLOURFUL COLLISION STUDY</p><h1 id="title">Balloons,<br/><em>with a bounce.</em></h1></div><div className="intro-copy"><p>Grab, fling, and see where they go. A little playground made of circles, knots and spring constraints.</p><span>Low gravity. Bright colours. Plenty of room to play.</span></div></section>
        <section className="playground" aria-labelledby="playground-title">
          <div className="toolbar"><div><h2 id="playground-title">Room to play</h2><span className="status" role="status"><Circle className={running ? 'status-dot live' : 'status-dot'} size={6} fill="currentColor" aria-hidden="true"/>{running ? 'In motion' : paused ? 'Paused' : 'Paused while this tab is hidden'}</span></div><div className="primary-controls"><button onClick={() => setPaused(value => !value)}>{paused ? <Play size={16} aria-hidden="true"/> : <Pause size={16} aria-hidden="true"/>}{paused ? 'Play' : 'Pause'}</button><button onClick={() => setGeneration(value => value + 1)}><RotateCcw size={16} aria-hidden="true"/>Start again</button><button onClick={() => { manualTheme.current = true; setDark(value => !value); }}>{dark ? <Sun size={16} aria-hidden="true"/> : <Moon size={16} aria-hidden="true"/>}{dark ? 'Light sky' : 'Night sky'}</button></div></div>
          <div ref={sceneElement} className="scene" tabIndex={0} role="group" aria-label="Balloon physics playground" aria-describedby="keyboard-help" onKeyDown={keyboard}/>
          <div className="scene-footer"><p>Drag a balloon to give it a new direction.</p><label htmlFor="balloon-count">Make room for<select id="balloon-count" value={count} onChange={event => setCount(Number(event.target.value))}><option value="25">25 balloons</option><option value="50">50 balloons</option><option value="100">100 balloons</option></select></label></div>
        </section>
        <section className="details"><div className="keyboard-tools"><p className="eyebrow">ANOTHER WAY TO PLAY</p><h2>No dragging needed.</h2><p id="keyboard-help">Focus the playground. Left and right choose a balloon, up gives it a lift, and Space pauses. Or use these buttons.</p><div className="selection"><button aria-label="Previous balloon" onClick={() => scene.current?.select(selected - 1)}><ArrowLeft size={18} aria-hidden="true"/></button><output aria-live="polite">Balloon {String(selected + 1).padStart(2,'0')} <span>of {count}</span></output><button aria-label="Next balloon" onClick={() => scene.current?.select(selected + 1)}><ArrowRight size={18} aria-hidden="true"/></button><button onClick={() => scene.current?.lift()}><ArrowUp size={17} aria-hidden="true"/>Give a lift</button><button disabled={!paused} onClick={() => scene.current?.step()}><StepForward size={17} aria-hidden="true"/>One step</button></div></div><div className="physics-note"><p className="eyebrow">WHAT’S REALLY HAPPENING</p><h2>Two shapes. Three connections.</h2><p>Each balloon is a circle and a triangular knot, tied together by three constraints. Reduced gravity, air resistance and bouncy collisions shape the motion. It’s tuned rigid-body physics, rather than a buoyancy model.</p></div></section>
      </main><footer><p>A small study in motion, by Sammii.</p><a href="https://labs.sammii.dev">More things to play with<ArrowUpRight size={15} aria-hidden="true"/></a></footer>
    </div>
  </div>;
}
