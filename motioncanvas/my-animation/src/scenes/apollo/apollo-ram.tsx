import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'RAM'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={90} fontWeight={900} y={-820} letterSpacing={10} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.4);

  // Apollo side
  const apolloLabel = createRef<Txt>();
  view.add(<Txt ref={apolloLabel} text={'🚀 Apollo 11'} fill={ORANGE} fontFamily={TITLE_FONT} fontSize={48} fontWeight={900} y={-680} opacity={0} />);
  yield* fadeIn(apolloLabel(), 0.3);

  const apolloVal = createRef<Txt>();
  view.add(<Txt ref={apolloVal} text={'74 KB'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={80} fontWeight={900} y={-580} opacity={0} />);
  yield* fadeIn(apolloVal(), 0.4);

  // Apollo bar — tiny
  const apolloBar = createRef<Rect>();
  view.add(<Rect ref={apolloBar} x={0} y={-480} width={0} height={50} radius={12} fill={ORANGE} />);
  yield* apolloBar().width(4, 0.5, easeOutCubic); // barely visible

  const apolloNote = createRef<Txt>();
  view.add(<Txt ref={apolloNote} text={"Couldn't even store\none photo from your phone"} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={24} y={-420} textAlign={'center'} lineHeight={36} opacity={0} />);
  yield* fadeIn(apolloNote(), 0.3);
  yield* waitFor(1.5);

  // Phone side
  const phoneLabel = createRef<Txt>();
  view.add(<Txt ref={phoneLabel} text={'📱 Your Phone'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={48} fontWeight={900} y={-310} opacity={0} />);
  yield* fadeIn(phoneLabel(), 0.3);

  const phoneVal = createRef<Txt>();
  view.add(<Txt ref={phoneVal} text={'8 GB'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={80} fontWeight={900} y={-210} opacity={0} />);
  yield* fadeIn(phoneVal(), 0.4);

  // Phone bar — massive
  const phoneBar = createRef<Rect>();
  view.add(<Rect ref={phoneBar} x={0} y={-110} width={0} height={50} radius={12} fill={ACCENT_COLOR} />);
  yield* phoneBar().width(460, 0.8, easeOutCubic);
  yield* waitFor(0.5);

  // Multiplier
  const mult = createRef<Rect>();
  view.add(
    <Rect ref={mult} width={400} height={100} radius={22} fill={RED + '18'} stroke={RED} lineWidth={4} y={30} opacity={0} scale={0}>
      <Txt text={'100,000x MORE'} fill={RED} fontFamily={TITLE_FONT} fontSize={52} fontWeight={900} />
    </Rect>,
  );
  yield* all(mult().opacity(1, 0.3), mult().scale(1, 0.4, easeOutBack));
  yield* pulse(mult() as any, 1.08, 0.4);

  const context = createRef<Txt>();
  view.add(<Txt ref={context} text={"Your phone's RAM alone\ncould run 100,000 Apollo missions\nsimultaneously"} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} y={210} textAlign={'center'} lineHeight={42} opacity={0} />);
  yield* fadeInUp(context(), 20, 0.4);

  yield* waitFor(2.5);
});
