import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn} from '../../lib/animations';
import {addDotGrid, showGrid, colorDots} from './dot-grid';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'🌍 Continents'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={64} fontWeight={900} y={-820} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.4);

  const grid = addDotGrid(view, 0, -400, 26, 36);
  yield* showGrid(grid, 0.3);
  yield* waitFor(0.3);

  const segments = [
    {count: 60, color: RED, label: '🌏 Asia', num: '60'},
    {count: 17, color: ORANGE, label: '🌍 Africa', num: '17'},
    {count: 10, color: ACCENT_COLOR, label: '🌍 Europe', num: '10'},
    {count: 8, color: GREEN, label: '🌎 Americas', num: '8'},
    {count: 5, color: PURPLE, label: '🌏 Other', num: '5'},
  ];

  let idx = 0;
  for (const seg of segments) {
    for (let i = 0; i < seg.count && idx < 100; i++, idx++) {
      grid.dots[idx].fill(seg.color);
    }
  }
  // Animate all at once
  yield* all(...grid.dots.map(d => d.opacity(1, 0.01)));
  yield* waitFor(0.3);

  // Legend
  for (let i = 0; i < segments.length; i++) {
    const s = segments[i];
    const y = -50 + i * 65;
    const legend = createRef<Rect>();
    view.add(
      <Rect ref={legend} width={400} height={50} radius={12} fill={s.color + '18'} y={y} opacity={0} scale={0}>
        <Rect width={24} height={24} radius={12} fill={s.color} x={-160} />
        <Txt text={s.label} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} x={-60} />
        <Txt text={s.num} fill={s.color} fontFamily={CODE_FONT} fontSize={28} fontWeight={900} x={140} />
      </Rect>,
    );
    yield* all(legend().opacity(1, 0.15), legend().scale(1, 0.2, easeOutBack));
    yield* waitFor(0.3);
  }

  const fact = createRef<Txt>();
  view.add(<Txt ref={fact} text={'More than half the world\nlives in Asia alone'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={26} y={310} textAlign={'center'} lineHeight={40} opacity={0} />);
  yield* fadeIn(fact(), 0.3);

  yield* waitFor(2.5);
});
