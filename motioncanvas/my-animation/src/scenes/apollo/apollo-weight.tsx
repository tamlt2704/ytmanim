import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'WEIGHT'} fill={ORANGE} fontFamily={TITLE_FONT} fontSize={80} fontWeight={900} y={-820} letterSpacing={8} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.4);

  // Apollo — big heavy box
  const apolloLabel = createRef<Txt>();
  view.add(<Txt ref={apolloLabel} text={'🚀 Apollo Guidance Computer'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={32} fontWeight={800} y={-680} opacity={0} />);
  yield* fadeIn(apolloLabel(), 0.3);

  const apolloBox = createRef<Rect>();
  view.add(
    <Rect ref={apolloBox} width={350} height={300} radius={20} fill={ORANGE + '15'} stroke={ORANGE} lineWidth={4} y={-440} opacity={0} scale={0}>
      <Txt text={'🖥️'} fontSize={120} y={-30} />
      <Txt text={'32 kg'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={48} fontWeight={900} y={80} />
    </Rect>,
  );
  yield* all(apolloBox().opacity(1, 0.3), apolloBox().scale(1, 0.4, easeOutBack));

  const apolloNote = createRef<Txt>();
  view.add(<Txt ref={apolloNote} text={'Size of a large suitcase\nFilled an entire cabinet'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={22} y={-250} textAlign={'center'} lineHeight={34} opacity={0} />);
  yield* fadeIn(apolloNote(), 0.3);
  yield* waitFor(1.5);

  // Phone — tiny
  const phoneLabel = createRef<Txt>();
  view.add(<Txt ref={phoneLabel} text={'📱 Your Phone'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={32} fontWeight={800} y={-160} opacity={0} />);
  yield* fadeIn(phoneLabel(), 0.3);

  const phoneBox = createRef<Rect>();
  view.add(
    <Rect ref={phoneBox} width={140} height={200} radius={20} fill={ACCENT_COLOR + '15'} stroke={ACCENT_COLOR} lineWidth={4} y={-10} opacity={0} scale={0}>
      <Txt text={'📱'} fontSize={70} y={-20} />
      <Txt text={'200g'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={32} fontWeight={900} y={55} />
    </Rect>,
  );
  yield* all(phoneBox().opacity(1, 0.3), phoneBox().scale(1, 0.4, easeOutBack));
  yield* waitFor(0.5);

  // Multiplier
  const mult = createRef<Rect>();
  view.add(
    <Rect ref={mult} width={420} height={90} radius={22} fill={GREEN + '18'} stroke={GREEN} lineWidth={4} y={150} opacity={0} scale={0}>
      <Txt text={'160x LIGHTER'} fill={GREEN} fontFamily={TITLE_FONT} fontSize={50} fontWeight={900} />
    </Rect>,
  );
  yield* all(mult().opacity(1, 0.3), mult().scale(1, 0.4, easeOutBack));
  yield* pulse(mult() as any, 1.08, 0.4);

  const context = createRef<Txt>();
  view.add(<Txt ref={context} text={'Fits in your pocket\nwith millions of times\nmore computing power'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} y={310} textAlign={'center'} lineHeight={42} opacity={0} />);
  yield* fadeInUp(context(), 20, 0.4);

  yield* waitFor(2.5);
});
