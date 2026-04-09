import {Rect, Txt, makeScene2D, Node, Line} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, easeInOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, TERMINAL_BORDER, CODE_FONT, TITLE_FONT, ORANGE, PURPLE} from '../../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const badge = createRef<Rect>();
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const difficulty = createRef<Rect>();

  view.add(<Rect ref={badge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}><Txt text={'#4'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} /></Rect>);
  view.add(<Txt ref={title} text={'Container Water'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={72} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Max Area Between Lines'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={44} y={-490} opacity={0} />);
  view.add(<Rect ref={difficulty} x={0} y={-430} width={180} height={44} radius={22} fill={ORANGE} opacity={0} scale={0}><Txt text={'Medium'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} /></Rect>);

  // Bar chart visualization
  const heights = [1, 8, 6, 2, 5, 4, 8, 3, 7];
  const barW = 50;
  const gap = 14;
  const baseY = -30;
  const scale = 28;
  const startX = -((heights.length - 1) * (barW + gap)) / 2;
  const bars = createRefArray<Rect>();

  for (let i = 0; i < heights.length; i++) {
    const h = heights[i] * scale;
    view.add(
      <Rect ref={bars} x={startX + i * (barW + gap)} y={baseY - h / 2} width={barW} height={h} radius={6} fill={ACCENT_COLOR} opacity={0} scale={0} />
    );
  }

  // Water area highlight
  const water = createRef<Rect>();
  view.add(<Rect ref={water} x={0} y={baseY - (7 * scale) / 2} width={7 * (barW + gap)} height={7 * scale} fill={ACCENT_COLOR} opacity={0} radius={4} />);

  // Pointers
  const leftPtr = createRef<Node>();
  const rightPtr = createRef<Node>();
  view.add(<Node ref={leftPtr} x={startX} y={baseY + 40} opacity={0}><Txt text={'L'} fill={GREEN} fontFamily={CODE_FONT} fontSize={30} fontWeight={800} /></Node>);
  view.add(<Node ref={rightPtr} x={startX + 8 * (barW + gap)} y={baseY + 40} opacity={0}><Txt text={'R'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={30} fontWeight={800} /></Node>);

  const areaTxt = createRef<Txt>();
  view.add(<Txt ref={areaTxt} text={''} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={32} fontWeight={800} y={baseY + 90} opacity={0} />);

  // Code block
  const codeBox = createRef<Rect>();
  const codeLines = createRefArray<Txt>();
  view.add(
    <Rect ref={codeBox} width={900} height={340} y={380} radius={16} fill={TERMINAL_BG} stroke={TERMINAL_BORDER} lineWidth={2} opacity={0} scale={0.8} clip>
      <Rect width={900} height={44} y={-148} fill={'#21262d'}><Txt text={'Python'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={18} /></Rect>
      <Txt ref={codeLines} text={''} fill={PURPLE} fontFamily={CODE_FONT} fontSize={20} x={-410} y={-90} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={20} x={-410} y={-55} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={20} x={-410} y={-20} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={20} x={-410} y={15} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={20} x={-410} y={50} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={20} x={-410} y={85} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={20} x={-410} y={120} offsetX={-1} opacity={0} />
    </Rect>
  );

  // === ANIMATION ===
  yield* all(badge().opacity(1, 0.3), badge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* all(difficulty().opacity(1, 0.3), difficulty().scale(1, 0.4, easeOutCubic));
  yield* waitFor(0.2);

  for (let i = 0; i < heights.length; i++) {
    yield* all(bars[i].opacity(1, 0.08), bars[i].scale(1, 0.15, easeOutCubic));
  }
  yield* all(leftPtr().opacity(1, 0.3), rightPtr().opacity(1, 0.3));
  yield* areaTxt().opacity(1, 0.2);

  // L=0(1), R=8(7) → area = min(1,7)*8 = 8 → move L (shorter)
  yield* areaTxt().text('area = min(1,7) × 8 = 8', 0.4);
  yield* waitFor(0.4);
  yield* leftPtr().x(startX + 1 * (barW + gap), 0.3, easeInOutCubic);

  // L=1(8), R=8(7) → area = min(8,7)*7 = 49 → best!
  yield* areaTxt().text('area = min(8,7) × 7 = 49 ★', 0.4);
  yield* areaTxt().fill(GREEN, 0.3);
  yield* water().opacity(0.12, 0.4);
  yield* waitFor(0.5);

  // Move R
  yield* all(rightPtr().x(startX + 7 * (barW + gap), 0.3, easeInOutCubic), areaTxt().fill(ACCENT_COLOR, 0.2));
  yield* areaTxt().text('Move shorter side inward →', 0.3);
  yield* waitFor(0.5);

  // Show code
  yield* all(codeBox().opacity(1, 0.4), codeBox().scale(1, 0.5, easeOutCubic));
  yield* all(codeLines[0].opacity(1, 0.15), codeLines[0].text('def maxArea(height):', 0.3));
  yield* all(codeLines[1].opacity(1, 0.15), codeLines[1].text('    l, r, best = 0, len(height)-1, 0', 0.3));
  yield* all(codeLines[2].opacity(1, 0.15), codeLines[2].text('    while l < r:', 0.3));
  yield* all(codeLines[3].opacity(1, 0.15), codeLines[3].text('        area = min(height[l],height[r])*(r-l)', 0.25));
  yield* all(codeLines[4].opacity(1, 0.15), codeLines[4].text('        best = max(best, area)', 0.3));
  yield* all(codeLines[5].opacity(1, 0.15), codeLines[5].text('        if height[l] < height[r]: l += 1', 0.3));
  yield* all(codeLines[6].opacity(1, 0.15), codeLines[6].text('        else: r -= 1', 0.3));

  yield* waitFor(2);
});
