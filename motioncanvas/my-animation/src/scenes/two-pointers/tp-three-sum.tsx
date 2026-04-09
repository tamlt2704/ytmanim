import {Rect, Txt, makeScene2D, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, easeInOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, TERMINAL_BORDER, CODE_FONT, TITLE_FONT, ORANGE, PURPLE} from '../../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const badge = createRef<Rect>();
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const difficulty = createRef<Rect>();

  view.add(<Rect ref={badge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}><Txt text={'#3'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} /></Rect>);
  view.add(<Txt ref={title} text={'3Sum'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={110} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Find Triplets = 0'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={44} y={-490} opacity={0} />);
  view.add(<Rect ref={difficulty} x={0} y={-430} width={180} height={44} radius={22} fill={ORANGE} opacity={0} scale={0}><Txt text={'Medium'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} /></Rect>);

  // Array: [-1, 0, 1, 2, -1, -4] sorted → [-4, -1, -1, 0, 1, 2]
  const nums = [-4, -1, -1, 0, 1, 2];
  const boxSize = 75;
  const gap = 8;
  const startX = -((nums.length - 1) * (boxSize + gap)) / 2;
  const arrY = -220;
  const boxes = createRefArray<Rect>();

  for (let i = 0; i < nums.length; i++) {
    view.add(
      <Rect ref={boxes} x={startX + i * (boxSize + gap)} y={arrY} width={boxSize} height={boxSize} radius={12} fill={TERMINAL_BG} stroke={'#30363d'} lineWidth={2} opacity={0} scale={0}>
        <Txt text={`${nums[i]}`} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={34} fontWeight={800} />
      </Rect>
    );
  }

  // Pointers: i (fixed), L, R
  const iPtr = createRef<Node>();
  const leftPtr = createRef<Node>();
  const rightPtr = createRef<Node>();
  view.add(<Node ref={iPtr} x={startX + 1 * (boxSize + gap)} y={arrY - 65} opacity={0}><Txt text={'i'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={30} fontWeight={800} /><Txt text={'↓'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={26} y={25} /></Node>);
  view.add(<Node ref={leftPtr} x={startX + 2 * (boxSize + gap)} y={arrY + 75} opacity={0}><Txt text={'↑'} fill={GREEN} fontFamily={CODE_FONT} fontSize={26} y={-15} /><Txt text={'L'} fill={GREEN} fontFamily={CODE_FONT} fontSize={30} fontWeight={800} y={15} /></Node>);
  view.add(<Node ref={rightPtr} x={startX + 5 * (boxSize + gap)} y={arrY + 75} opacity={0}><Txt text={'↑'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={26} y={-15} /><Txt text={'R'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={30} fontWeight={800} y={15} /></Node>);

  const sumTxt = createRef<Txt>();
  view.add(<Txt ref={sumTxt} text={''} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={32} fontWeight={800} y={arrY + 140} opacity={0} />);

  // Code block
  const codeBox = createRef<Rect>();
  const codeLines = createRefArray<Txt>();
  view.add(
    <Rect ref={codeBox} width={900} height={380} y={260} radius={16} fill={TERMINAL_BG} stroke={TERMINAL_BORDER} lineWidth={2} opacity={0} scale={0.8} clip>
      <Rect width={900} height={44} y={-168} fill={'#21262d'}><Txt text={'Python'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={18} /></Rect>
      <Txt ref={codeLines} text={''} fill={PURPLE} fontFamily={CODE_FONT} fontSize={20} x={-410} y={-110} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={20} x={-410} y={-78} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={20} x={-410} y={-46} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={20} x={-410} y={-14} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={20} x={-410} y={18} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={20} x={-410} y={50} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={20} x={-410} y={82} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={20} x={-410} y={114} offsetX={-1} opacity={0} />
    </Rect>
  );

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'Sort + fix one + two-pointer scan\nO(n²) time, skip duplicates 🎯'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={600} textAlign={'center'} lineHeight={46} opacity={0} />);

  // === ANIMATION ===
  yield* all(badge().opacity(1, 0.3), badge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* all(difficulty().opacity(1, 0.3), difficulty().scale(1, 0.4, easeOutCubic));
  yield* waitFor(0.2);

  for (let i = 0; i < nums.length; i++) {
    yield* all(boxes[i].opacity(1, 0.1), boxes[i].scale(1, 0.2, easeOutCubic));
  }
  yield* all(iPtr().opacity(1, 0.3), leftPtr().opacity(1, 0.3), rightPtr().opacity(1, 0.3));
  yield* sumTxt().opacity(1, 0.2);

  // i=1 (-1), L=2 (-1), R=5 (2) → -1+-1+2=0 ✓
  yield* sumTxt().text('-1 + (-1) + 2 = 0 ✓', 0.4);
  yield* sumTxt().fill(GREEN, 0.3);
  yield* all(boxes[1].stroke(GREEN, 0.3), boxes[2].stroke(GREEN, 0.3), boxes[5].stroke(GREEN, 0.3));
  yield* waitFor(0.5);

  // Move L, R inward
  yield* all(
    leftPtr().x(startX + 3 * (boxSize + gap), 0.3, easeInOutCubic),
    rightPtr().x(startX + 4 * (boxSize + gap), 0.3, easeInOutCubic),
    sumTxt().fill(ACCENT_COLOR, 0.2),
  );
  yield* sumTxt().text('-1 + 0 + 1 = 0 ✓', 0.4);
  yield* sumTxt().fill(GREEN, 0.3);
  yield* all(boxes[3].stroke(GREEN, 0.3), boxes[4].stroke(GREEN, 0.3));
  yield* waitFor(0.5);

  // Show code
  yield* all(codeBox().opacity(1, 0.4), codeBox().scale(1, 0.5, easeOutCubic));
  yield* all(codeLines[0].opacity(1, 0.15), codeLines[0].text('def threeSum(nums):', 0.3));
  yield* all(codeLines[1].opacity(1, 0.15), codeLines[1].text('    nums.sort(); res = []', 0.3));
  yield* all(codeLines[2].opacity(1, 0.15), codeLines[2].text('    for i in range(len(nums) - 2):', 0.3));
  yield* all(codeLines[3].opacity(1, 0.15), codeLines[3].text('        if i > 0 and nums[i]==nums[i-1]: continue', 0.25));
  yield* all(codeLines[4].opacity(1, 0.15), codeLines[4].text('        l, r = i+1, len(nums)-1', 0.3));
  yield* all(codeLines[5].opacity(1, 0.15), codeLines[5].text('        while l < r:', 0.3));
  yield* all(codeLines[6].opacity(1, 0.15), codeLines[6].text('            s = nums[i]+nums[l]+nums[r]', 0.3));
  yield* all(codeLines[7].opacity(1, 0.15), codeLines[7].text('            # if s==0: add, elif s<0: l++ else r--', 0.25));

  yield* tip().opacity(1, 0.5);
  yield* waitFor(2);
});
