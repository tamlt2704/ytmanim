import {Rect, Txt, makeScene2D, Line} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, ORANGE, PURPLE, RED, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeIn, fadeInUp, fadeOut, showCreate, typeText, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'(a - b)\u00b2'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={110} fontWeight={800} y={-750} opacity={0} />);
  const subtitle = createRef<Txt>();
  view.add(<Txt ref={subtitle} text={'Square of a Difference'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={44} y={-660} opacity={0} />);

  yield* fadeInUp(title(), 30, 0.4);
  yield* fadeIn(subtitle(), 0.3);

  const formula = createRef<Txt>();
  view.add(<Txt ref={formula} text={''} fill={ORANGE} fontFamily={CODE_FONT} fontSize={52} fontWeight={800} y={-560} opacity={0} />);
  yield* formula().opacity(1, 0.2);
  yield* typeText(formula(), '= a\u00b2 - 2ab + b\u00b2', 0.05);
  yield* waitFor(0.3);

  // Visual: start with a² square, then cut away b strips
  const fullSize = 300;
  const bStrip = 100;
  const cx = 0, cy = -180;

  // Full a² square
  const fullSq = createRef<Rect>();
  view.add(
    <Rect ref={fullSq} x={cx} y={cy} width={fullSize} height={fullSize} radius={8} fill={GREEN} opacity={0} scale={0}>
      <Txt text={'a\u00b2'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={48} fontWeight={800} />
    </Rect>
  );
  yield* all(fullSq().opacity(1, 0.3), fullSq().scale(1, 0.4, easeOutCubic));
  yield* waitFor(0.3);

  // Subtract right strip (ab)
  const stripR = createRef<Rect>();
  view.add(
    <Rect ref={stripR} x={cx + fullSize / 2 - bStrip / 2} y={cy} width={bStrip} height={fullSize} radius={4} fill={RED} opacity={0}>
      <Txt text={'-ab'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={28} fontWeight={800} />
    </Rect>
  );
  yield* stripR().opacity(0.7, 0.4);
  yield* waitFor(0.2);

  // Subtract bottom strip (ab)
  const stripB = createRef<Rect>();
  view.add(
    <Rect ref={stripB} x={cx} y={cy + fullSize / 2 - bStrip / 2} width={fullSize} height={bStrip} radius={4} fill={RED} opacity={0}>
      <Txt text={'-ab'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={28} fontWeight={800} />
    </Rect>
  );
  yield* stripB().opacity(0.7, 0.4);
  yield* waitFor(0.2);

  // Add back b² (double-subtracted corner)
  const bSqRect = createRef<Rect>();
  view.add(
    <Rect ref={bSqRect} x={cx + fullSize / 2 - bStrip / 2} y={cy + fullSize / 2 - bStrip / 2} width={bStrip} height={bStrip} radius={4} fill={PURPLE} opacity={0} scale={0}>
      <Txt text={'+b\u00b2'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={24} fontWeight={800} />
    </Rect>
  );
  yield* all(bSqRect().opacity(1, 0.3), bSqRect().scale(1, 0.4, easeOutCubic));

  const stepTxt = createRef<Txt>();
  view.add(<Txt ref={stepTxt} text={''} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={80} opacity={0} />);
  yield* stepTxt().opacity(1, 0.2);
  yield* typeText(stepTxt(), 'a\u00b2 - ab - ab + b\u00b2 (add back overlap)', 0.04);
  yield* waitFor(0.3);

  // Numeric example
  const example = createRef<Txt>();
  view.add(<Txt ref={example} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={36} fontWeight={700} y={250} opacity={0} />);
  yield* example().opacity(1, 0.2);
  yield* typeText(example(), '(7 - 3)\u00b2 = 49 - 42 + 9 = 16 \u2713', 0.04);
  yield* example().fill(GREEN, 0.3);

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'Subtract two strips, add back\nthe corner you double-counted'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={500} textAlign={'center'} lineHeight={46} opacity={0} />);
  yield* fadeIn(tip(), 0.4);
  yield* waitFor(2);
});
