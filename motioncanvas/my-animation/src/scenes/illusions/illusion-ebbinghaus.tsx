import {Txt, Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, easeOutBack, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeIn, fadeInUp, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'Ebbinghaus'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={72} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  // Left: center circle surrounded by BIG circles
  const centerL = createRef<Circle>();
  view.add(<Circle ref={centerL} x={-220} y={-350} size={80} fill={ORANGE} opacity={0} scale={0} />);
  const bigSurround = createRefArray<Circle>();
  const angles = [0, 60, 120, 180, 240, 300];
  for (const a of angles) {
    const rad = (a * Math.PI) / 180;
    view.add(<Circle ref={bigSurround} x={-220 + Math.cos(rad) * 140} y={-350 + Math.sin(rad) * 140} size={100} fill={ACCENT_COLOR} opacity={0} scale={0} />);
  }

  // Right: center circle surrounded by SMALL circles
  const centerR = createRef<Circle>();
  view.add(<Circle ref={centerR} x={220} y={-350} size={80} fill={ORANGE} opacity={0} scale={0} />);
  const smallSurround = createRefArray<Circle>();
  for (const a of angles) {
    const rad = (a * Math.PI) / 180;
    view.add(<Circle ref={smallSurround} x={220 + Math.cos(rad) * 80} y={-350 + Math.sin(rad) * 80} size={30} fill={GREEN} opacity={0} scale={0} />);
  }

  yield* all(...bigSurround.map(c => all(c.opacity(1, 0.15), c.scale(1, 0.2, easeOutCubic))));
  yield* all(...smallSurround.map(c => all(c.opacity(1, 0.15), c.scale(1, 0.2, easeOutCubic))));
  yield* all(
    centerL().opacity(1, 0.2), centerL().scale(1, 0.3, easeOutBack),
    centerR().opacity(1, 0.2), centerR().scale(1, 0.3, easeOutBack),
  );

  const q = createRef<Txt>();
  view.add(<Txt ref={q} text={'Which orange circle\nis bigger?'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={52} fontWeight={800} y={-80} textAlign={'center'} lineHeight={68} opacity={0} />);
  yield* fadeInUp(q(), 20, 0.3);
  yield* waitFor(1.2);

  yield* all(
    ...bigSurround.map(c => c.opacity(0, 0.4)),
    ...smallSurround.map(c => c.opacity(0, 0.4)),
  );
  yield* all(centerL().x(-80, 0.4, easeOutCubic), centerR().x(80, 0.4, easeOutCubic));

  const answer = createRef<Txt>();
  view.add(<Txt ref={answer} text={'Exactly the SAME!'} fill={RED} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} y={150} opacity={0} />);
  yield* fadeInUp(answer(), 20, 0.3);
  yield* pulse(answer() as any, 1.15, 0.3);

  const explain = createRef<Txt>();
  view.add(<Txt ref={explain} text={'Surrounding context changes\nhow you perceive size'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={310} textAlign={'center'} lineHeight={44} opacity={0} />);
  yield* fadeIn(explain(), 0.3);

  yield* waitFor(1.5);
});
