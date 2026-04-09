import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'⏱️ LIVE RACE'} fill={RED} fontFamily={TITLE_FONT} fontSize={64} fontWeight={900} y={-820} letterSpacing={6} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.4);

  const sub = createRef<Txt>();
  view.add(<Txt ref={sub} text={'10 seconds of earnings'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={-750} opacity={0} />);
  yield* fadeIn(sub(), 0.2);

  // Racers
  const racers = [
    {name: '🧑💻 You', rate: 0.0019, color: ACCENT_COLOR},
    {name: '📦 Jassy', rate: 0.93, color: ORANGE},
    {name: '🪟 Nadella', rate: 1.54, color: PURPLE},
    {name: '🍎 Cook', rate: 3.13, color: GREEN},
    {name: '👑 Tan', rate: 5.14, color: RED},
    {name: '🔍 Pichai', rate: 7.17, color: ACCENT_COLOR},
  ];

  const nameRefs: Txt[] = [];
  const counterRefs: Txt[] = [];
  const barRefs: Rect[] = [];

  for (let i = 0; i < racers.length; i++) {
    const r = racers[i];
    const y = -640 + i * 110;

    const nameRef = createRef<Txt>();
    view.add(<Txt ref={nameRef} text={r.name} fill={r.color} fontFamily={CODE_FONT} fontSize={26} fontWeight={800} x={-200} y={y - 20} opacity={0} />);
    nameRefs.push(nameRef());

    const bar = createRef<Rect>();
    view.add(<Rect ref={bar} x={-200} y={y + 18} width={0} height={26} radius={8} fill={r.color} opacity={0.8} />);
    barRefs.push(bar());

    const ctr = createRef<Txt>();
    view.add(<Txt ref={ctr} text={'$0.00'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={24} fontWeight={800} x={200} y={y} opacity={0} />);
    counterRefs.push(ctr());

    yield* all(nameRef().opacity(1, 0.1), ctr().opacity(1, 0.1));
  }

  yield* waitFor(0.5);

  // Animate 10 seconds of earnings
  const maxRate = racers[racers.length - 1].rate;
  const maxBarW = 350;

  for (let sec = 1; sec <= 20; sec++) {
    for (let i = 0; i < racers.length; i++) {
      const earned = racers[i].rate * sec;
      counterRefs[i].text(earned < 1 ? `$${earned.toFixed(4)}` : `$${earned.toFixed(2)}`);
      const barW = Math.min((racers[i].rate / maxRate) * maxBarW * (sec / 20), maxBarW);
      barRefs[i].width(barW);
    }
    yield* waitFor(0.25);
  }

  yield* waitFor(0.5);

  // Final comparison
  const result = createRef<Rect>();
  view.add(
    <Rect ref={result} width={460} height={130} radius={20} fill={RED + '15'} stroke={RED} lineWidth={4} y={120} opacity={0} scale={0}>
      <Txt text={'In 20 seconds:'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={22} y={-30} />
      <Txt text={'Pichai: $143  vs  You: $0.04'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} fontWeight={900} y={20} />
    </Rect>,
  );
  yield* all(result().opacity(1, 0.3), result().scale(1, 0.4, easeOutBack));
  yield* pulse(result() as any, 1.06, 0.4);

  yield* waitFor(2);
});
