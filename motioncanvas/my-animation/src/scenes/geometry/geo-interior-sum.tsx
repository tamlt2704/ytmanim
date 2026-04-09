import {Rect, Txt, makeScene2D, Line, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, ORANGE, PURPLE, RED, CODE_FONT, TITLE_FONT, TERMINAL_BG} from '../../styles';
import {fadeIn, fadeInUp, showCreate, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'(n-2)\u00d7180\u00b0'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={90} fontWeight={800} y={-800} opacity={0} />);
  const sub = createRef<Txt>();
  view.add(<Txt ref={sub} text={'Interior Angle Sum'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={40} y={-720} opacity={0} />);

  yield* fadeInUp(title(), 30, 0.3);
  yield* fadeIn(sub(), 0.3);

  // Show shapes with triangle decomposition
  const shapes = createRefArray<Rect>();
  const data = [
    {name: '\u25b3', n: 3, tri: 1, sum: '180\u00b0', color: GREEN},
    {name: '\u25a1', n: 4, tri: 2, sum: '360\u00b0', color: ORANGE},
    {name: '\u2b1f', n: 5, tri: 3, sum: '540\u00b0', color: ACCENT_COLOR},
    {name: '\u2b21', n: 6, tri: 4, sum: '720\u00b0', color: PURPLE},
  ];

  for (let i = 0; i < 4; i++) {
    const d = data[i];
    const x = -340 + i * 230;
    view.add(
      <Rect ref={shapes} x={x} y={-400} width={200} height={280} radius={16} fill={TERMINAL_BG} stroke={d.color} lineWidth={3} opacity={0} scale={0}>
        <Txt text={d.name} fill={d.color} fontSize={70} y={-80} />
        <Txt text={`n=${d.n}`} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} y={0} />
        <Txt text={`${d.tri} \u25b3`} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={40} />
        <Txt text={d.sum} fill={d.color} fontFamily={CODE_FONT} fontSize={36} fontWeight={800} y={90} />
      </Rect>
    );
  }

  for (let i = 0; i < 4; i++) {
    yield* all(shapes[i].opacity(1, 0.2), shapes[i].scale(1, 0.3, easeOutCubic));
    yield* waitFor(0.1);
  }
  yield* waitFor(0.3);

  // Pattern
  const pattern = createRef<Txt>();
  view.add(<Txt ref={pattern} text={'Split any polygon into triangles!'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={40} fontWeight={700} y={-130} opacity={0} />);
  yield* fadeIn(pattern(), 0.3);

  // Formula
  const formula = createRef<Txt>();
  view.add(<Txt ref={formula} text={'Sum = (n - 2) \u00d7 180\u00b0'} fill={GREEN} fontFamily={CODE_FONT} fontSize={64} fontWeight={800} y={0} opacity={0} />);
  yield* fadeInUp(formula(), 20, 0.4);
  yield* pulse(formula() as any, 1.15, 0.3);

  // Quick calc
  const calc = createRef<Txt>();
  view.add(<Txt ref={calc} text={'Octagon: (8-2)\u00d7180 = 1080\u00b0'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={38} fontWeight={700} y={120} opacity={0} />);
  yield* fadeIn(calc(), 0.3);

  const fact = createRef<Txt>();
  view.add(<Txt ref={fact} text={'Draw diagonals from one vertex\n\u2192 always (n-2) triangles'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={350} textAlign={'center'} lineHeight={48} opacity={0} />);
  yield* fadeIn(fact(), 0.4);

  yield* waitFor(2);
});
