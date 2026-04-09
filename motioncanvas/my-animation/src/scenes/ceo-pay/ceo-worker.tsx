import {Rect, Txt, Line, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'Now... YOU'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={72} fontWeight={900} y={-820} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.4);

  const emoji = createRef<Txt>();
  view.add(<Txt ref={emoji} text={'🧑‍💻'} fontSize={120} y={-680} opacity={0} />);
  yield* fadeIn(emoji(), 0.3);

  const label = createRef<Txt>();
  view.add(<Txt ref={label} text={'Average US Worker'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={32} y={-590} opacity={0} />);
  yield* fadeIn(label(), 0.2);

  const annual = createRef<Rect>();
  view.add(
    <Rect ref={annual} width={440} height={80} radius={18} fill={'#21262d'} y={-490} opacity={0}>
      <Txt text={'Annual: $59,000'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={30} fontWeight={800} />
    </Rect>,
  );
  yield* annual().opacity(1, 0.3);

  const perSecLabel = createRef<Txt>();
  view.add(<Txt ref={perSecLabel} text={'Per second:'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={-390} opacity={0} />);
  yield* fadeIn(perSecLabel(), 0.2);

  const counter = createRef<Txt>();
  view.add(<Txt ref={counter} text={'$0.0019'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={90} fontWeight={900} y={-290} opacity={0} />);
  yield* counter().opacity(1, 0.3);
  yield* waitFor(1);

  // Comparison bars
  const barLabel = createRef<Txt>();
  view.add(<Txt ref={barLabel} text={'Per second comparison:'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={32} fontWeight={900} y={-170} opacity={0} />);
  yield* fadeIn(barLabel(), 0.2);

  const rows = [
    {name: '🧑‍💻 You', val: '$0.002', bar: 1, color: ACCENT_COLOR},
    {name: '📦 Jassy', val: '$0.93', bar: 40, color: ORANGE},
    {name: '🪟 Nadella', val: '$1.54', bar: 70, color: PURPLE},
    {name: '🍎 Cook', val: '$3.13', bar: 140, color: GREEN},
    {name: '👑 Tan', val: '$5.14', bar: 230, color: RED},
    {name: '🔍 Pichai', val: '$7.17', bar: 320, color: ACCENT_COLOR},
  ];

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const y = -100 + i * 70;

    const nameRef = createRef<Txt>();
    view.add(<Txt ref={nameRef} text={r.name} fill={r.color} fontFamily={CODE_FONT} fontSize={20} fontWeight={800} x={-220} y={y} opacity={0} />);

    const bar = createRef<Rect>();
    view.add(<Rect ref={bar} x={-100 + r.bar / 2} y={y} width={0} height={30} radius={8} fill={r.color} opacity={0.8} />);

    const valRef = createRef<Txt>();
    view.add(<Txt ref={valRef} text={r.val} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={18} fontWeight={700} x={-100 + r.bar + 40} y={y} opacity={0} />);

    yield* all(nameRef().opacity(1, 0.15), bar().width(r.bar, 0.4, easeOutCubic), valRef().opacity(1, 0.2));
    yield* waitFor(0.15);
  }

  yield* waitFor(0.5);

  const gap = createRef<Rect>();
  view.add(
    <Rect ref={gap} width={460} height={80} radius={18} fill={RED + '18'} stroke={RED} lineWidth={4} y={360} opacity={0} scale={0}>
      <Txt text={'Pichai earns 3,773x more'} fill={RED} fontFamily={TITLE_FONT} fontSize={36} fontWeight={900} />
    </Rect>,
  );
  yield* all(gap().opacity(1, 0.3), gap().scale(1, 0.4, easeOutBack));
  yield* pulse(gap() as any, 1.06, 0.4);

  yield* waitFor(2);
});
