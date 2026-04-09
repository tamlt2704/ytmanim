import {Rect, Txt, makeScene2D, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, ORANGE, PURPLE, RED, CODE_FONT, TITLE_FONT, TERMINAL_BG} from '../../styles';
import {fadeIn, fadeInUp, fadeOut, typeText, popIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'C vs P'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={100} fontWeight={800} y={-780} opacity={0} />);
  const sub = createRef<Txt>();
  view.add(<Txt ref={sub} text={'Combinations vs Permutations'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={38} y={-700} opacity={0} />);

  yield* fadeInUp(title(), 30, 0.4);
  yield* fadeIn(sub(), 0.3);
  yield* waitFor(0.2);

  // Two side-by-side cards
  const permCard = createRef<Rect>();
  const combCard = createRef<Rect>();

  view.add(
    <Rect ref={permCard} x={-230} y={-380} width={380} height={450} radius={20} fill={TERMINAL_BG} stroke={ORANGE} lineWidth={4} opacity={0} scale={0}>
      <Txt text={'Permutation'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={34} fontWeight={800} y={-170} />
      <Txt text={'Order MATTERS'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} fontWeight={700} y={-120} />
      <Txt text={'n!'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={60} fontWeight={800} y={-40} />
      <Txt text={'nPr = n!/(n-r)!'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={26} y={30} />
      <Txt text={'Lock code: 1-2-3'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} y={100} />
      <Txt text={'\u2260 3-2-1'} fill={RED} fontFamily={CODE_FONT} fontSize={28} fontWeight={700} y={140} />
    </Rect>
  );

  view.add(
    <Rect ref={combCard} x={230} y={-380} width={380} height={450} radius={20} fill={TERMINAL_BG} stroke={GREEN} lineWidth={4} opacity={0} scale={0}>
      <Txt text={'Combination'} fill={GREEN} fontFamily={CODE_FONT} fontSize={34} fontWeight={800} y={-170} />
      <Txt text={'Order IGNORED'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} fontWeight={700} y={-120} />
      <Txt text={'n!/r!(n-r)!'} fill={GREEN} fontFamily={CODE_FONT} fontSize={44} fontWeight={800} y={-40} />
      <Txt text={'nCr = n!/(r!(n-r)!)'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={24} y={30} />
      <Txt text={'Team pick: {A,B,C}'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} y={100} />
      <Txt text={'= {C,B,A} same!'} fill={GREEN} fontFamily={CODE_FONT} fontSize={28} fontWeight={700} y={140} />
    </Rect>
  );

  yield* all(permCard().opacity(1, 0.3), permCard().scale(1, 0.4, easeOutCubic));
  yield* waitFor(0.2);
  yield* all(combCard().opacity(1, 0.3), combCard().scale(1, 0.4, easeOutCubic));
  yield* waitFor(0.4);

  // Example
  const ex = createRef<Txt>();
  view.add(<Txt ref={ex} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={36} fontWeight={700} y={-30} opacity={0} />);
  yield* ex().opacity(1, 0.2);
  yield* typeText(ex(), 'Pick 3 from 5 people:', 0.04);
  yield* waitFor(0.2);

  const permResult = createRef<Txt>();
  const combResult = createRef<Txt>();
  view.add(<Txt ref={permResult} text={'P(5,3) = 60 ways'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={40} fontWeight={800} x={-230} y={60} opacity={0} />);
  view.add(<Txt ref={combResult} text={'C(5,3) = 10 ways'} fill={GREEN} fontFamily={CODE_FONT} fontSize={40} fontWeight={800} x={230} y={60} opacity={0} />);

  yield* popIn(permResult() as any, 0.3);
  yield* popIn(combResult() as any, 0.3);
  yield* waitFor(0.3);

  // Key insight
  const key = createRef<Txt>();
  view.add(<Txt ref={key} text={'C = P / r! (divide out the orderings)'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={34} fontWeight={800} y={180} opacity={0} />);
  yield* fadeInUp(key(), 20, 0.4);

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'Does order matter? Yes \u2192 Permutation\nNo \u2192 Combination'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={450} textAlign={'center'} lineHeight={46} opacity={0} />);
  yield* fadeIn(tip(), 0.4);

  yield* waitFor(2);
});
