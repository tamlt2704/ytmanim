import {Rect, Txt, makeScene2D, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, easeInOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, TERMINAL_BORDER, CODE_FONT, TITLE_FONT, ORANGE, PURPLE} from '../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const badge = createRef<Rect>();
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const difficulty = createRef<Rect>();

  view.add(<Rect ref={badge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}><Txt text={'#6'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} /></Rect>);
  view.add(<Txt ref={title} text={'Move Zeroes'} fill={GREEN} fontFamily={CODE_FONT} fontSize={90} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Same-Direction Pointers'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={44} y={-490} opacity={0} />);
  view.add(<Rect ref={difficulty} x={0} y={-430} width={140} height={44} radius={22} fill={GREEN} opacity={0} scale={0}><Txt text={'Easy'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} /></Rect>);

  // Array: [0, 1, 0, 3, 12]
  const nums = [0, 1, 0, 3, 12];
  const boxSize = 90;
  const gap = 12;
  const startX = -((nums.length - 1) * (boxSize + gap)) / 2;
  const arrY = -200;
  const boxes = createRefArray<Rect>();
  const numTxts = createRefArray<Txt>();

  for (let i = 0; i < nums.length; i++) {
    const col = nums[i] === 0 ? '#8b949e' : TEXT_COLOR;
    view.add(
      <Rect ref={boxes} x={startX + i * (boxSize + gap)} y={arrY} width={boxSize} height={boxSize} radius={14} fill={TERMINAL_BG} stroke={'#30363d'} lineWidth={2} opacity={0} scale={0}>
        <Txt ref={numTxts} text={`${nums[i]}`} fill={col} fontFamily={CODE_FONT} fontSize={40} fontWeight={800} />
      </Rect>
    );
  }

  // Slow (write) and Fast (read) pointers
  const slowPtr = createRef<Node>();
  const fastPtr = createRef<Node>();
  view.add(<Node ref={slowPtr} x={startX} y={arrY + 80} opacity={0}><Txt text={'↑'} fill={GREEN} fontFamily={CODE_FONT} fontSize={28} y={-15} /><Txt text={'slow'} fill={GREEN} fontFamily={CODE_FONT} fontSize={26} fontWeight={800} y={15} /></Node>);
  view.add(<Node ref={fastPtr} x={startX} y={arrY - 80} opacity={0}><Txt text={'fast'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={26} fontWeight={800} y={-15} /><Txt text={'↓'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={28} y={12} /></Node>);

  const statusTxt = createRef<Txt>();
  view.add(<Txt ref={statusTxt} text={''} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={32} fontWeight={800} y={arrY + 140} opacity={0} />);

  // Result row
  const resultLabel = createRef<Txt>();
  const resultBoxes = createRefArray<Rect>();
  view.add(<Txt ref={resultLabel} text={'Result:'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} x={startX - 100} y={30} opacity={0} />);
  const result = [1, 3, 12, 0, 0];
  for (let i = 0; i < result.length; i++) {
    const col = result[i] === 0 ? '#8b949e' : GREEN;
    view.add(
      <Rect ref={resultBoxes} x={startX + i * (boxSize + gap)} y={30} width={boxSize} height={boxSize} radius={14} fill={TERMINAL_BG} stroke={col} lineWidth={2} opacity={0} scale={0}>
        <Txt text={`${result[i]}`} fill={col} fontFamily={CODE_FONT} fontSize={40} fontWeight={800} />
      </Rect>
    );
  }

  // Code block
  const codeBox = createRef<Rect>();
  const codeLines = createRefArray<Txt>();
  view.add(
    <Rect ref={codeBox} width={900} height={300} y={350} radius={16} fill={TERMINAL_BG} stroke={TERMINAL_BORDER} lineWidth={2} opacity={0} scale={0.8} clip>
      <Rect width={900} height={44} y={-128} fill={'#21262d'}><Txt text={'Python'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={18} /></Rect>
      <Txt ref={codeLines} text={''} fill={PURPLE} fontFamily={CODE_FONT} fontSize={22} x={-410} y={-70} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} x={-410} y={-35} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={22} x={-410} y={0} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} x={-410} y={35} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} x={-410} y={70} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} x={-410} y={105} offsetX={-1} opacity={0} />
    </Rect>
  );

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'O(n) in-place — slow writes,\nfast reads non-zero values 🏃'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={620} textAlign={'center'} lineHeight={46} opacity={0} />);

  // === ANIMATION ===
  yield* all(badge().opacity(1, 0.3), badge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* all(difficulty().opacity(1, 0.3), difficulty().scale(1, 0.4, easeOutCubic));
  yield* waitFor(0.2);

  for (let i = 0; i < nums.length; i++) {
    yield* all(boxes[i].opacity(1, 0.1), boxes[i].scale(1, 0.2, easeOutCubic));
  }
  yield* all(slowPtr().opacity(1, 0.3), fastPtr().opacity(1, 0.3));
  yield* statusTxt().opacity(1, 0.2);

  // fast=0: nums[0]=0, skip
  yield* statusTxt().text('fast→0: skip zero', 0.3);
  yield* fastPtr().x(startX + 1 * (boxSize + gap), 0.3, easeInOutCubic);
  yield* waitFor(0.3);

  // fast=1: nums[1]=1≠0, swap → slow moves
  yield* statusTxt().text('fast→1: non-zero! swap & advance slow', 0.3);
  yield* all(numTxts[0].text('1', 0.2), numTxts[1].text('0', 0.2), numTxts[0].fill(TEXT_COLOR, 0.2), numTxts[1].fill('#8b949e', 0.2));
  yield* slowPtr().x(startX + 1 * (boxSize + gap), 0.3, easeInOutCubic);
  yield* fastPtr().x(startX + 2 * (boxSize + gap), 0.3, easeInOutCubic);
  yield* waitFor(0.3);

  // fast=2: skip zero
  yield* statusTxt().text('fast→0: skip', 0.3);
  yield* fastPtr().x(startX + 3 * (boxSize + gap), 0.3, easeInOutCubic);

  // fast=3: swap
  yield* statusTxt().text('fast→3: swap!', 0.3);
  yield* all(numTxts[1].text('3', 0.2), numTxts[3].text('0', 0.2), numTxts[1].fill(TEXT_COLOR, 0.2), numTxts[3].fill('#8b949e', 0.2));
  yield* slowPtr().x(startX + 2 * (boxSize + gap), 0.3, easeInOutCubic);
  yield* fastPtr().x(startX + 4 * (boxSize + gap), 0.3, easeInOutCubic);
  yield* waitFor(0.2);

  // Show result
  yield* resultLabel().opacity(1, 0.3);
  for (let i = 0; i < result.length; i++) {
    yield* all(resultBoxes[i].opacity(1, 0.1), resultBoxes[i].scale(1, 0.2, easeOutCubic));
  }
  yield* statusTxt().text('[1, 3, 12, 0, 0] ✅', 0.3);
  yield* statusTxt().fill(GREEN, 0.3);
  yield* waitFor(0.3);

  // Show code
  yield* all(codeBox().opacity(1, 0.4), codeBox().scale(1, 0.5, easeOutCubic));
  yield* all(codeLines[0].opacity(1, 0.15), codeLines[0].text('def moveZeroes(nums):', 0.25));
  yield* all(codeLines[1].opacity(1, 0.15), codeLines[1].text('    slow = 0', 0.25));
  yield* all(codeLines[2].opacity(1, 0.15), codeLines[2].text('    for fast in range(len(nums)):', 0.25));
  yield* all(codeLines[3].opacity(1, 0.15), codeLines[3].text('        if nums[fast] != 0:', 0.25));
  yield* all(codeLines[4].opacity(1, 0.15), codeLines[4].text('            nums[slow],nums[fast]=nums[fast],nums[slow]', 0.2));
  yield* all(codeLines[5].opacity(1, 0.15), codeLines[5].text('            slow += 1', 0.25));

  yield* tip().opacity(1, 0.5);
  yield* waitFor(2);
});
