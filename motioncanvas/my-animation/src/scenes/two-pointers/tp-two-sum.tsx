import {Rect, Txt, Circle, makeScene2D, Line, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, easeInOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, TERMINAL_BORDER, CODE_FONT, TITLE_FONT, ORANGE, PURPLE} from '../../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const badge = createRef<Rect>();
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const difficulty = createRef<Rect>();

  // Header
  view.add(
    <Rect ref={badge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}>
      <Txt text={'#1'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} />
    </Rect>
  );
  view.add(<Txt ref={title} text={'Two Sum II'} fill={GREEN} fontFamily={CODE_FONT} fontSize={90} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Sorted Array'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={44} y={-490} opacity={0} />);
  view.add(
    <Rect ref={difficulty} x={0} y={-430} width={140} height={44} radius={22} fill={GREEN} opacity={0} scale={0}>
      <Txt text={'Easy'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} />
    </Rect>
  );

  // Array visualization
  const nums = [2, 7, 11, 15];
  const boxSize = 100;
  const startX = -((nums.length - 1) * (boxSize + 16)) / 2;
  const arrY = -200;
  const boxes = createRefArray<Rect>();
  const numTxts = createRefArray<Txt>();

  for (let i = 0; i < nums.length; i++) {
    const x = startX + i * (boxSize + 16);
    view.add(
      <Rect ref={boxes} x={x} y={arrY} width={boxSize} height={boxSize} radius={14} fill={TERMINAL_BG} stroke={'#30363d'} lineWidth={2} opacity={0} scale={0}>
        <Txt ref={numTxts} text={`${nums[i]}`} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={40} fontWeight={800} />
      </Rect>
    );
  }

  // Pointers
  const leftPtr = createRef<Node>();
  const rightPtr = createRef<Node>();
  view.add(
    <Node ref={leftPtr} x={startX} y={arrY + 85} opacity={0}>
      <Txt text={'L'} fill={GREEN} fontFamily={CODE_FONT} fontSize={36} fontWeight={800} />
      <Txt text={'↑'} fill={GREEN} fontFamily={CODE_FONT} fontSize={30} y={-35} />
    </Node>
  );
  view.add(
    <Node ref={rightPtr} x={startX + 3 * (boxSize + 16)} y={arrY + 85} opacity={0}>
      <Txt text={'R'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={36} fontWeight={800} />
      <Txt text={'↑'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={30} y={-35} />
    </Node>
  );

  // Sum display
  const sumTxt = createRef<Txt>();
  view.add(<Txt ref={sumTxt} text={''} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={36} fontWeight={800} y={arrY + 150} opacity={0} />);

  // Code block
  const codeBox = createRef<Rect>();
  const codeLines = createRefArray<Txt>();
  view.add(
    <Rect ref={codeBox} width={900} height={380} y={250} radius={16} fill={TERMINAL_BG} stroke={TERMINAL_BORDER} lineWidth={2} opacity={0} scale={0.8} clip>
      <Rect width={900} height={44} y={-168} fill={'#21262d'}>
        <Txt text={'Python'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={18} />
      </Rect>
      <Txt ref={codeLines} text={''} fill={PURPLE} fontFamily={CODE_FONT} fontSize={22} x={-410} y={-110} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} x={-410} y={-75} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} x={-410} y={-40} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={22} x={-410} y={-5} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} x={-410} y={30} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} x={-410} y={65} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} x={-410} y={100} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} x={-410} y={135} offsetX={-1} opacity={0} />
    </Rect>
  );

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'O(n) time, O(1) space\nTwo pointers converge to target 🎯'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={600} textAlign={'center'} lineHeight={46} opacity={0} />);

  // === ANIMATION ===
  yield* all(badge().opacity(1, 0.3), badge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* all(difficulty().opacity(1, 0.3), difficulty().scale(1, 0.4, easeOutCubic));
  yield* waitFor(0.2);

  // Show array
  for (let i = 0; i < nums.length; i++) {
    yield* all(boxes[i].opacity(1, 0.15), boxes[i].scale(1, 0.25, easeOutCubic));
  }
  yield* waitFor(0.2);

  // Show pointers
  yield* all(leftPtr().opacity(1, 0.3), rightPtr().opacity(1, 0.3));
  yield* waitFor(0.2);

  // Step 1: L=0, R=3 → 2+15=17 > 9 → move R
  yield* all(sumTxt().opacity(1, 0.2), sumTxt().text('2 + 15 = 17 > 9 → move R', 0.4));
  yield* waitFor(0.5);
  yield* rightPtr().x(startX + 2 * (boxSize + 16), 0.4, easeInOutCubic);

  // Step 2: L=0, R=2 → 2+11=13 > 9 → move R
  yield* sumTxt().text('2 + 11 = 13 > 9 → move R', 0.4);
  yield* waitFor(0.5);
  yield* rightPtr().x(startX + 1 * (boxSize + 16), 0.4, easeInOutCubic);

  // Step 3: L=0, R=1 → 2+7=9 ✓
  yield* sumTxt().text('2 + 7 = 9 ✓ Found!', 0.4);
  yield* sumTxt().fill(GREEN, 0.3);
  yield* all(
    boxes[0].stroke(GREEN, 0.3), boxes[0].lineWidth(4, 0.3),
    boxes[1].stroke(GREEN, 0.3), boxes[1].lineWidth(4, 0.3),
  );
  yield* waitFor(0.5);

  // Show code
  yield* all(codeBox().opacity(1, 0.4), codeBox().scale(1, 0.5, easeOutCubic));
  yield* all(codeLines[0].opacity(1, 0.2), codeLines[0].text('def twoSum(nums, target):', 0.3));
  yield* all(codeLines[1].opacity(1, 0.2), codeLines[1].text('    l, r = 0, len(nums) - 1', 0.3));
  yield* all(codeLines[2].opacity(1, 0.2), codeLines[2].text('    while l < r:', 0.3));
  yield* all(codeLines[3].opacity(1, 0.2), codeLines[3].text('        s = nums[l] + nums[r]', 0.3));
  yield* all(codeLines[4].opacity(1, 0.2), codeLines[4].text('        if s == target:', 0.3));
  yield* all(codeLines[5].opacity(1, 0.2), codeLines[5].text('            return [l+1, r+1]', 0.3));
  yield* all(codeLines[6].opacity(1, 0.2), codeLines[6].text('        elif s < target: l += 1', 0.3));
  yield* all(codeLines[7].opacity(1, 0.2), codeLines[7].text('        else: r -= 1', 0.3));

  yield* tip().opacity(1, 0.5);
  yield* waitFor(2);
});
