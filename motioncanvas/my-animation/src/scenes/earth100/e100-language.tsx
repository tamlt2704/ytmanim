import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CYAN, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn} from '../../lib/animations';
import {addDotGrid, showGrid} from './dot-grid';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'🗣️ Language'} fill={GREEN} fontFamily={TITLE_FONT} fontSize={72} fontWeight={900} y={-820} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.4);

  const grid = addDotGrid(view, 0, -400, 26, 36);

  const segments = [
    {count: 12, color: RED, label: '🇨🇳 Mandarin', num: '12'},
    {count: 6, color: ORANGE, label: '🇪🇸 Spanish', num: '6'},
    {count: 5, color: ACCENT_COLOR, label: '🇬🇧 English', num: '5'},
    {count: 4, color: GREEN, label: '🇮🇳 Hindi', num: '4'},
    {count: 3, color: PURPLE, label: '🇸🇦 Arabic', num: '3'},
    {count: 3, color: CYAN, label: '🇧🇩 Bengali', num: '3'},
    {count: 67, color: '#30363d', label: '🌐 Other', num: '67'},
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
    const y = -60 + i * 55;
    const legend = createRef<Rect>();
    view.add(
      <Rect ref={legend} width={420} height={44} radius={10} fill={s.color + '18'} y={y} opacity={0} scale={0}>
        <Rect width={20} height={20} radius={10} fill={s.color} x={-170} />
        <Txt text={s.label} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={20} fontWeight={700} x={-50} />
        <Txt text={s.num} fill={s.color} fontFamily={CODE_FONT} fontSize={24} fontWeight={900} x={160} />
      </Rect>,
    );
    yield* all(legend().opacity(1, 0.1), legend().scale(1, 0.15, easeOutBack));
    yield* waitFor(0.2);
  }

  const fact = createRef<Txt>();
  view.add(<Txt ref={fact} text={'Only 5 would speak English\nas their first language!'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={26} y={350} textAlign={'center'} lineHeight={40} opacity={0} />);
  yield* fadeIn(fact(), 0.3);

  yield* waitFor(2.5);
});
