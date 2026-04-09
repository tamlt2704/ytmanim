import {Rect, Txt, makeScene2D, Circle, Line, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, easeInOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, ORANGE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeIn, fadeInUp, showCreate, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'A = \u03c0r\u00b2'} fill={GREEN} fontFamily={CODE_FONT} fontSize={110} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  // Circle
  const circ = createRef<Circle>();
  view.add(<Circle ref={circ} x={0} y={-420} size={320} fill={ACCENT_COLOR} opacity={0} scale={0} />);
  yield* all(circ().opacity(0.6, 0.3), circ().scale(1, 0.4, easeOutCubic));

  const rLine = createRef<Line>();
  view.add(<Line ref={rLine} points={[[0, -420], [160, -420]]} stroke={GREEN} lineWidth={5} end={0} opacity={1} />);
  const rLabel = createRef<Txt>();
  view.add(<Txt ref={rLabel} text={'r'} fill={GREEN} fontFamily={CODE_FONT} fontSize={44} fontWeight={800} x={80} y={-380} opacity={0} />);
  yield* rLine().end(1, 0.3, easeOutCubic);
  yield* fadeIn(rLabel(), 0.2);
  yield* waitFor(0.3);

  // "Slice into wedges" text
  const step1 = createRef<Txt>();
  view.add(<Txt ref={step1} text={'Slice into thin wedges...'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={36} fontWeight={700} y={-220} opacity={0} />);
  yield* fadeIn(step1(), 0.3);
  yield* waitFor(0.3);

  // Fade circle, show rearranged rectangle
  yield* all(circ().opacity(0.2, 0.3), step1().text('Rearrange into a rectangle!', 0.3));
  yield* waitFor(0.2);

  // Rectangle: width = πr, height = r
  const rectW = 500;
  const rectH = 160;
  const rect = createRef<Rect>();
  view.add(
    <Rect ref={rect} x={0} y={-50} width={rectW} height={rectH} radius={8} fill={ACCENT_COLOR} opacity={0} scale={0} />
  );
  yield* all(rect().opacity(0.6, 0.3), rect().scale(1, 0.5, easeOutCubic));

  // Dimension labels
  const wLabel = createRef<Txt>();
  const hLabel = createRef<Txt>();
  view.add(<Txt ref={wLabel} text={'\u03c0r'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={44} fontWeight={800} x={0} y={-50 - rectH / 2 - 35} opacity={0} />);
  view.add(<Txt ref={hLabel} text={'r'} fill={GREEN} fontFamily={CODE_FONT} fontSize={44} fontWeight={800} x={-rectW / 2 - 35} y={-50} opacity={0} />);
  yield* all(wLabel().opacity(1, 0.3), hLabel().opacity(1, 0.3));
  yield* waitFor(0.3);

  // Area = πr × r = πr²
  const calc = createRef<Txt>();
  view.add(<Txt ref={calc} text={'Area = \u03c0r \u00d7 r = \u03c0r\u00b2'} fill={GREEN} fontFamily={CODE_FONT} fontSize={64} fontWeight={800} y={120} opacity={0} />);
  yield* fadeInUp(calc(), 20, 0.4);
  yield* pulse(calc() as any, 1.15, 0.3);

  const fact = createRef<Txt>();
  view.add(<Txt ref={fact} text={'Infinite slices \u2192 perfect rectangle\nArchimedes figured this out in 250 BC!'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={320} textAlign={'center'} lineHeight={48} opacity={0} />);
  yield* fadeIn(fact(), 0.4);

  yield* waitFor(2);
});
