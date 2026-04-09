import {Rect, Txt, makeScene2D, Circle, Line, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, ORANGE, PURPLE, CODE_FONT, TITLE_FONT, TERMINAL_BG} from '../../styles';
import {fadeIn, fadeInUp, showCreate, pulse, drawLine} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'\u03c6 = 1.618...'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={100} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  const sub = createRef<Txt>();
  view.add(<Txt ref={sub} text={'The Golden Ratio'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={40} y={-720} opacity={0} />);
  yield* fadeIn(sub(), 0.3);

  // Golden rectangle with nested squares (Fibonacci spiral)
  const fibs = [1, 1, 2, 3, 5, 8];
  const scale = 30;
  const colors = [ACCENT_COLOR, GREEN, ORANGE, PURPLE, '#f85149', '#39d353'];
  const rects = createRefArray<Rect>();

  // Build golden rectangle from Fibonacci squares
  let cx = -50, cy = -300;
  const positions = [
    {x: cx, y: cy, w: 1, h: 1},
    {x: cx + 1, y: cy, w: 1, h: 1},
    {x: cx, y: cy + 1, w: 2, h: 2},
    {x: cx + 2, y: cy - 1, w: 3, h: 3},
    {x: cx - 3, y: cy - 1, w: 5, h: 5},
    {x: cx - 3, y: cy + 4, w: 8, h: 8},
  ];

  for (let i = 0; i < 6; i++) {
    const p = positions[i];
    view.add(
      <Rect ref={rects} x={p.x * scale + p.w * scale / 2 - 100} y={p.y * scale + p.h * scale / 2}
        width={p.w * scale} height={p.h * scale} radius={4}
        stroke={colors[i]} lineWidth={3} fill={colors[i]} opacity={0} scale={0}>
        <Txt text={`${fibs[i]}`} fill={'#fff'} fontFamily={CODE_FONT} fontSize={Math.min(p.w * scale * 0.5, 40)} fontWeight={800} />
      </Rect>
    );
  }

  for (let i = 0; i < 6; i++) {
    yield* all(rects[i].opacity(0.5, 0.2), rects[i].scale(1, 0.3, easeOutCubic));
    yield* waitFor(0.1);
  }
  yield* waitFor(0.3);

  // Fibonacci sequence
  const fib = createRef<Txt>();
  view.add(<Txt ref={fib} text={'1, 1, 2, 3, 5, 8, 13, 21...'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={44} fontWeight={800} y={150} opacity={0} />);
  yield* fadeInUp(fib(), 20, 0.3);

  // Ratio converges
  const ratio = createRef<Txt>();
  view.add(<Txt ref={ratio} text={'8/5 = 1.6  |  13/8 = 1.625  |  21/13 = 1.615...'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={230} opacity={0} />);
  yield* fadeIn(ratio(), 0.3);

  const converge = createRef<Txt>();
  view.add(<Txt ref={converge} text={'\u2192 \u03c6 = 1.6180339...'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={52} fontWeight={800} y={320} opacity={0} />);
  yield* fadeInUp(converge(), 20, 0.4);
  yield* pulse(converge() as any, 1.15, 0.3);

  const fact = createRef<Txt>();
  view.add(<Txt ref={fact} text={'Found in nature: shells, flowers,\ngalaxies, and even your face'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={500} textAlign={'center'} lineHeight={48} opacity={0} />);
  yield* fadeIn(fact(), 0.4);

  yield* waitFor(2);
});
