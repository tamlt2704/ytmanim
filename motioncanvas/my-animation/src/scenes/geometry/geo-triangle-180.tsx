import {Rect, Txt, makeScene2D, Line, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, easeInOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, ORANGE, PURPLE, RED, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeIn, fadeInUp, drawLine, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'180\u00b0 Always'} fill={GREEN} fontFamily={CODE_FONT} fontSize={100} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  // Draw a triangle
  const tri = createRef<Line>();
  const ax = -200, ay = -200;
  const bx = 200, by = -200;
  const cx = 50, cy = -500;
  view.add(
    <Line ref={tri} points={[[ax, ay], [bx, by], [cx, cy]]} closed stroke={ACCENT_COLOR} lineWidth={5} end={0} opacity={1} />
  );
  yield* drawLine(tri(), 0.6);
  yield* waitFor(0.2);

  // Angle arcs as colored labels at each vertex
  const angA = createRef<Txt>();
  const angB = createRef<Txt>();
  const angC = createRef<Txt>();
  view.add(<Txt ref={angA} text={'\u03b1'} fill={RED} fontFamily={CODE_FONT} fontSize={48} fontWeight={800} x={ax + 40} y={ay - 40} opacity={0} />);
  view.add(<Txt ref={angB} text={'\u03b2'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={48} fontWeight={800} x={bx - 40} y={by - 40} opacity={0} />);
  view.add(<Txt ref={angC} text={'\u03b3'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={48} fontWeight={800} x={cx} y={cy + 50} opacity={0} />);

  yield* all(angA().opacity(1, 0.3), angB().opacity(1, 0.3), angC().opacity(1, 0.3));
  yield* waitFor(0.3);

  // Tear off and line up on a straight line
  const lineY = 0;
  yield* all(
    angA().x(-150, 0.5, easeInOutCubic), angA().y(lineY, 0.5, easeInOutCubic),
    angB().x(0, 0.5, easeInOutCubic), angB().y(lineY, 0.5, easeInOutCubic),
    angC().x(150, 0.5, easeInOutCubic), angC().y(lineY, 0.5, easeInOutCubic),
    tri().opacity(0.3, 0.4),
  );

  // Straight line underneath
  const straight = createRef<Line>();
  view.add(<Line ref={straight} points={[[-250, lineY + 40], [250, lineY + 40]]} stroke={GREEN} lineWidth={5} end={0} opacity={1} />);
  yield* drawLine(straight(), 0.4);

  // Sum label
  const sum = createRef<Txt>();
  view.add(<Txt ref={sum} text={'\u03b1 + \u03b2 + \u03b3 = 180\u00b0'} fill={GREEN} fontFamily={CODE_FONT} fontSize={64} fontWeight={800} y={lineY + 110} opacity={0} />);
  yield* fadeInUp(sum(), 20, 0.4);
  yield* pulse(sum() as any, 1.15, 0.3);

  // Works for ANY triangle
  const any = createRef<Txt>();
  view.add(<Txt ref={any} text={'Every triangle. Every time.\nFlat, thin, huge \u2014 always 180\u00b0'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={32} y={300} textAlign={'center'} lineHeight={50} opacity={0} />);
  yield* fadeIn(any(), 0.4);

  yield* waitFor(2);
});
