import {Rect, Txt, makeScene2D, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, ORANGE, PURPLE, RED, CODE_FONT, TITLE_FONT, TERMINAL_BG} from '../../styles';
import {fadeIn, fadeInUp, typeText, popIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'Independent?'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={90} fontWeight={800} y={-780} opacity={0} />);
  const sub = createRef<Txt>();
  view.add(<Txt ref={sub} text={'Does One Event Affect Another?'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={38} y={-700} opacity={0} />);

  yield* fadeInUp(title(), 30, 0.4);
  yield* fadeIn(sub(), 0.3);
  yield* waitFor(0.2);

  // Two cards side by side
  const indepCard = createRef<Rect>();
  const depCard = createRef<Rect>();

  view.add(
    <Rect ref={indepCard} x={-230} y={-350} width={380} height={480} radius={20} fill={TERMINAL_BG} stroke={GREEN} lineWidth={4} opacity={0} scale={0}>
      <Txt text={'Independent'} fill={GREEN} fontFamily={CODE_FONT} fontSize={36} fontWeight={800} y={-180} />
      <Txt text={'P(A\u2229B) ='} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={30} y={-110} />
      <Txt text={'P(A) \u00d7 P(B)'} fill={GREEN} fontFamily={CODE_FONT} fontSize={38} fontWeight={800} y={-60} />
      <Txt text={'Coin flip + dice roll'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={26} y={10} />
      <Txt text={'P(H and 6) ='} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} y={70} />
      <Txt text={'1/2 \u00d7 1/6 = 1/12'} fill={GREEN} fontFamily={CODE_FONT} fontSize={32} fontWeight={800} y={120} />
      <Txt text={'One does NOT'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={24} y={180} />
      <Txt text={'affect the other'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={24} y={210} />
    </Rect>
  );

  view.add(
    <Rect ref={depCard} x={230} y={-350} width={380} height={480} radius={20} fill={TERMINAL_BG} stroke={RED} lineWidth={4} opacity={0} scale={0}>
      <Txt text={'Dependent'} fill={RED} fontFamily={CODE_FONT} fontSize={36} fontWeight={800} y={-180} />
      <Txt text={'P(A\u2229B) ='} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={30} y={-110} />
      <Txt text={'P(A) \u00d7 P(B|A)'} fill={RED} fontFamily={CODE_FONT} fontSize={38} fontWeight={800} y={-60} />
      <Txt text={'Cards without replace'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={26} y={10} />
      <Txt text={'P(Ace then Ace) ='} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} y={70} />
      <Txt text={'4/52 \u00d7 3/51 = 1/221'} fill={RED} fontFamily={CODE_FONT} fontSize={32} fontWeight={800} y={120} />
      <Txt text={'First draw CHANGES'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={24} y={180} />
      <Txt text={'the second odds'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={24} y={210} />
    </Rect>
  );

  yield* all(indepCard().opacity(1, 0.3), indepCard().scale(1, 0.4, easeOutCubic));
  yield* waitFor(0.2);
  yield* all(depCard().opacity(1, 0.3), depCard().scale(1, 0.4, easeOutCubic));
  yield* waitFor(0.4);

  // Key test
  const key = createRef<Txt>();
  view.add(<Txt ref={key} text={''} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={36} fontWeight={800} y={50} opacity={0} />);
  yield* key().opacity(1, 0.2);
  yield* typeText(key(), 'Test: does P(B|A) = P(B)?', 0.04);
  yield* waitFor(0.3);

  const answer = createRef<Txt>();
  view.add(<Txt ref={answer} text={'Yes \u2192 Independent | No \u2192 Dependent'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={32} fontWeight={700} y={130} opacity={0} />);
  yield* fadeIn(answer(), 0.3);

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'Most real-world events are dependent.\nIndependence is the special case!'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={420} textAlign={'center'} lineHeight={46} opacity={0} />);
  yield* fadeIn(tip(), 0.4);

  yield* waitFor(2);
});
