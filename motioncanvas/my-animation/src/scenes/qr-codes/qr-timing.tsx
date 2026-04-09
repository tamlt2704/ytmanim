import {Rect, Txt, Line, Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(
    <Txt ref={title}
      text={'Timing &\nAlignment'}
      fill={GREEN} fontFamily={TITLE_FONT}
      fontSize={80} fontWeight={900}
      y={-780} textAlign={'center'} lineHeight={90}
      opacity={0}
    />,
  );
  yield* fadeInUp(title(), 30, 0.4);

  // Timing pattern — alternating black/white line
  const timingLabel = createRef<Txt>();
  view.add(
    <Txt ref={timingLabel}
      text={'📏 Timing Pattern'}
      fill={GREEN} fontFamily={CODE_FONT}
      fontSize={36} fontWeight={900}
      y={-600} opacity={0}
    />,
  );
  yield* fadeIn(timingLabel(), 0.3);

  // Horizontal timing strip
  const stripY = -500;
  for (let i = 0; i < 15; i++) {
    const box = createRef<Rect>();
    view.add(
      <Rect ref={box}
        x={-210 + i * 30} y={stripY}
        width={26} height={26} radius={4}
        fill={i % 2 === 0 ? TEXT_COLOR : '#21262d'}
        opacity={0}
      />,
    );
    yield* box().opacity(1, 0.04);
  }

  const timingDesc = createRef<Txt>();
  view.add(
    <Txt ref={timingDesc}
      text={'Alternating black & white\nHelps scanner count\nrows and columns'}
      fill={TEXT_COLOR} fontFamily={CODE_FONT}
      fontSize={30} fontWeight={700}
      y={-390} textAlign={'center'} lineHeight={44}
      opacity={0}
    />,
  );
  yield* fadeInUp(timingDesc(), 20, 0.3);
  yield* waitFor(1.5);

  // Alignment pattern
  const alignLabel = createRef<Txt>();
  view.add(
    <Txt ref={alignLabel}
      text={'📐 Alignment Pattern'}
      fill={ORANGE} fontFamily={CODE_FONT}
      fontSize={36} fontWeight={900}
      y={-230} opacity={0}
    />,
  );
  yield* fadeIn(alignLabel(), 0.3);

  // Draw alignment pattern (small nested square)
  const ax = 0;
  const ay = -100;
  const aOuter = createRef<Rect>();
  const aMid = createRef<Rect>();
  const aInner = createRef<Rect>();
  view.add(<Rect ref={aOuter} x={ax} y={ay} width={100} height={100} radius={6} fill={'none'} stroke={TEXT_COLOR} lineWidth={5} opacity={0} />);
  view.add(<Rect ref={aMid} x={ax} y={ay} width={65} height={65} radius={4} fill={'none'} stroke={BG_COLOR} lineWidth={5} opacity={0} />);
  view.add(<Rect ref={aInner} x={ax} y={ay} width={30} height={30} radius={3} fill={TEXT_COLOR} opacity={0} />);
  yield* all(aOuter().opacity(1, 0.3), aMid().opacity(1, 0.3), aInner().opacity(1, 0.3));

  const alignDesc = createRef<Txt>();
  view.add(
    <Txt ref={alignDesc}
      text={'Fixes warping when\nQR code is curved\nor at an angle'}
      fill={TEXT_COLOR} fontFamily={CODE_FONT}
      fontSize={30} fontWeight={700}
      y={30} textAlign={'center'} lineHeight={44}
      opacity={0}
    />,
  );
  yield* fadeInUp(alignDesc(), 20, 0.3);

  const tip = createRef<Txt>();
  view.add(
    <Txt ref={tip}
      text={'Bigger QR codes have\nmore alignment patterns'}
      fill={'#8b949e'} fontFamily={CODE_FONT}
      fontSize={26} y={180}
      textAlign={'center'} lineHeight={40}
      opacity={0}
    />,
  );
  yield* fadeIn(tip(), 0.3);

  yield* waitFor(2.5);
});
