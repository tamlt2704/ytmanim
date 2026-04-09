import {Rect, Txt, makeScene2D, Line, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, easeInOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, ORANGE, PURPLE, RED, CODE_FONT, TITLE_FONT, TERMINAL_BG} from '../../styles';
import {fadeIn, fadeInUp, fadeOut, showCreate, popIn, pulse, typeText} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  // Title
  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'(a + b)\u00b2'} fill={GREEN} fontFamily={CODE_FONT} fontSize={110} fontWeight={800} y={-750} opacity={0} />);
  const subtitle = createRef<Txt>();
  view.add(<Txt ref={subtitle} text={'Square of a Sum'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={44} y={-660} opacity={0} />);

  yield* fadeInUp(title(), 30, 0.4);
  yield* fadeIn(subtitle(), 0.3);
  yield* waitFor(0.3);

  // Formula reveal
  const formula = createRef<Txt>();
  view.add(<Txt ref={formula} text={''} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={52} fontWeight={800} y={-560} opacity={0} />);
  yield* formula().opacity(1, 0.2);
  yield* typeText(formula(), '= a\u00b2 + 2ab + b\u00b2', 0.05);
  yield* waitFor(0.3);

  // Area model: (a+b) x (a+b) square split into 4 parts
  const boxX = 0;
  const boxY = -180;
  const aSize = 220;
  const bSize = 130;
  const total = aSize + bSize;
  const left = boxX - total / 2;
  const top = boxY - total / 2;

  // a² rectangle (top-left)
  const aSq = createRef<Rect>();
  view.add(
    <Rect ref={aSq} x={left + aSize / 2} y={top + aSize / 2} width={aSize} height={aSize} radius={8} fill={GREEN} opacity={0} scale={0}>
      <Txt text={'a\u00b2'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={48} fontWeight={800} />
    </Rect>
  );

  // ab rectangle (top-right)
  const ab1 = createRef<Rect>();
  view.add(
    <Rect ref={ab1} x={left + aSize + bSize / 2} y={top + aSize / 2} width={bSize} height={aSize} radius={8} fill={ORANGE} opacity={0} scale={0}>
      <Txt text={'ab'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={36} fontWeight={800} />
    </Rect>
  );

  // ab rectangle (bottom-left)
  const ab2 = createRef<Rect>();
  view.add(
    <Rect ref={ab2} x={left + aSize / 2} y={top + aSize + bSize / 2} width={aSize} height={bSize} radius={8} fill={ORANGE} opacity={0} scale={0}>
      <Txt text={'ab'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={36} fontWeight={800} />
    </Rect>
  );

  // b² rectangle (bottom-right)
  const bSq = createRef<Rect>();
  view.add(
    <Rect ref={bSq} x={left + aSize + bSize / 2} y={top + aSize + bSize / 2} width={bSize} height={bSize} radius={8} fill={PURPLE} opacity={0} scale={0}>
      <Txt text={'b\u00b2'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={32} fontWeight={800} />
    </Rect>
  );

  // Labels on edges
  const labelA_top = createRef<Txt>();
  const labelB_top = createRef<Txt>();
  const labelA_left = createRef<Txt>();
  const labelB_left = createRef<Txt>();
  view.add(<Txt ref={labelA_top} text={'a'} fill={GREEN} fontFamily={CODE_FONT} fontSize={36} fontWeight={800} x={left + aSize / 2} y={top - 30} opacity={0} />);
  view.add(<Txt ref={labelB_top} text={'b'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={36} fontWeight={800} x={left + aSize + bSize / 2} y={top - 30} opacity={0} />);
  view.add(<Txt ref={labelA_left} text={'a'} fill={GREEN} fontFamily={CODE_FONT} fontSize={36} fontWeight={800} x={left - 30} y={top + aSize / 2} opacity={0} />);
  view.add(<Txt ref={labelB_left} text={'b'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={36} fontWeight={800} x={left - 30} y={top + aSize + bSize / 2} opacity={0} />);

  // Animate area model
  yield* all(labelA_top().opacity(1, 0.3), labelB_top().opacity(1, 0.3), labelA_left().opacity(1, 0.3), labelB_left().opacity(1, 0.3));

  yield* all(aSq().opacity(1, 0.3), aSq().scale(1, 0.4, easeOutCubic));
  yield* waitFor(0.2);
  yield* all(ab1().opacity(1, 0.3), ab1().scale(1, 0.4, easeOutCubic));
  yield* all(ab2().opacity(1, 0.3), ab2().scale(1, 0.4, easeOutCubic));
  yield* waitFor(0.2);
  yield* all(bSq().opacity(1, 0.3), bSq().scale(1, 0.4, easeOutCubic));
  yield* waitFor(0.3);

  // Numeric example
  const example = createRef<Txt>();
  view.add(<Txt ref={example} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={36} fontWeight={700} y={250} opacity={0} />);
  yield* example().opacity(1, 0.2);
  yield* typeText(example(), '(3 + 4)\u00b2 = 9 + 24 + 16 = 49 \u2713', 0.04);
  yield* example().fill(GREEN, 0.3);

  // Tip
  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'Area model: the square is split\ninto a\u00b2 + ab + ab + b\u00b2'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={500} textAlign={'center'} lineHeight={46} opacity={0} />);
  yield* fadeIn(tip(), 0.4);

  yield* waitFor(2);
});
