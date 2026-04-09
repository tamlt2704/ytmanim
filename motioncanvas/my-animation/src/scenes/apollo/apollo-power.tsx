import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'POWER'} fill={RED} fontFamily={TITLE_FONT} fontSize={80} fontWeight={900} y={-820} letterSpacing={8} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.4);

  // Apollo
  const apolloCard = createRef<Rect>();
  view.add(
    <Rect ref={apolloCard} width={440} height={250} radius={22} fill={ORANGE + '12'} stroke={ORANGE} lineWidth={3} y={-530} opacity={0} scale={0}>
      <Txt text={'🚀 Apollo 11'} fill={ORANGE} fontFamily={TITLE_FONT} fontSize={40} fontWeight={900} y={-70} />
      <Txt text={'70 Watts'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={64} fontWeight={900} y={10} />
      <Txt text={'Like a bright light bulb 💡'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={22} y={70} />
    </Rect>,
  );
  yield* all(apolloCard().opacity(1, 0.3), apolloCard().scale(1, 0.4, easeOutBack));
  yield* waitFor(1.5);

  // Phone
  const phoneCard = createRef<Rect>();
  view.add(
    <Rect ref={phoneCard} width={440} height={250} radius={22} fill={GREEN + '12'} stroke={GREEN} lineWidth={3} y={-200} opacity={0} scale={0}>
      <Txt text={'📱 Your Phone'} fill={GREEN} fontFamily={TITLE_FONT} fontSize={40} fontWeight={900} y={-70} />
      <Txt text={'~5 Watts'} fill={GREEN} fontFamily={CODE_FONT} fontSize={64} fontWeight={900} y={10} />
      <Txt text={'Runs on a tiny battery all day 🔋'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={22} y={70} />
    </Rect>,
  );
  yield* all(phoneCard().opacity(1, 0.3), phoneCard().scale(1, 0.4, easeOutBack));
  yield* waitFor(0.5);

  // Multiplier
  const mult = createRef<Rect>();
  view.add(
    <Rect ref={mult} width={440} height={100} radius={22} fill={RED + '18'} stroke={RED} lineWidth={4} y={0} opacity={0} scale={0}>
      <Txt text={'14x LESS POWER'} fill={RED} fontFamily={TITLE_FONT} fontSize={48} fontWeight={900} />
    </Rect>,
  );
  yield* all(mult().opacity(1, 0.3), mult().scale(1, 0.4, easeOutBack));
  yield* pulse(mult() as any, 1.08, 0.4);

  const context = createRef<Txt>();
  view.add(<Txt ref={context} text={'Uses 14x less energy\nwhile being 100,000x\nmore powerful'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} fontWeight={700} y={170} textAlign={'center'} lineHeight={44} opacity={0} />);
  yield* fadeInUp(context(), 20, 0.4);

  const mind = createRef<Txt>();
  view.add(<Txt ref={mind} text={"That's efficiency 📈"} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={36} fontWeight={900} y={320} opacity={0} />);
  yield* fadeIn(mind(), 0.3);

  yield* waitFor(2.5);
});
