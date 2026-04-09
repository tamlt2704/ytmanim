import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';
import {addDotGrid, showGrid} from './dot-grid';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'💰 Wealth'} fill={RED} fontFamily={TITLE_FONT} fontSize={72} fontWeight={900} y={-820} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.4);

  const grid = addDotGrid(view, 0, -400, 26, 36);

  // 1 richest, 9 wealthy, 40 middle, 50 poorest
  let idx = 0;
  for (let i = 0; i < 1; i++, idx++) grid.dots[idx].fill('#ffd700'); // gold
  for (let i = 0; i < 9; i++, idx++) grid.dots[idx].fill(GREEN);
  for (let i = 0; i < 40; i++, idx++) grid.dots[idx].fill(ACCENT_COLOR);
  for (let i = 0; i < 50; i++, idx++) grid.dots[idx].fill(RED);
  yield* showGrid(grid, 0.3);
  yield* waitFor(0.3);

  const segments = [
    {color: '#ffd700', label: '👑 Richest 1', num: 'owns 43%'},
    {color: GREEN, label: '💎 Top 10', num: 'own 76%'},
    {color: ACCENT_COLOR, label: '🏠 Middle 40', num: 'own 22%'},
    {color: RED, label: '😔 Bottom 50', num: 'own 2%'},
  ];

  for (let i = 0; i < segments.length; i++) {
    const s = segments[i];
    const y = -50 + i * 65;
    const legend = createRef<Rect>();
    view.add(
      <Rect ref={legend} width={420} height={50} radius={12} fill={s.color + '18'} y={y} opacity={0} scale={0}>
        <Rect width={24} height={24} radius={12} fill={s.color} x={-170} />
        <Txt text={s.label} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} fontWeight={700} x={-60} />
        <Txt text={s.num} fill={s.color} fontFamily={CODE_FONT} fontSize={22} fontWeight={900} x={130} />
      </Rect>,
    );
    yield* all(legend().opacity(1, 0.15), legend().scale(1, 0.2, easeOutBack));
    yield* waitFor(0.4);
  }

  yield* waitFor(0.5);

  const blow = createRef<Rect>();
  view.add(
    <Rect ref={blow} width={460} height={100} radius={20} fill={RED + '18'} stroke={RED} lineWidth={4} y={260} opacity={0} scale={0}>
      <Txt text={'1 person owns more than\nthe bottom 50 combined'} fill={RED} fontFamily={CODE_FONT} fontSize={26} fontWeight={900} textAlign={'center'} lineHeight={36} />
    </Rect>,
  );
  yield* all(blow().opacity(1, 0.3), blow().scale(1, 0.4, easeOutBack));
  yield* pulse(blow() as any, 1.06, 0.4);

  yield* waitFor(2.5);
});
