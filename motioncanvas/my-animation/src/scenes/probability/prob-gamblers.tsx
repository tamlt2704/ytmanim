import {Rect, Txt, makeScene2D, Circle, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, ORANGE, PURPLE, RED, CODE_FONT, TITLE_FONT, TERMINAL_BG} from '../../styles';
import {fadeIn, fadeInUp, fadeOut, typeText, popIn, pulse, shake} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={"Gambler's Fallacy"} fill={RED} fontFamily={CODE_FONT} fontSize={80} fontWeight={800} y={-780} opacity={0} />);
  const sub = createRef<Txt>();
  view.add(<Txt ref={sub} text={'Past Flips Do NOT Affect the Next'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={36} y={-700} opacity={0} />);

  yield* fadeInUp(title(), 30, 0.4);
  yield* fadeIn(sub(), 0.3);
  yield* waitFor(0.2);

  // Coin flip sequence: H H H H H → next?
  const coins = createRefArray<Rect>();
  const coinLabels = ['H', 'H', 'H', 'H', 'H', '?'];
  const coinColors = [GREEN, GREEN, GREEN, GREEN, GREEN, ORANGE];

  for (let i = 0; i < 6; i++) {
    view.add(
      <Rect ref={coins} x={-300 + i * 120} y={-450} width={100} height={100} radius={50} fill={TERMINAL_BG} stroke={coinColors[i]} lineWidth={4} opacity={0} scale={0}>
        <Txt text={coinLabels[i]} fill={coinColors[i]} fontFamily={CODE_FONT} fontSize={48} fontWeight={800} />
      </Rect>
    );
  }

  for (let i = 0; i < 6; i++) {
    yield* all(coins[i].opacity(1, 0.15), coins[i].scale(1, 0.25, easeOutCubic));
    yield* waitFor(0.08);
  }
  yield* waitFor(0.3);

  // Wrong thinking
  const wrong = createRef<Txt>();
  view.add(<Txt ref={wrong} text={''} fill={RED} fontFamily={CODE_FONT} fontSize={38} fontWeight={700} y={-280} opacity={0} />);
  yield* wrong().opacity(1, 0.2);
  yield* typeText(wrong(), '"5 heads in a row... tails is DUE!"', 0.04);
  yield* shake(wrong() as any, 15, 0.4);
  yield* waitFor(0.3);

  // Cross it out
  yield* wrong().fill('#8b949e', 0.3);
  const cross = createRef<Txt>();
  view.add(<Txt ref={cross} text={'\u2718 WRONG'} fill={RED} fontFamily={CODE_FONT} fontSize={44} fontWeight={800} x={350} y={-280} opacity={0} />);
  yield* popIn(cross() as any, 0.3);
  yield* waitFor(0.3);

  // Truth
  const truth = createRef<Txt>();
  view.add(<Txt ref={truth} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={42} fontWeight={800} y={-140} opacity={0} />);
  yield* truth().opacity(1, 0.2);
  yield* typeText(truth(), 'Each flip is ALWAYS 50/50', 0.04);
  yield* waitFor(0.3);

  // Visual: probability stays flat
  const probBoxes = createRefArray<Rect>();
  const probData = [
    {label: 'After 1H', pct: '50%'},
    {label: 'After 5H', pct: '50%'},
    {label: 'After 100H', pct: '50%'},
  ];

  for (let i = 0; i < 3; i++) {
    view.add(
      <Rect ref={probBoxes} x={-280 + i * 280} y={40} width={240} height={130} radius={16} fill={TERMINAL_BG} stroke={GREEN} lineWidth={3} opacity={0} scale={0}>
        <Txt text={probData[i].label} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={24} y={-30} />
        <Txt text={probData[i].pct} fill={GREEN} fontFamily={CODE_FONT} fontSize={48} fontWeight={800} y={25} />
      </Rect>
    );
  }

  for (let i = 0; i < 3; i++) {
    yield* all(probBoxes[i].opacity(1, 0.2), probBoxes[i].scale(1, 0.3, easeOutCubic));
    yield* waitFor(0.1);
  }
  yield* waitFor(0.3);

  // Key insight
  const insight = createRef<Txt>();
  view.add(<Txt ref={insight} text={'The coin has NO memory.'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={40} fontWeight={800} y={230} opacity={0} />);
  yield* fadeInUp(insight(), 20, 0.4);
  yield* pulse(insight() as any, 1.15, 0.3);

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'Independent events stay independent\nno matter what happened before'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={500} textAlign={'center'} lineHeight={46} opacity={0} />);
  yield* fadeIn(tip(), 0.4);

  yield* waitFor(2);
});
