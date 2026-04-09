import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CYAN, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'#4 Acronyms'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={72} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  // Rainbow colors list
  const colors = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet'];
  const fills = [RED, ORANGE, '#e3b341', GREEN, ACCENT_COLOR, PURPLE, '#bc8cff'];
  for (let i = 0; i < colors.length; i++) {
    const t = createRef<Txt>();
    view.add(<Txt ref={t} text={colors[i]} fill={fills[i]} fontFamily={CODE_FONT} fontSize={30} fontWeight={700} x={-250} y={-550 + i * 50} opacity={0} />);
    yield* t().opacity(1, 0.06);
  }

  const hard = createRef<Txt>();
  view.add(<Txt ref={hard} text={'7 items to memorize...'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={-180} opacity={0} />);
  yield* fadeIn(hard(), 0.2);
  yield* waitFor(0.5);

  // Acronym badge
  const badge = createRef<Rect>();
  view.add(
    <Rect ref={badge} width={420} height={100} radius={20} fill={ORANGE} y={-50} opacity={0} scale={0}>
      <Txt text={'ROY G. BIV'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={60} fontWeight={900} letterSpacing={6} />
    </Rect>,
  );
  yield* all(badge().opacity(1, 0.2), badge().scale(1, 0.3, easeOutBack));

  const easy = createRef<Txt>();
  view.add(<Txt ref={easy} text={'✅ 1 word = 7 colors!'} fill={GREEN} fontFamily={CODE_FONT} fontSize={32} fontWeight={700} y={60} opacity={0} />);
  yield* fadeIn(easy(), 0.2);

  // Another example
  const ex2 = createRef<Rect>();
  view.add(
    <Rect ref={ex2} width={380} height={80} radius={16} fill={ACCENT_COLOR + '22'} stroke={ACCENT_COLOR} lineWidth={3} y={190} opacity={0} scale={0}>
      <Txt text={'HOMES → Great Lakes'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} fontWeight={700} />
    </Rect>,
  );
  yield* all(ex2().opacity(1, 0.2), ex2().scale(1, 0.3, easeOutCubic));

  const explain = createRef<Txt>();
  view.add(<Txt ref={explain} text={'First letters become\none memorable word'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={44} fontWeight={800} y={370} textAlign={'center'} lineHeight={62} opacity={0} />);
  yield* fadeInUp(explain(), 20, 0.3);

  yield* waitFor(1.5);
});
