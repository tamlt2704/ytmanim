import {Rect, Txt, Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'#6 Visualization'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={72} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  // Plain text — boring
  const plain = createRef<Rect>();
  view.add(
    <Rect ref={plain} width={400} height={80} radius={16} fill={'#21262d'} y={-550} opacity={0}>
      <Txt text={'"apple"'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={40} />
    </Rect>,
  );
  yield* plain().opacity(1, 0.3);

  const meh = createRef<Txt>();
  view.add(<Txt ref={meh} text={'😐 Boring, forgettable'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={-460} opacity={0} />);
  yield* fadeIn(meh(), 0.2);
  yield* waitFor(0.5);

  // Vivid image
  const vivid = createRef<Rect>();
  view.add(
    <Rect ref={vivid} width={440} height={160} radius={20} fill={RED + '15'} stroke={RED} lineWidth={3} y={-280} opacity={0} scale={0}>
      <Txt text={'🍎'} fontSize={80} x={-150} />
      <Txt text={'Giant RED apple\ncrashing on desk!'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} x={60} textAlign={'center'} lineHeight={38} />
    </Rect>,
  );
  yield* all(vivid().opacity(1, 0.2), vivid().scale(1, 0.4, easeOutBack));
  yield* pulse(vivid() as any, 1.05, 0.3);

  const wow = createRef<Txt>();
  view.add(<Txt ref={wow} text={'✅ Unforgettable!'} fill={GREEN} fontFamily={CODE_FONT} fontSize={32} fontWeight={700} y={-150} opacity={0} />);
  yield* fadeIn(wow(), 0.2);

  // Tips
  const tips = createRef<Txt>();
  view.add(<Txt ref={tips} text={'Make it BIG 🔍\nMake it COLORFUL 🎨\nMake it MOVING 💨'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={30} fontWeight={700} y={10} textAlign={'center'} lineHeight={54} opacity={0} />);
  yield* fadeInUp(tips(), 20, 0.3);

  const explain = createRef<Txt>();
  view.add(<Txt ref={explain} text={'Your visual cortex is\nyour strongest memory tool'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={200} textAlign={'center'} lineHeight={44} opacity={0} />);
  yield* fadeIn(explain(), 0.3);

  yield* waitFor(1.5);
});
