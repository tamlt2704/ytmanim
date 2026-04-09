import {Rect, Txt, makeScene2D, Line, Circle, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, ORANGE, PURPLE, CODE_FONT, TITLE_FONT, TERMINAL_BG} from '../../styles';
import {fadeIn, fadeInUp, showCreate, popIn, pulse} from '../../lib/animations';
import {addCube, showCube} from '../../lib/fake3d';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'V - E + F = 2'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={90} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  const sub = createRef<Txt>();
  view.add(<Txt ref={sub} text={"Euler's Formula for Polyhedra"} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={36} y={-720} opacity={0} />);
  yield* fadeIn(sub(), 0.3);

  // Show a cube
  const cube = addCube(view, {x: 0, y: -400, size: 220, topColor: ACCENT_COLOR, leftColor: '#1f6feb', rightColor: '#388bfd'});
  yield* showCube(cube, 0.5);
  yield* waitFor(0.3);

  // Count vertices, edges, faces with animated numbers
  const vBox = createRef<Rect>();
  const eBox = createRef<Rect>();
  const fBox = createRef<Rect>();

  view.add(
    <Rect ref={vBox} x={-280} y={-120} width={220} height={160} radius={20} fill={TERMINAL_BG} stroke={GREEN} lineWidth={4} opacity={0} scale={0}>
      <Txt text={'Vertices'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={26} y={-40} />
      <Txt text={'8'} fill={GREEN} fontFamily={CODE_FONT} fontSize={72} fontWeight={800} y={25} />
    </Rect>
  );
  view.add(
    <Rect ref={eBox} x={0} y={-120} width={220} height={160} radius={20} fill={TERMINAL_BG} stroke={ORANGE} lineWidth={4} opacity={0} scale={0}>
      <Txt text={'Edges'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={26} y={-40} />
      <Txt text={'12'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={72} fontWeight={800} y={25} />
    </Rect>
  );
  view.add(
    <Rect ref={fBox} x={280} y={-120} width={220} height={160} radius={20} fill={TERMINAL_BG} stroke={PURPLE} lineWidth={4} opacity={0} scale={0}>
      <Txt text={'Faces'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={26} y={-40} />
      <Txt text={'6'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={72} fontWeight={800} y={25} />
    </Rect>
  );

  yield* all(vBox().opacity(1, 0.3), vBox().scale(1, 0.4, easeOutCubic));
  yield* waitFor(0.15);
  yield* all(eBox().opacity(1, 0.3), eBox().scale(1, 0.4, easeOutCubic));
  yield* waitFor(0.15);
  yield* all(fBox().opacity(1, 0.3), fBox().scale(1, 0.4, easeOutCubic));
  yield* waitFor(0.3);

  // Calculation
  const calc = createRef<Txt>();
  view.add(<Txt ref={calc} text={'8 - 12 + 6 = 2 \u2713'} fill={GREEN} fontFamily={CODE_FONT} fontSize={64} fontWeight={800} y={60} opacity={0} />);
  yield* fadeInUp(calc(), 20, 0.4);
  yield* pulse(calc() as any, 1.15, 0.3);

  // Works for ALL convex polyhedra
  const fact = createRef<Txt>();
  view.add(<Txt ref={fact} text={'Works for ANY convex polyhedron!\nTetrahedron, dodecahedron, soccer ball...'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={250} textAlign={'center'} lineHeight={48} opacity={0} />);
  yield* fadeIn(fact(), 0.4);

  yield* waitFor(2);
});
