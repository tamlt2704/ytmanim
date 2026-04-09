import {Rect, Txt, makeScene2D, Line, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, easeInOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, ORANGE, PURPLE, RED, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeIn, fadeInUp, showCreate, typeText, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'a\u00b2 - b\u00b2'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={110} fontWeight={800} y={-750} opacity={0} />);
  const subtitle = createRef<Txt>();
  view.add(<Txt ref={subtitle} text={'Difference of Squares'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={44} y={-660} opacity={0} />);

  yield* fadeInUp(title(), 30, 0.4);
  yield* fadeIn(subtitle(), 0.3);

  const formula = createRef<Txt>();
  view.add(<Txt ref={formula} text={''} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={52} fontWeight={800} y={-560} opacity={0} />);
  yield* formula().opacity(1, 0.2);
  yield* typeText(formula(), '= (a + b)(a - b)', 0.05);
  yield* waitFor(0.3);

  // Visual: a² big square with b² cut out
  const aSize = 300;
  const bSize = 160;
  const cx = 0, cy = -180;

  // a² square
  const aSq = createRef<Rect>();
  view.add(
    <Rect ref={aSq} x={cx} y={cy} width={aSize} height={aSize} radius={8} fill={GREEN} opacity={0} scale={0}>
      <Txt text={'a\u00b2'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={48} fontWeight={800} y={-40} />
    </Rect>
  );
  yield* all(aSq().opacity(1, 0.3), aSq().scale(1, 0.4, easeOutCubic));
  yield* waitFor(0.3);

  // b² cutout (bottom-right corner)
  const bSq = createRef<Rect>();
  view.add(
    <Rect ref={bSq} x={cx + (aSize - bSize) / 2} y={cy + (aSize - bSize) / 2} width={bSize} height={bSize} radius={6} fill={RED} opacity={0}>
      <Txt text={'b\u00b2'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={36} fontWeight={800} />
    </Rect>
  );
  yield* bSq().opacity(0.8, 0.4);

  const minus = createRef<Txt>();
  view.add(<Txt ref={minus} text={'a\u00b2 - b\u00b2 = remaining L-shape'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={40} opacity={0} />);
  yield* fadeIn(minus(), 0.3);
  yield* waitFor(0.4);

  // Rearrange into rectangle: (a+b) wide, (a-b) tall
  yield* all(aSq().opacity(0, 0.3), bSq().opacity(0, 0.3), minus().opacity(0, 0.3));

  const rectW = aSize + bSize;
  const rectH = (aSize - bSize);
  const result = createRef<Rect>();
  view.add(
    <Rect ref={result} x={cx} y={cy} width={rectW} height={rectH} radius={8} fill={ACCENT_COLOR} opacity={0} scale={0}>
      <Txt text={'(a+b) \u00d7 (a-b)'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={32} fontWeight={800} />
    </Rect>
  );

  const wLabel = createRef<Txt>();
  const hLabel = createRef<Txt>();
  view.add(<Txt ref={wLabel} text={'a + b'} fill={GREEN} fontFamily={CODE_FONT} fontSize={30} fontWeight={800} x={cx} y={cy - rectH / 2 - 25} opacity={0} />);
  view.add(<Txt ref={hLabel} text={'a - b'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={30} fontWeight={800} x={cx - rectW / 2 - 45} y={cy} opacity={0} />);

  yield* all(result().opacity(1, 0.3), result().scale(1, 0.5, easeOutCubic));
  yield* all(wLabel().opacity(1, 0.3), hLabel().opacity(1, 0.3));
  yield* waitFor(0.3);

  // Numeric example
  const example = createRef<Txt>();
  view.add(<Txt ref={example} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={36} fontWeight={700} y={200} opacity={0} />);
  yield* example().opacity(1, 0.2);
  yield* typeText(example(), '5\u00b2 - 3\u00b2 = (5+3)(5-3) = 8\u00d72 = 16 \u2713', 0.04);
  yield* example().fill(GREEN, 0.3);

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'The L-shape rearranges into\\na rectangle of (a+b) by (a-b)'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={500} textAlign={'center'} lineHeight={46} opacity={0} />);
  yield* fadeIn(tip(), 0.4);
  yield* waitFor(2);
});
