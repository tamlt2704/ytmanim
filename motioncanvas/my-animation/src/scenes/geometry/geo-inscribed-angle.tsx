import {Rect, Txt, makeScene2D, Circle, Line, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, ORANGE, PURPLE, RED, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeIn, fadeInUp, drawLine, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'Half the Angle'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={95} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  // Circle
  const circ = createRef<Circle>();
  const cx = 0, cy = -350, r = 220;
  view.add(<Circle ref={circ} x={cx} y={cy} size={r * 2} stroke={'#30363d'} lineWidth={3} opacity={0} />);
  yield* circ().opacity(1, 0.3);

  // Center dot
  const center = createRef<Circle>();
  view.add(<Circle ref={center} x={cx} y={cy} size={12} fill={TEXT_COLOR} opacity={0} />);
  yield* center().opacity(1, 0.2);

  // Points A, B on circle, P on circle
  const aAngle = -0.3, bAngle = 1.8, pAngle = -1.5;
  const ax = cx + Math.cos(aAngle) * r, ay = cy + Math.sin(aAngle) * r;
  const bx = cx + Math.cos(bAngle) * r, by = cy + Math.sin(bAngle) * r;
  const px = cx + Math.cos(pAngle) * r, py = cy + Math.sin(pAngle) * r;

  // Central angle (center to A and B)
  const centralA = createRef<Line>();
  const centralB = createRef<Line>();
  view.add(<Line ref={centralA} points={[[cx, cy], [ax, ay]]} stroke={RED} lineWidth={4} end={0} opacity={1} />);
  view.add(<Line ref={centralB} points={[[cx, cy], [bx, by]]} stroke={RED} lineWidth={4} end={0} opacity={1} />);

  yield* drawLine(centralA(), 0.3);
  yield* drawLine(centralB(), 0.3);

  const centralLabel = createRef<Txt>();
  view.add(<Txt ref={centralLabel} text={'80\u00b0'} fill={RED} fontFamily={CODE_FONT} fontSize={40} fontWeight={800} x={cx + 50} y={cy + 30} opacity={0} />);
  yield* fadeIn(centralLabel(), 0.3);
  yield* waitFor(0.2);

  // Inscribed angle (P to A and B)
  const inscA = createRef<Line>();
  const inscB = createRef<Line>();
  view.add(<Line ref={inscA} points={[[px, py], [ax, ay]]} stroke={GREEN} lineWidth={4} end={0} opacity={1} />);
  view.add(<Line ref={inscB} points={[[px, py], [bx, by]]} stroke={GREEN} lineWidth={4} end={0} opacity={1} />);

  yield* drawLine(inscA(), 0.3);
  yield* drawLine(inscB(), 0.3);

  const inscLabel = createRef<Txt>();
  view.add(<Txt ref={inscLabel} text={'40\u00b0'} fill={GREEN} fontFamily={CODE_FONT} fontSize={40} fontWeight={800} x={px - 10} y={py + 40} opacity={0} />);
  yield* fadeIn(inscLabel(), 0.3);
  yield* waitFor(0.3);

  // Point labels
  view.add(<Txt text={'A'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={32} fontWeight={800} x={ax + 25} y={ay} opacity={1} />);
  view.add(<Txt text={'B'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={32} fontWeight={800} x={bx - 30} y={by + 10} opacity={1} />);
  view.add(<Txt text={'P'} fill={GREEN} fontFamily={CODE_FONT} fontSize={32} fontWeight={800} x={px + 10} y={py - 30} opacity={1} />);

  // Formula
  const formula = createRef<Txt>();
  view.add(<Txt ref={formula} text={'Inscribed = Central / 2'} fill={GREEN} fontFamily={CODE_FONT} fontSize={56} fontWeight={800} y={-30} opacity={0} />);
  yield* fadeInUp(formula(), 20, 0.4);
  yield* pulse(formula() as any, 1.15, 0.3);

  const fact = createRef<Txt>();
  view.add(<Txt ref={fact} text={'P can be ANYWHERE on the arc\nand the inscribed angle stays the same!'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={200} textAlign={'center'} lineHeight={48} opacity={0} />);
  yield* fadeIn(fact(), 0.4);

  yield* waitFor(2);
});
