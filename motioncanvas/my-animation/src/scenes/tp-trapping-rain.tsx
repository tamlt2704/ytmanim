import {Rect, Txt, makeScene2D, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, easeInOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, TERMINAL_BORDER, CODE_FONT, TITLE_FONT, ORANGE, PURPLE} from '../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const badge = createRef<Rect>();
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const difficulty = createRef<Rect>();

  view.add(<Rect ref={badge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}><Txt text={'#5'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} /></Rect>);
  view.add(<Txt ref={title} text={'Trapping Rain'} fill={RED} fontFamily={CODE_FONT} fontSize={80} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Water Between Bars'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={44} y={-490} opacity={0} />);
  view.add(<Rect ref={difficulty} x={0} y={-430} width={140} height={44} radius={22} fill={RED} opacity={0} scale={0}><Txt text={'Hard'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} /></Rect>);

  // Elevation map: [0,1,0,2,1,0,1,3,2,1,2,1]
  const heights = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];
  const water =   [0, 0, 1, 0, 1, 2, 1, 0, 0, 1, 0, 0]; // trapped water per col
  const barW = 42;
  const gap = 6;
  const baseY = -20;
  const scale = 40;
  const startX = -((heights.length - 1) * (barW + gap)) / 2;
  const bars = createRefArray<Rect>();
  const waterBars = createRefArray<Rect>();

  for (let i = 0; i < heights.length; i++) {
    const h = Math.max(heights[i] * scale, 4);
    view.add(<Rect ref={bars} x={startX + i * (barW + gap)} y={baseY - h / 2} width={barW} height={h} radius={4} fill={'#30363d'} opacity={0} scale={0} />);
    if (water[i] > 0) {
      const wh = water[i] * scale;
      view.add(<Rect ref={waterBars} x={startX + i * (barW + gap)} y={baseY - heights[i] * scale - wh / 2} width={barW} height={wh} radius={2} fill={ACCENT_COLOR} opacity={0} />);
    }
  }

  // Pointers
  const leftPtr = createRef<Node>();
  const rightPtr = createRef<Node>();
  view.add(<Node ref={leftPtr} x={startX} y={baseY + 35} opacity={0}><Txt text={'L'} fill={GREEN} fontFamily={CODE_FONT} fontSize={28} fontWeight={800} /></Node>);
  view.add(<Node ref={rightPtr} x={startX + 11 * (barW + gap)} y={baseY + 35} opacity={0}><Txt text={'R'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={28} fontWeight={800} /></Node>);

  const statusTxt = createRef<Txt>();
  view.add(<Txt ref={statusTxt} text={''} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={30} fontWeight={800} y={baseY + 80} opacity={0} />);

  // Code block
  const codeBox = createRef<Rect>();
  const codeLines = createRefArray<Txt>();
  view.add(
    <Rect ref={codeBox} width={900} height={380} y={370} radius={16} fill={TERMINAL_BG} stroke={TERMINAL_BORDER} lineWidth={2} opacity={0} scale={0.8} clip>
      <Rect width={900} height={44} y={-168} fill={'#21262d'}><Txt text={'Python'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={18} /></Rect>
      <Txt ref={codeLines} text={''} fill={PURPLE} fontFamily={CODE_FONT} fontSize={19} x={-410} y={-110} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={19} x={-410} y={-78} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={19} x={-410} y={-46} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={19} x={-410} y={-14} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={19} x={-410} y={18} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={19} x={-410} y={50} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={19} x={-410} y={82} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={19} x={-410} y={114} offsetX={-1} opacity={0} />
    </Rect>
  );

  // === ANIMATION ===
  yield* all(badge().opacity(1, 0.3), badge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* all(difficulty().opacity(1, 0.3), difficulty().scale(1, 0.4, easeOutCubic));
  yield* waitFor(0.2);

  for (let i = 0; i < heights.length; i++) {
    yield* all(bars[i].opacity(1, 0.06), bars[i].scale(1, 0.12, easeOutCubic));
  }
  yield* all(leftPtr().opacity(1, 0.3), rightPtr().opacity(1, 0.3));
  yield* statusTxt().opacity(1, 0.2);

  // Animate: track leftMax, rightMax, move shorter side
  yield* statusTxt().text('Track max height from each side', 0.4);
  yield* waitFor(0.5);

  yield* statusTxt().text('Move pointer with smaller max →', 0.4);
  yield* leftPtr().x(startX + 2 * (barW + gap), 0.5, easeInOutCubic);
  yield* waitFor(0.3);

  // Show water filling in
  yield* statusTxt().text('Water = min(leftMax, rightMax) - h', 0.4);
  let wIdx = 0;
  for (let i = 0; i < heights.length; i++) {
    if (water[i] > 0) {
      yield* waterBars[wIdx].opacity(0.7, 0.15);
      wIdx++;
    }
  }
  yield* statusTxt().text('Total trapped: 6 units 💧', 0.3);
  yield* statusTxt().fill(GREEN, 0.3);
  yield* waitFor(0.5);

  // Show code
  yield* all(codeBox().opacity(1, 0.4), codeBox().scale(1, 0.5, easeOutCubic));
  yield* all(codeLines[0].opacity(1, 0.12), codeLines[0].text('def trap(height):', 0.25));
  yield* all(codeLines[1].opacity(1, 0.12), codeLines[1].text('    l, r = 0, len(height) - 1', 0.25));
  yield* all(codeLines[2].opacity(1, 0.12), codeLines[2].text('    lmax = rmax = res = 0', 0.25));
  yield* all(codeLines[3].opacity(1, 0.12), codeLines[3].text('    while l < r:', 0.25));
  yield* all(codeLines[4].opacity(1, 0.12), codeLines[4].text('        if height[l] <= height[r]:', 0.25));
  yield* all(codeLines[5].opacity(1, 0.12), codeLines[5].text('            lmax = max(lmax, height[l])', 0.25));
  yield* all(codeLines[6].opacity(1, 0.12), codeLines[6].text('            res += lmax - height[l]; l += 1', 0.25));
  yield* all(codeLines[7].opacity(1, 0.12), codeLines[7].text('        else: rmax=max(...); res+=...; r-=1', 0.25));

  yield* waitFor(2);
});
