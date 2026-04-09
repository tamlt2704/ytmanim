import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'#1 Chunking'} fill={GREEN} fontFamily={CODE_FONT} fontSize={72} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  // Raw number — hard to remember
  const raw = createRef<Txt>();
  view.add(<Txt ref={raw} text={'149217761969'} fill={RED} fontFamily={CODE_FONT} fontSize={64} fontWeight={700} y={-500} opacity={0} />);
  yield* fadeIn(raw(), 0.3);

  const hard = createRef<Txt>();
  view.add(<Txt ref={hard} text={'😵 Hard to remember!'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={-420} opacity={0} />);
  yield* fadeIn(hard(), 0.2);
  yield* waitFor(0.8);

  // Chunked version
  const chunks = createRefArray<Rect>();
  const labels = ['1492', '1776', '1969'];
  const colors = [ACCENT_COLOR, ORANGE, PURPLE];
  for (let i = 0; i < 3; i++) {
    view.add(
      <Rect ref={chunks} x={-200 + i * 200} y={-200} width={170} height={80} radius={16} fill={colors[i]} opacity={0} scale={0}>
        <Txt text={labels[i]} fill={'#fff'} fontFamily={CODE_FONT} fontSize={40} fontWeight={900} />
      </Rect>,
    );
  }
  yield* all(...chunks.map((c, i) => all(c.opacity(1, 0.2), c.scale(1, 0.3, easeOutCubic))));

  const easy = createRef<Txt>();
  view.add(<Txt ref={easy} text={'✅ 3 meaningful chunks!'} fill={GREEN} fontFamily={CODE_FONT} fontSize={30} y={-100} opacity={0} />);
  yield* fadeIn(easy(), 0.2);

  // Explanation
  const explain = createRef<Txt>();
  view.add(<Txt ref={explain} text={'Break big info into\nsmall groups of 3-4'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={48} fontWeight={800} y={50} textAlign={'center'} lineHeight={66} opacity={0} />);
  yield* fadeInUp(explain(), 20, 0.3);

  const example = createRef<Txt>();
  view.add(<Txt ref={example} text={'Phone numbers already\nuse this trick! 📱'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={230} textAlign={'center'} lineHeight={44} opacity={0} />);
  yield* fadeIn(example(), 0.3);

  yield* waitFor(1.5);
});
