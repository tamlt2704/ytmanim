import {Rect, Txt, makeScene2D, Line, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, ORANGE, PURPLE, RED, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeIn, fadeInUp, drawLine, showCreate, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'a\u00b2 + b\u00b2 = c\u00b2'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={100} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  // Right triangle
  const a = 180, b = 240;
  const ox = -100, oy = -150;
  const tri = createRef<Line>();
  view.add(
    <Line ref={tri} points={[[ox, oy], [ox + b, oy], [ox, oy - a]]} closed stroke={TEXT_COLOR} lineWidth={4} end={0} opacity={1} />
  );
  yield* drawLine(tri(), 0.5);

  // Labels on sides
  const la = createRef<Txt>();
  const lb = createRef<Txt>();
  const lc = createRef<Txt>();
  view.add(<Txt ref={la} text={'a=3'} fill={RED} fontFamily={CODE_FONT} fontSize={40} fontWeight={800} x={ox - 50} y={oy - a / 2} opacity={0} />);
  view.add(<Txt ref={lb} text={'b=4'} fill={GREEN} fontFamily={CODE_FONT} fontSize={40} fontWeight={800} x={ox + b / 2} y={oy + 40} opacity={0} />);
  view.add(<Txt ref={lc} text={'c=5'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={40} fontWeight={800} x={ox + b / 2 + 40} y={oy - a / 2 - 20} opacity={0} />);

  yield* all(la().opacity(1, 0.2), lb().opacity(1, 0.2), lc().opacity(1, 0.2));
  yield* waitFor(0.2);

  // Squares on each side
  // a² square (left)
  const aSq = createRef<Rect>();
  view.add(
    <Rect ref={aSq} x={ox - a / 2 - 10} y={oy - a / 2} width={a} height={a} radius={8} fill={RED} opacity={0} scale={0}>
      <Txt text={'9'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={52} fontWeight={800} />
    </Rect>
  );

  // b² square (bottom)
  const bSq = createRef<Rect>();
  view.add(
    <Rect ref={bSq} x={ox + b / 2} y={oy + b / 2 + 10} width={b} height={b} radius={8} fill={GREEN} opacity={0} scale={0}>
      <Txt text={'16'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={52} fontWeight={800} />
    </Rect>
  );

  yield* all(aSq().opacity(0.6, 0.3), aSq().scale(1, 0.4, easeOutCubic));
  yield* waitFor(0.2);
  yield* all(bSq().opacity(0.6, 0.3), bSq().scale(1, 0.4, easeOutCubic));
  yield* waitFor(0.3);

  // 9 + 16 = 25
  const sum = createRef<Txt>();
  view.add(<Txt ref={sum} text={'9 + 16 = 25 = 5\u00b2 \u2713'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={60} fontWeight={800} y={350} opacity={0} />);
  yield* fadeInUp(sum(), 20, 0.4);
  yield* pulse(sum() as any, 1.15, 0.3);

  const fact = createRef<Txt>();
  view.add(<Txt ref={fact} text={'Only works for RIGHT triangles!\n4000+ years old, still essential'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={530} textAlign={'center'} lineHeight={48} opacity={0} />);
  yield* fadeIn(fact(), 0.4);

  yield* waitFor(2);
});
