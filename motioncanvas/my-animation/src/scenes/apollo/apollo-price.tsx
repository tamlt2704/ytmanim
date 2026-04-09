import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'PRICE 💰'} fill={GREEN} fontFamily={TITLE_FONT} fontSize={80} fontWeight={900} y={-820} letterSpacing={8} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.4);

  // Apollo
  const apolloCard = createRef<Rect>();
  view.add(
    <Rect ref={apolloCard} width={440} height={280} radius={22} fill={ORANGE + '12'} stroke={ORANGE} lineWidth={3} y={-510} opacity={0} scale={0}>
      <Txt text={'🚀 Apollo Computer'} fill={ORANGE} fontFamily={TITLE_FONT} fontSize={36} fontWeight={900} y={-80} />
      <Txt text={'$150,000'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={64} fontWeight={900} y={0} />
      <Txt text={'in 1969 dollars'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={22} y={50} />
      <Txt text={'~$1.2 million today 😱'} fill={RED} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} y={90} />
    </Rect>,
  );
  yield* all(apolloCard().opacity(1, 0.3), apolloCard().scale(1, 0.4, easeOutBack));
  yield* waitFor(2);

  // Phone
  const phoneCard = createRef<Rect>();
  view.add(
    <Rect ref={phoneCard} width={440} height={250} radius={22} fill={GREEN + '12'} stroke={GREEN} lineWidth={3} y={-170} opacity={0} scale={0}>
      <Txt text={'📱 Your Phone'} fill={GREEN} fontFamily={TITLE_FONT} fontSize={36} fontWeight={900} y={-70} />
      <Txt text={'~$1,000'} fill={GREEN} fontFamily={CODE_FONT} fontSize={64} fontWeight={900} y={10} />
      <Txt text={'Millions of times more powerful'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={22} y={70} />
    </Rect>,
  );
  yield* all(phoneCard().opacity(1, 0.3), phoneCard().scale(1, 0.4, easeOutBack));
  yield* waitFor(0.5);

  // Multiplier
  const mult = createRef<Rect>();
  view.add(
    <Rect ref={mult} width={440} height={100} radius={22} fill={RED + '18'} stroke={RED} lineWidth={4} y={20} opacity={0} scale={0}>
      <Txt text={'1,200x CHEAPER'} fill={RED} fontFamily={TITLE_FONT} fontSize={48} fontWeight={900} />
    </Rect>,
  );
  yield* all(mult().opacity(1, 0.3), mult().scale(1, 0.4, easeOutBack));
  yield* pulse(mult() as any, 1.08, 0.4);

  const context = createRef<Txt>();
  view.add(<Txt ref={context} text={"You carry more computing\npower in your pocket than\nNASA's entire budget could\nbuy in 1969"} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} y={200} textAlign={'center'} lineHeight={40} opacity={0} />);
  yield* fadeInUp(context(), 20, 0.4);

  yield* waitFor(2.5);
});
