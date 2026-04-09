import {Rect, Txt, makeScene2D, Circle, Line, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, easeInOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, ORANGE, PURPLE, RED, CODE_FONT, TITLE_FONT, TERMINAL_BG} from '../../styles';
import {fadeIn, fadeInUp, fadeOut, showCreate, typeText, popIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'Birthday Paradox'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={85} fontWeight={800} y={-780} opacity={0} />);
  const sub = createRef<Txt>();
  view.add(<Txt ref={sub} text={'How Many People to Share a Birthday?'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={36} y={-700} opacity={0} />);

  yield* fadeInUp(title(), 30, 0.4);
  yield* fadeIn(sub(), 0.3);
  yield* waitFor(0.2);

  // Big reveal number
  const bigNum = createRef<Txt>();
  view.add(<Txt ref={bigNum} text={'23'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={200} fontWeight={800} y={-450} opacity={0} />);
  const bigLabel = createRef<Txt>();
  view.add(<Txt ref={bigLabel} text={'people needed'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={40} y={-330} opacity={0} />);

  yield* all(bigNum().opacity(1, 0.4), bigNum().scale(1, 0.5, easeOutCubic));
  yield* fadeIn(bigLabel(), 0.3);
  yield* waitFor(0.3);

  // Probability bars at key milestones
  const milestones = [
    {n: '10', pct: '12%', w: 96, color: ACCENT_COLOR},
    {n: '23', pct: '50%', w: 400, color: ORANGE},
    {n: '50', pct: '97%', w: 776, color: GREEN},
    {n: '70', pct: '99.9%', w: 800, color: RED},
  ];

  const barY = -120;
  const barH = 60;
  const barLabels = createRefArray<Txt>();
  const bars = createRefArray<Rect>();
  const pctLabels = createRefArray<Txt>();

  for (let i = 0; i < milestones.length; i++) {
    const m = milestones[i];
    const y = barY + i * (barH + 30);

    view.add(<Txt ref={barLabels} text={`${m.n} people`} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={30} fontWeight={700} x={-380} y={y} opacity={0} />);
    view.add(
      <Rect ref={bars} x={-380 + m.w / 2 + 160} y={y} width={0} height={barH} radius={barH / 2} fill={m.color} opacity={0} />
    );
    view.add(<Txt ref={pctLabels} text={m.pct} fill={'#fff'} fontFamily={CODE_FONT} fontSize={28} fontWeight={800} x={-380 + m.w + 200} y={y} opacity={0} />);
  }

  for (let i = 0; i < milestones.length; i++) {
    yield* barLabels[i].opacity(1, 0.2);
    yield* all(
      bars[i].opacity(0.8, 0.2),
      bars[i].width(milestones[i].w, 0.5, easeOutCubic),
    );
    yield* pctLabels[i].opacity(1, 0.2);
    yield* waitFor(0.15);
  }
  yield* waitFor(0.3);

  // Why?
  const why = createRef<Txt>();
  view.add(<Txt ref={why} text={''} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={34} fontWeight={700} y={280} opacity={0} />);
  yield* why().opacity(1, 0.2);
  yield* typeText(why(), 'Why? 23 people = 253 pairs to compare!', 0.04);
  yield* waitFor(0.3);

  const formula = createRef<Txt>();
  view.add(<Txt ref={formula} text={'C(23,2) = 23\u00d722/2 = 253'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={32} y={350} opacity={0} />);
  yield* fadeIn(formula(), 0.3);

  // Tip
  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={"It's not YOUR birthday — it's\nANY two people matching"} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={550} textAlign={'center'} lineHeight={48} opacity={0} />);
  yield* fadeIn(tip(), 0.4);

  yield* waitFor(2);
});
