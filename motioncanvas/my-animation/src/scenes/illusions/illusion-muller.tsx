import {Rect, Txt, Line, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeIn, fadeInUp, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'Müller-Lyer'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={72} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  // Line A with outward arrows (looks longer)
  const lineA = createRef<Line>();
  const arrowA1 = createRef<Line>();
  const arrowA2 = createRef<Line>();
  const arrowA3 = createRef<Line>();
  const arrowA4 = createRef<Line>();
  view.add(<Line ref={lineA} points={[[-250, -400], [250, -400]]} stroke={ACCENT_COLOR} lineWidth={6} end={0} />);
  view.add(<Line ref={arrowA1} points={[[-250, -400], [-320, -460]]} stroke={ACCENT_COLOR} lineWidth={6} end={0} />);
  view.add(<Line ref={arrowA2} points={[[-250, -400], [-320, -340]]} stroke={ACCENT_COLOR} lineWidth={6} end={0} />);
  view.add(<Line ref={arrowA3} points={[[250, -400], [320, -460]]} stroke={ACCENT_COLOR} lineWidth={6} end={0} />);
  view.add(<Line ref={arrowA4} points={[[250, -400], [320, -340]]} stroke={ACCENT_COLOR} lineWidth={6} end={0} />);

  // Line B with inward arrows (looks shorter)
  const lineB = createRef<Line>();
  const arrowB1 = createRef<Line>();
  const arrowB2 = createRef<Line>();
  const arrowB3 = createRef<Line>();
  const arrowB4 = createRef<Line>();
  view.add(<Line ref={lineB} points={[[-250, -200], [250, -200]]} stroke={GREEN} lineWidth={6} end={0} />);
  view.add(<Line ref={arrowB1} points={[[-250, -200], [-180, -260]]} stroke={GREEN} lineWidth={6} end={0} />);
  view.add(<Line ref={arrowB2} points={[[-250, -200], [-180, -140]]} stroke={GREEN} lineWidth={6} end={0} />);
  view.add(<Line ref={arrowB3} points={[[250, -200], [180, -260]]} stroke={GREEN} lineWidth={6} end={0} />);
  view.add(<Line ref={arrowB4} points={[[250, -200], [180, -140]]} stroke={GREEN} lineWidth={6} end={0} />);

  yield* all(lineA().end(1, 0.4, easeOutCubic), lineB().end(1, 0.4, easeOutCubic));
  yield* all(
    arrowA1().end(1, 0.3), arrowA2().end(1, 0.3), arrowA3().end(1, 0.3), arrowA4().end(1, 0.3),
    arrowB1().end(1, 0.3), arrowB2().end(1, 0.3), arrowB3().end(1, 0.3), arrowB4().end(1, 0.3),
  );

  const q = createRef<Txt>();
  view.add(<Txt ref={q} text={'Which line is longer?'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={52} fontWeight={800} y={-20} opacity={0} />);
  yield* fadeInUp(q(), 20, 0.3);
  yield* waitFor(1);

  yield* all(
    arrowA1().opacity(0, 0.4), arrowA2().opacity(0, 0.4), arrowA3().opacity(0, 0.4), arrowA4().opacity(0, 0.4),
    arrowB1().opacity(0, 0.4), arrowB2().opacity(0, 0.4), arrowB3().opacity(0, 0.4), arrowB4().opacity(0, 0.4),
  );

  const answer = createRef<Txt>();
  view.add(<Txt ref={answer} text={"They're IDENTICAL!"} fill={RED} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} y={150} opacity={0} />);
  yield* fadeInUp(answer(), 20, 0.3);
  yield* pulse(answer() as any, 1.15, 0.3);

  const explain = createRef<Txt>();
  view.add(<Txt ref={explain} text={'Arrow direction tricks your\nbrain into misjudging length'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={320} textAlign={'center'} lineHeight={44} opacity={0} />);
  yield* fadeIn(explain(), 0.3);

  yield* waitFor(1.5);
});
