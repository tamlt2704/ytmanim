import {Rect, Txt, makeScene2D, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, easeInOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, TERMINAL_BORDER, CODE_FONT, TITLE_FONT, ORANGE, PURPLE} from '../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const badge = createRef<Rect>();
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const difficulty = createRef<Rect>();

  view.add(<Rect ref={badge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}><Txt text={'#7'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} /></Rect>);
  view.add(<Txt ref={title} text={'Sort Colors'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={90} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Dutch National Flag'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={44} y={-490} opacity={0} />);
  view.add(<Rect ref={difficulty} x={0} y={-430} width={180} height={44} radius={22} fill={ORANGE} opacity={0} scale={0}><Txt text={'Medium'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} /></Rect>);

  // Array: [2, 0, 2, 1, 1, 0] → colors
  const nums = [2, 0, 2, 1, 1, 0];
  const colorMap: Record<number, string> = {0: RED, 1: TEXT_COLOR, 2: ACCENT_COLOR};
  const boxSize = 85;
  const gap = 12;
  const startX = -((nums.length - 1) * (boxSize + gap)) / 2;
  const arrY = -200;
  const boxes = createRefArray<Rect>();
  const numTxts = createRefArray<Txt>();

  for (let i = 0; i < nums.length; i++) {
    view.add(
      <Rect ref={boxes} x={startX + i * (boxSize + gap)} y={arrY} width={boxSize} height={boxSize} radius={14} fill={colorMap[nums[i]]} opacity={0} scale={0}>
        <Txt ref={numTxts} text={`${nums[i]}`} fill={'#fff'} fontFamily={CODE_FONT} fontSize={40} fontWeight={800} />
      </Rect>
    );
  }

  // Three pointers: lo, mid, hi
  const loPtr = createRef<Node>();
  const midPtr = createRef<Node>();
  const hiPtr = createRef<Node>();
  view.add(<Node ref={loPtr} x={startX} y={arrY + 80} opacity={0}><Txt text={'↑'} fill={RED} fontFamily={CODE_FONT} fontSize={26} y={-15} /><Txt text={'lo'} fill={RED} fontFamily={CODE_FONT} fontSize={26} fontWeight={800} y={12} /></Node>);
  view.add(<Node ref={midPtr} x={startX} y={arrY - 80} opacity={0}><Txt text={'mid'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={26} fontWeight={800} y={-15} /><Txt text={'↓'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={26} y={12} /></Node>);
  view.add(<Node ref={hiPtr} x={startX + 5 * (boxSize + gap)} y={arrY + 80} opacity={0}><Txt text={'↑'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={26} y={-15} /><Txt text={'hi'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={26} fontWeight={800} y={12} /></Node>);

  const statusTxt = createRef<Txt>();
  view.add(<Txt ref={statusTxt} text={''} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={30} fontWeight={800} y={arrY + 140} opacity={0} />);

  // Result
  const resultBoxes = createRefArray<Rect>();
  const sorted = [0, 0, 1, 1, 2, 2];
  for (let i = 0; i < sorted.length; i++) {
    view.add(
      <Rect ref={resultBoxes} x={startX + i * (boxSize + gap)} y={30} width={boxSize} height={boxSize} radius={14} fill={colorMap[sorted[i]]} opacity={0} scale={0}>
        <Txt text={`${sorted[i]}`} fill={'#fff'} fontFamily={CODE_FONT} fontSize={40} fontWeight={800} />
      </Rect>
    );
  }

  // Code block
  const codeBox = createRef<Rect>();
  const codeLines = createRefArray<Txt>();
  view.add(
    <Rect ref={codeBox} width={900} height={340} y={350} radius={16} fill={TERMINAL_BG} stroke={TERMINAL_BORDER} lineWidth={2} opacity={0} scale={0.8} clip>
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

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'3 pointers partition into 3 zones\nOne pass, O(n) time, O(1) space 🇳🇱'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={640} textAlign={'center'} lineHeight={46} opacity={0} />);

  // === ANIMATION ===
  yield* all(badge().opacity(1, 0.3), badge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* all(difficulty().opacity(1, 0.3), difficulty().scale(1, 0.4, easeOutCubic));
  yield* waitFor(0.2);

  for (let i = 0; i < nums.length; i++) {
    yield* all(boxes[i].opacity(1, 0.1), boxes[i].scale(1, 0.2, easeOutCubic));
  }
  yield* all(loPtr().opacity(1, 0.3), midPtr().opacity(1, 0.3), hiPtr().opacity(1, 0.3));
  yield* statusTxt().opacity(1, 0.2);

  // Explain zones
  yield* statusTxt().text('0s → left | 1s → middle | 2s → right', 0.4);
  yield* waitFor(0.5);

  // mid=0: nums[0]=2 → swap with hi, hi--
  yield* statusTxt().text('mid→2: swap with hi, hi--', 0.3);
  yield* waitFor(0.4);
  yield* hiPtr().x(startX + 4 * (boxSize + gap), 0.3, easeInOutCubic);

  // mid→0: swap with lo, lo++, mid++
  yield* statusTxt().text('mid→0: swap with lo, lo++ mid++', 0.3);
  yield* waitFor(0.4);
  yield* all(
    loPtr().x(startX + 1 * (boxSize + gap), 0.3, easeInOutCubic),
    midPtr().x(startX + 1 * (boxSize + gap), 0.3, easeInOutCubic),
  );

  // mid→1: just mid++
  yield* statusTxt().text('mid→1: already in place, mid++', 0.3);
  yield* midPtr().x(startX + 2 * (boxSize + gap), 0.3, easeInOutCubic);
  yield* waitFor(0.3);

  // Show sorted result
  yield* statusTxt().text('Sorted! ✅', 0.3);
  yield* statusTxt().fill(GREEN, 0.3);
  for (let i = 0; i < sorted.length; i++) {
    yield* all(resultBoxes[i].opacity(1, 0.1), resultBoxes[i].scale(1, 0.2, easeOutCubic));
  }
  yield* waitFor(0.3);

  // Show code
  yield* all(codeBox().opacity(1, 0.4), codeBox().scale(1, 0.5, easeOutCubic));
  yield* all(codeLines[0].opacity(1, 0.12), codeLines[0].text('def sortColors(nums):', 0.25));
  yield* all(codeLines[1].opacity(1, 0.12), codeLines[1].text('    lo, mid, hi = 0, 0, len(nums)-1', 0.25));
  yield* all(codeLines[2].opacity(1, 0.12), codeLines[2].text('    while mid <= hi:', 0.25));
  yield* all(codeLines[3].opacity(1, 0.12), codeLines[3].text('        if nums[mid] == 0:', 0.25));
  yield* all(codeLines[4].opacity(1, 0.12), codeLines[4].text('            nums[lo],nums[mid]=nums[mid],nums[lo]', 0.2));
  yield* all(codeLines[5].opacity(1, 0.12), codeLines[5].text('            lo += 1; mid += 1', 0.25));
  yield* all(codeLines[6].opacity(1, 0.12), codeLines[6].text('        elif nums[mid]==1: mid+=1', 0.25));

  yield* tip().opacity(1, 0.5);
  yield* waitFor(2);
});
