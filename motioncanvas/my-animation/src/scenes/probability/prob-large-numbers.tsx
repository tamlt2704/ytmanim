import {Rect, Txt, makeScene2D, Line, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, ORANGE, PURPLE, RED, CODE_FONT, TITLE_FONT, TERMINAL_BG} from '../../styles';
import {fadeIn, fadeInUp, typeText, popIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'Law of Large #'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={80} fontWeight={800} y={-780} opacity={0} />);
  const sub = createRef<Txt>();
  view.add(<Txt ref={sub} text={'More Trials = Closer to Expected'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={36} y={-700} opacity={0} />);

  yield* fadeInUp(title(), 30, 0.4);
  yield* fadeIn(sub(), 0.3);

  // Convergence bars: coin flip % heads
  const trials = [
    {n: '10', pct: 70, label: '70%', color: RED},
    {n: '100', pct: 55, label: '55%', color: ORANGE},
    {n: '1K', pct: 51, label: '51%', color: ORANGE},
    {n: '10K', pct: 50.2, label: '50.2%', color: GREEN},
    {n: '1M', pct: 50, label: '50.0%', color: GREEN},
  ];

  const barY = -400;
  const maxW = 600;
  const targetLine = createRef<Line>();

  // 50% target line
  view.add(
    <Line ref={targetLine} points={[[-350 + maxW * 0.5, barY - 30], [-350 + maxW * 0.5, barY + 350]]}
      stroke={GREEN} lineWidth={3} lineDash={[10, 8]} opacity={0} />
  );
  const targetLabel = createRef<Txt>();
  view.add(<Txt ref={targetLabel} text={'50%'} fill={GREEN} fontFamily={CODE_FONT} fontSize={28} fontWeight={800} x={-350 + maxW * 0.5} y={barY - 55} opacity={0} />);

  yield* all(targetLine().opacity(0.5, 0.3), targetLabel().opacity(1, 0.3));

  const barLabels = createRefArray<Txt>();
  const bars = createRefArray<Rect>();
  const pctLabels = createRefArray<Txt>();

  for (let i = 0; i < trials.length; i++) {
    const t = trials[i];
    const y = barY + i * 70;
    const w = (t.pct / 100) * maxW;

    view.add(<Txt ref={barLabels} text={`n=${t.n}`} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={30} fontWeight={700} x={-420} y={y} opacity={0} />);
    view.add(<Rect ref={bars} x={-350 + w / 2} y={y} width={0} height={50} radius={25} fill={t.color} opacity={0} />);
    view.add(<Txt ref={pctLabels} text={t.label} fill={'#fff'} fontFamily={CODE_FONT} fontSize={26} fontWeight={800} x={-350 + w + 50} y={y} opacity={0} />);
  }

  for (let i = 0; i < trials.length; i++) {
    yield* barLabels[i].opacity(1, 0.15);
    yield* all(bars[i].opacity(0.8, 0.15), bars[i].width((trials[i].pct / 100) * maxW, 0.4, easeOutCubic));
    yield* pctLabels[i].opacity(1, 0.15);
    yield* waitFor(0.1);
  }
  yield* waitFor(0.3);

  const insight = createRef<Txt>();
  view.add(<Txt ref={insight} text={'Converges to true probability!'} fill={GREEN} fontFamily={CODE_FONT} fontSize={40} fontWeight={800} y={120} opacity={0} />);
  yield* fadeInUp(insight(), 20, 0.4);
  yield* pulse(insight() as any, 1.15, 0.3);

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'Short run: anything can happen\nLong run: math always wins'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={400} textAlign={'center'} lineHeight={48} opacity={0} />);
  yield* fadeIn(tip(), 0.4);

  yield* waitFor(2);
});
