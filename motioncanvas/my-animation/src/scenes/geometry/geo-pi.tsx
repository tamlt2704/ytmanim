import {Rect, Txt, makeScene2D, Circle, Line, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, easeInOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, ORANGE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeIn, fadeInUp, showCreate, drawLine, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'\u03c0 is Everywhere'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={100} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  // Circle
  const circle = createRef<Circle>();
  view.add(<Circle ref={circle} x={-200} y={-400} size={300} stroke={ACCENT_COLOR} lineWidth={6} opacity={0} />);
  yield* all(circle().opacity(1, 0.3), circle().scale(1, 0.4, easeOutCubic));

  // Diameter line
  const diam = createRef<Line>();
  view.add(<Line ref={diam} points={[[-350, -400], [-50, -400]]} stroke={GREEN} lineWidth={5} end={0} opacity={1} />);
  const dLabel = createRef<Txt>();
  view.add(<Txt ref={dLabel} text={'d'} fill={GREEN} fontFamily={CODE_FONT} fontSize={44} fontWeight={800} x={-200} y={-350} opacity={0} />);
  yield* drawLine(diam(), 0.4);
  yield* fadeIn(dLabel(), 0.2);
  yield* waitFor(0.2);

  // Unroll circumference as a line
  const unroll = createRef<Line>();
  const unrollLen = 300 * Math.PI;
  view.add(<Line ref={unroll} points={[[-400, -180], [-400 + unrollLen, -180]]} stroke={ACCENT_COLOR} lineWidth={6} end={0} opacity={1} />);
  const cLabel = createRef<Txt>();
  view.add(<Txt ref={cLabel} text={'C = \u03c0d'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={44} fontWeight={800} x={0} y={-130} opacity={0} />);

  yield* drawLine(unroll(), 0.8);
  yield* fadeIn(cLabel(), 0.3);
  yield* waitFor(0.3);

  // Show π ≈ 3.14159...
  const piVal = createRef<Txt>();
  view.add(<Txt ref={piVal} text={'\u03c0 \u2248 3.14159265...'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={56} fontWeight={800} y={0} opacity={0} />);
  yield* fadeInUp(piVal(), 20, 0.4);
  yield* pulse(piVal() as any, 1.15, 0.3);

  // Fun fact
  const fact = createRef<Txt>();
  view.add(<Txt ref={fact} text={'Irrational: digits NEVER repeat\nor terminate!'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={32} y={150} textAlign={'center'} lineHeight={50} opacity={0} />);
  yield* fadeIn(fact(), 0.4);

  yield* waitFor(2);
});
