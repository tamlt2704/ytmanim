import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'CPU SPEED'} fill={GREEN} fontFamily={TITLE_FONT} fontSize={80} fontWeight={900} y={-820} letterSpacing={8} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.4);

  // Apollo
  const apolloLabel = createRef<Txt>();
  view.add(<Txt ref={apolloLabel} text={'🚀 Apollo 11'} fill={ORANGE} fontFamily={TITLE_FONT} fontSize={48} fontWeight={900} y={-680} opacity={0} />);
  yield* fadeIn(apolloLabel(), 0.3);

  const apolloVal = createRef<Txt>();
  view.add(<Txt ref={apolloVal} text={'0.043 MHz'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={72} fontWeight={900} y={-580} opacity={0} />);
  yield* fadeIn(apolloVal(), 0.4);

  const apolloBar = createRef<Rect>();
  view.add(<Rect ref={apolloBar} x={0} y={-490} width={0} height={50} radius={12} fill={ORANGE} />);
  yield* apolloBar().width(3, 0.5, easeOutCubic);

  const apolloNote = createRef<Txt>();
  view.add(<Txt ref={apolloNote} text={'43,000 operations per second\nSlower than a basic calculator'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={22} y={-420} textAlign={'center'} lineHeight={34} opacity={0} />);
  yield* fadeIn(apolloNote(), 0.3);
  yield* waitFor(1.5);

  // Phone
  const phoneLabel = createRef<Txt>();
  view.add(<Txt ref={phoneLabel} text={'📱 Your Phone'} fill={GREEN} fontFamily={TITLE_FONT} fontSize={48} fontWeight={900} y={-320} opacity={0} />);
  yield* fadeIn(phoneLabel(), 0.3);

  const phoneVal = createRef<Txt>();
  view.add(<Txt ref={phoneVal} text={'3,000 MHz'} fill={GREEN} fontFamily={CODE_FONT} fontSize={72} fontWeight={900} y={-220} opacity={0} />);
  yield* fadeIn(phoneVal(), 0.4);

  const phoneBar = createRef<Rect>();
  view.add(<Rect ref={phoneBar} x={0} y={-130} width={0} height={50} radius={12} fill={GREEN} />);
  yield* phoneBar().width(460, 0.8, easeOutCubic);

  const phoneNote = createRef<Txt>();
  view.add(<Txt ref={phoneNote} text={'+ multiple cores running\nin parallel'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={22} y={-60} textAlign={'center'} lineHeight={34} opacity={0} />);
  yield* fadeIn(phoneNote(), 0.3);
  yield* waitFor(0.5);

  // Multiplier
  const mult = createRef<Rect>();
  view.add(
    <Rect ref={mult} width={420} height={100} radius={22} fill={RED + '18'} stroke={RED} lineWidth={4} y={60} opacity={0} scale={0}>
      <Txt text={'~100,000x FASTER'} fill={RED} fontFamily={TITLE_FONT} fontSize={48} fontWeight={900} />
    </Rect>,
  );
  yield* all(mult().opacity(1, 0.3), mult().scale(1, 0.4, easeOutBack));
  yield* pulse(mult() as any, 1.08, 0.4);

  const context = createRef<Txt>();
  view.add(<Txt ref={context} text={'What took Apollo 11\none full second to compute...\nyour phone does in 0.00001s'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} y={230} textAlign={'center'} lineHeight={42} opacity={0} />);
  yield* fadeInUp(context(), 20, 0.4);

  yield* waitFor(2.5);
});
