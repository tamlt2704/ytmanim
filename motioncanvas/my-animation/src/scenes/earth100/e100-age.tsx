import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn} from '../../lib/animations';
import {addDotGrid, showGrid} from './dot-grid';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'👶 Age'} fill={ORANGE} fontFamily={TITLE_FONT} fontSize={72} fontWeight={900} y={-820} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.4);

  const grid = addDotGrid(view, 0, -400, 26, 36);

  const segments = [
    {count: 26, color: GREEN, label: '👶 Under 15', num: '26'},
    {count: 58, color: ACCENT_COLOR, label: '🧑 15 — 64', num: '58'},
    {count: 16, color: PURPLE, label: '👴 Over 65', num: '16'},
  ];

  let idx = 0;
  for (const seg of segments) {
    for (let i = 0; i < seg.count && idx < 100; i++, idx++) {
      grid.dots[idx].fill(seg.color);
    }
  }
  yield* showGrid(grid, 0.3);
  yield* waitFor(0.3);

  for (let i = 0; i < segments.length; i++) {
    const s = segments[i];
    const y = -50 + i * 70;
    const legend = createRef<Rect>();
    view.add(
      <Rect ref={legend} width={400} height={55} radius={12} fill={s.color + '18'} y={y} opacity={0} scale={0}>
        <Rect width={24} height={24} radius={12} fill={s.color} x={-160} />
        <Txt text={s.label} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} x={-40} />
        <Txt text={s.num} fill={s.color} fontFamily={CODE_FONT} fontSize={30} fontWeight={900} x={150} />
      </Rect>,
    );
    yield* all(legend().opacity(1, 0.15), legend().scale(1, 0.2, easeOutBack));
    yield* waitFor(0.5);
  }

  const fact = createRef<Txt>();
  view.add(<Txt ref={fact} text={'Only 58 people would be\nof working age'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={26} y={280} textAlign={'center'} lineHeight={40} opacity={0} />);
  yield* fadeIn(fact(), 0.3);

  yield* waitFor(2.5);
});
