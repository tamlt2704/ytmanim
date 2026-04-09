import {Rect, Txt, Line, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'#7 Active Recall'} fill={GREEN} fontFamily={CODE_FONT} fontSize={72} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  // VS comparison
  const reread = createRef<Rect>();
  view.add(
    <Rect ref={reread} width={380} height={200} radius={20} fill={RED + '15'} stroke={RED} lineWidth={3} x={0} y={-500} opacity={0} scale={0}>
      <Txt text={'📖 Re-reading'} fill={RED} fontFamily={CODE_FONT} fontSize={32} fontWeight={800} y={-50} />
      <Txt text={'Passive\nFeels easy\nWeak memory'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={22} y={40} textAlign={'center'} lineHeight={32} />
    </Rect>,
  );
  yield* all(reread().opacity(1, 0.2), reread().scale(1, 0.3, easeOutBack));

  const vs = createRef<Txt>();
  view.add(<Txt ref={vs} text={'VS'} fill={ORANGE} fontFamily={TITLE_FONT} fontSize={50} fontWeight={900} y={-340} opacity={0} />);
  yield* fadeIn(vs(), 0.2);

  const testing = createRef<Rect>();
  view.add(
    <Rect ref={testing} width={380} height={200} radius={20} fill={GREEN + '15'} stroke={GREEN} lineWidth={3} x={0} y={-180} opacity={0} scale={0}>
      <Txt text={'❓ Self-testing'} fill={GREEN} fontFamily={CODE_FONT} fontSize={32} fontWeight={800} y={-50} />
      <Txt text={'Active\nFeels hard\nStrong memory!'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} y={40} textAlign={'center'} lineHeight={32} />
    </Rect>,
  );
  yield* all(testing().opacity(1, 0.2), testing().scale(1, 0.3, easeOutBack));
  yield* pulse(testing() as any, 1.05, 0.3);

  // Result
  const result = createRef<Txt>();
  view.add(<Txt ref={result} text={'Testing yourself = 2x\nbetter retention!'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={44} fontWeight={800} y={40} textAlign={'center'} lineHeight={62} opacity={0} />);
  yield* fadeInUp(result(), 20, 0.3);

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'Close the book and try\nto explain from memory 🧠'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={210} textAlign={'center'} lineHeight={44} opacity={0} />);
  yield* fadeIn(tip(), 0.3);

  yield* waitFor(1.5);
});
