import {Rect, Txt, makeScene2D, Line, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, easeInOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeIn, fadeInUp, drawLine, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'A = \u00bdbh'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={110} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  // Triangle
  const bx1 = -250, bx2 = 250, by = -200;
  const px = 80, py = -550;

  const tri = createRef<Line>();
  view.add(<Line ref={tri} points={[[bx1, by], [bx2, by], [px, py]]} closed stroke={ACCENT_COLOR} lineWidth={5} fill={ACCENT_COLOR} opacity={0} />);
  yield* tri().opacity(0.3, 0.4);
  yield* waitFor(0.2);

  // Base label
  const baseLabel = createRef<Txt>();
  view.add(<Txt ref={baseLabel} text={'b'} fill={GREEN} fontFamily={CODE_FONT} fontSize={48} fontWeight={800} x={0} y={by + 40} opacity={0} />);
  const baseLine = createRef<Line>();
  view.add(<Line ref={baseLine} points={[[bx1, by + 10], [bx2, by + 10]]} stroke={GREEN} lineWidth={5} end={0} opacity={1} />);

  yield* drawLine(baseLine(), 0.4);
  yield* fadeIn(baseLabel(), 0.2);

  // Height drops from apex to base
  const hLine = createRef<Line>();
  view.add(<Line ref={hLine} points={[[px, py], [px, by]]} stroke={ORANGE} lineWidth={5} lineDash={[12, 8]} end={0} opacity={1} />);
  const hLabel = createRef<Txt>();
  view.add(<Txt ref={hLabel} text={'h'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={48} fontWeight={800} x={px + 35} y={(py + by) / 2} opacity={0} />);

  yield* drawLine(hLine(), 0.5);
  yield* fadeIn(hLabel(), 0.2);
  yield* waitFor(0.3);

  // Why half? Show the enclosing rectangle
  const rect = createRef<Rect>();
  view.add(
    <Rect ref={rect} x={(bx1 + bx2) / 2} y={(py + by) / 2} width={bx2 - bx1} height={by - py}
      stroke={PURPLE} lineWidth={3} lineDash={[10, 8]} opacity={0} />
  );
  yield* rect().opacity(0.5, 0.4);

  const why = createRef<Txt>();
  view.add(<Txt ref={why} text={'Triangle = half the rectangle!'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={36} fontWeight={700} y={-80} opacity={0} />);
  yield* fadeIn(why(), 0.3);
  yield* waitFor(0.3);

  // Formula
  const formula = createRef<Txt>();
  view.add(<Txt ref={formula} text={'Area = \u00bd \u00d7 base \u00d7 height'} fill={GREEN} fontFamily={CODE_FONT} fontSize={56} fontWeight={800} y={30} opacity={0} />);
  yield* fadeInUp(formula(), 20, 0.4);
  yield* pulse(formula() as any, 1.15, 0.3);

  // Example
  const example = createRef<Txt>();
  view.add(<Txt ref={example} text={'b=10, h=6 \u2192 A = \u00bd\u00d710\u00d76 = 30'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={38} fontWeight={700} y={140} opacity={0} />);
  yield* fadeIn(example(), 0.3);

  const fact = createRef<Txt>();
  view.add(<Txt ref={fact} text={'Works for ALL triangles \u2014 even obtuse!\nHeight can fall outside the triangle'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={370} textAlign={'center'} lineHeight={48} opacity={0} />);
  yield* fadeIn(fact(), 0.4);

  yield* waitFor(2);
});
