import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'⚔️ Comparison'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={72} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  const rows = [
    {name: 'Bubble', time: 'O(n²)', color: ORANGE, bar: 400},
    {name: 'Selection', time: 'O(n²)', color: PURPLE, bar: 380},
    {name: 'Insertion', time: 'O(n²)', color: GREEN, bar: 360},
    {name: 'Merge', time: 'O(n log n)', color: ACCENT_COLOR, bar: 200},
    {name: 'Quick', time: 'O(n log n)', color: RED, bar: 180},
  ];

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const y = -550 + i * 120;

    // Label
    const label = createRef<Txt>();
    view.add(<Txt ref={label} text={r.name} fill={r.color} fontFamily={CODE_FONT} fontSize={30} fontWeight={800} x={-350} y={y - 20} opacity={0} />);

    // Bar
    const bar = createRef<Rect>();
    view.add(<Rect ref={bar} x={-350 + r.bar / 2 + 130} y={y + 20} width={0} height={30} radius={8} fill={r.color} opacity={0.8} />);

    // Complexity label
    const comp = createRef<Txt>();
    view.add(<Txt ref={comp} text={r.time} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} x={-350 + r.bar + 160} y={y + 20} opacity={0} />);

    yield* all(label().opacity(1, 0.15), bar().width(r.bar, 0.4), comp().opacity(1, 0.2));
    yield* waitFor(0.1);
  }

  yield* waitFor(0.3);

  // Winner highlight
  const winner = createRef<Rect>();
  view.add(
    <Rect ref={winner} width={440} height={80} radius={18} fill={GREEN + '18'} stroke={GREEN} lineWidth={3} y={120} opacity={0} scale={0}>
      <Txt text={'🏆 Quick Sort wins in practice!'} fill={GREEN} fontFamily={CODE_FONT} fontSize={28} fontWeight={800} />
    </Rect>,
  );
  yield* all(winner().opacity(1, 0.2), winner().scale(1, 0.3, easeOutBack));

  const note = createRef<Txt>();
  view.add(<Txt ref={note} text={'Merge Sort is better when\nstability matters'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={38} fontWeight={800} y={270} textAlign={'center'} lineHeight={56} opacity={0} />);
  yield* fadeInUp(note(), 20, 0.3);

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'Most languages use a hybrid\nof Quick + Insertion (Timsort) 🧬'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={24} y={410} textAlign={'center'} lineHeight={40} opacity={0} />);
  yield* fadeIn(tip(), 0.3);

  yield* waitFor(1.5);
});
