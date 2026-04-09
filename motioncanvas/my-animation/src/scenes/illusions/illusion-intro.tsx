import {Rect, Txt, Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, PURPLE, ORANGE, CODE_FONT, TITLE_FONT} from '../../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const glow = createRef<Circle>();
  view.add(<Circle ref={glow} size={500} fill={PURPLE} opacity={0} y={-200} />);

  const corner1 = createRef<Rect>();
  const corner2 = createRef<Rect>();
  view.add(<Rect ref={corner1} width={300} height={300} x={-390} y={-810} rotation={45} fill={ORANGE} opacity={0} />);
  view.add(<Rect ref={corner2} width={200} height={200} x={390} y={810} rotation={45} fill={GREEN} opacity={0} />);

  const eye = createRef<Txt>();
  view.add(<Txt ref={eye} text={'👁️'} fontSize={250} y={-350} opacity={0} scale={0} />);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'OPTICAL'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={150} fontWeight={900} y={-80} letterSpacing={14} opacity={0} />);
  const title2 = createRef<Txt>();
  view.add(<Txt ref={title2} text={'ILLUSIONS'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={110} fontWeight={900} y={70} letterSpacing={8} opacity={0} />);

  const sub = createRef<Txt>();
  view.add(<Txt ref={sub} text={'Your Eyes Are Lying\nTo You Right Now'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={36} y={250} textAlign={'center'} lineHeight={54} opacity={0} />);

  const badge = createRef<Rect>();
  view.add(
    <Rect ref={badge} x={350} y={-800} width={180} height={180} radius={90} fill={RED} opacity={0} scale={0}>
      <Txt text={'30s'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={900} />
    </Rect>,
  );

  const brain = createRef<Txt>();
  view.add(<Txt ref={brain} text={'🤯'} fontSize={120} y={450} opacity={0} scale={0} />);

  yield* glow().opacity(0.08, 0.4);
  yield* all(corner1().opacity(0.15, 0.3), corner2().opacity(0.15, 0.3));
  yield* all(eye().opacity(1, 0.3), eye().scale(1, 0.5, easeOutBack));
  yield* title().opacity(1, 0.3);
  yield* title2().opacity(1, 0.3);
  yield* sub().opacity(1, 0.3);
  yield* all(badge().opacity(1, 0.2), badge().scale(1, 0.3, easeOutBack));
  yield* all(brain().opacity(1, 0.2), brain().scale(1, 0.3, easeOutBack));

  yield* waitFor(1);

  yield* all(
    glow().opacity(0, 0.3), corner1().opacity(0, 0.3), corner2().opacity(0, 0.3),
    eye().opacity(0, 0.3), title().opacity(0, 0.3), title2().opacity(0, 0.3),
    sub().opacity(0, 0.3), badge().opacity(0, 0.3), brain().opacity(0, 0.3),
  );
});
