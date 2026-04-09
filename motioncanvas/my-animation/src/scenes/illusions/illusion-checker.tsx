import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, CODE_FONT, TITLE_FONT, TERMINAL_BG} from '../../styles';
import {fadeIn, fadeInUp, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'Checker Shadow'} fill={GREEN} fontFamily={CODE_FONT} fontSize={72} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  // Checkerboard 4x4
  const cellSize = 100;
  const startX = -200;
  const startY = -550;
  const cells = createRefArray<Rect>();

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const isLight = (r + c) % 2 === 0;
      view.add(
        <Rect ref={cells} x={startX + c * cellSize} y={startY + r * cellSize}
          width={cellSize - 4} height={cellSize - 4} radius={4}
          fill={isLight ? '#6e7681' : '#2d333b'} opacity={0} />,
      );
    }
  }

  yield* all(...cells.map(c => c.opacity(1, 0.3)));

  // Shadow overlay on right side
  const shadow = createRef<Rect>();
  view.add(<Rect ref={shadow} x={startX + 2.5 * cellSize} y={startY + 1.5 * cellSize} width={cellSize * 2.2} height={cellSize * 4.2} radius={8} fill={'#000'} opacity={0} />);
  yield* shadow().opacity(0.45, 0.4);

  // Label A (dark, no shadow) and B (light, in shadow)
  const labelA = createRef<Txt>();
  const labelB = createRef<Txt>();
  view.add(<Txt ref={labelA} text={'A'} fill={RED} fontFamily={TITLE_FONT} fontSize={44} fontWeight={900} x={startX + 1 * cellSize} y={startY + 0 * cellSize} opacity={0} />);
  view.add(<Txt ref={labelB} text={'B'} fill={RED} fontFamily={TITLE_FONT} fontSize={44} fontWeight={900} x={startX + 2 * cellSize} y={startY + 2 * cellSize} opacity={0} />);

  yield* all(labelA().opacity(1, 0.3), labelB().opacity(1, 0.3));

  const q = createRef<Txt>();
  view.add(<Txt ref={q} text={'A and B are\ndifferent shades... right?'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={44} fontWeight={800} y={-20} textAlign={'center'} lineHeight={60} opacity={0} />);
  yield* fadeInUp(q(), 20, 0.3);
  yield* waitFor(1);

  yield* shadow().opacity(0, 0.5);

  const answer = createRef<Txt>();
  view.add(<Txt ref={answer} text={'SAME exact shade!'} fill={RED} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} y={180} opacity={0} />);
  yield* fadeInUp(answer(), 20, 0.3);
  yield* pulse(answer() as any, 1.15, 0.3);

  const explain = createRef<Txt>();
  view.add(<Txt ref={explain} text={"Your brain auto-corrects\nfor shadows that aren't real"} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={340} textAlign={'center'} lineHeight={44} opacity={0} />);
  yield* fadeIn(explain(), 0.3);

  yield* waitFor(1.5);
});
