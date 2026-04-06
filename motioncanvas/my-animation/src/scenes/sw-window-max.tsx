import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, easeInOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, TERMINAL_BORDER, CODE_FONT, TITLE_FONT, ORANGE, PURPLE} from '../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const badge = createRef<Rect>();
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const difficulty = createRef<Rect>();

  view.add(<Rect ref={badge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}><Txt text={'#7'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} /></Rect>);
  view.add(<Txt ref={title} text={'Window Max'} fill={RED} fontFamily={CODE_FONT} fontSize={90} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Max in Each Window of Size k'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={38} y={-490} opacity={0} />);
  view.add(<Rect ref={difficulty} x={0} y={-430} width={140} height={44} radius={22} fill={RED} opacity={0} scale={0}><Txt text={'Hard'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} /></Rect>);

  // [1, 3, -1, -3, 5, 3, 6, 7], k=3
  const nums = [1, 3, -1, -3, 5, 3, 6, 7];
  const boxSize = 62;
  const gap = 8;
  const startX = -((nums.length - 1) * (boxSize + gap)) / 2;
  const arrY = -220;
  const boxes = createRefArray<Rect>();

  for (let i = 0; i < nums.length; i++) {
    view.add(
      <Rect ref={boxes} x={startX + i * (boxSize + gap)} y={arrY} width={boxSize} height={boxSize} radius={12} fill={TERMINAL_BG} stroke={'#30363d'} lineWidth={2} opacity={0} scale={0}>
        <Txt text={`${nums[i]}`} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={30} fontWeight={800} />
      </Rect>
    );
  }

  const kLabel = createRef<Txt>();
  view.add(<Txt ref={kLabel} text={'k = 3'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={30} fontWeight={700} y={arrY - 65} opacity={0} />);

  // Window
  const window = createRef<Rect>();
  const step = boxSize + gap;
  view.add(<Rect ref={window} x={startX + step} y={arrY} width={step * 2 + boxSize + 6} height={boxSize + 14} radius={14} stroke={ACCENT_COLOR} lineWidth={4} opacity={0} />);

  const statusTxt = createRef<Txt>();
  view.add(<Txt ref={statusTxt} text={''} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={30} fontWeight={800} y={arrY + 85} opacity={0} />);

  // Result row
  const resultLabel = createRef<Txt>();
  view.add(<Txt ref={resultLabel} text={'result:'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={24} x={-380} y={arrY + 140} opacity={0} />);
  const results = [3, 3, 5, 5, 6, 7];
  const resTxts = createRefArray<Txt>();
  for (let i = 0; i < results.length; i++) {
    view.add(<Txt ref={resTxts} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={28} fontWeight={800} x={-260 + i * 70} y={arrY + 140} opacity={0} />);
  }

  // Deque visualization
  const dequeTxt = createRef<Txt>();
  view.add(<Txt ref={dequeTxt} text={''} fill={ORANGE} fontFamily={CODE_FONT} fontSize={24} y={arrY + 180} opacity={0} />);

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
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={19} x={-410} y={146} offsetX={-1} opacity={0} />
    </Rect>
  );

  // === ANIMATION ===
  yield* all(badge().opacity(1, 0.3), badge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* all(difficulty().opacity(1, 0.3), difficulty().scale(1, 0.4, easeOutCubic));
  yield* waitFor(0.2);

  yield* kLabel().opacity(1, 0.3);
  for (let i = 0; i < nums.length; i++) {
    yield* all(boxes[i].opacity(1, 0.06), boxes[i].scale(1, 0.12, easeOutCubic));
  }
  yield* all(window().opacity(1, 0.3), statusTxt().opacity(1, 0.2), resultLabel().opacity(1, 0.2), dequeTxt().opacity(1, 0.2));

  // Window [1,3,-1] → max=3
  yield* window().x(startX + step, 0.3);
  yield* dequeTxt().text('deque: [3, -1] (decreasing)', 0.3);
  yield* statusTxt().text('[1, 3, -1] → max = 3', 0.3);
  yield* all(resTxts[0].opacity(1, 0.2), resTxts[0].text('3', 0.2));
  yield* waitFor(0.3);

  // Slide [3,-1,-3] → max=3
  yield* all(window().x(startX + step * 2, 0.3, easeInOutCubic), boxes[0].opacity(0.4, 0.2));
  yield* dequeTxt().text('deque: [3, -1, -3]', 0.2);
  yield* statusTxt().text('[3, -1, -3] → max = 3', 0.3);
  yield* all(resTxts[1].opacity(1, 0.2), resTxts[1].text('3', 0.2));
  yield* waitFor(0.3);

  // Slide [-1,-3,5] → max=5
  yield* all(window().x(startX + step * 3, 0.3, easeInOutCubic), boxes[1].opacity(0.4, 0.2));
  yield* dequeTxt().text('deque: [5] (5 clears all!)', 0.2);
  yield* statusTxt().text('[-1, -3, 5] → max = 5', 0.3);
  yield* all(resTxts[2].opacity(1, 0.2), resTxts[2].text('5', 0.2));
  yield* waitFor(0.3);

  // Slide [-3,5,3] → max=5
  yield* all(window().x(startX + step * 4, 0.3, easeInOutCubic), boxes[2].opacity(0.4, 0.2));
  yield* statusTxt().text('[-3, 5, 3] → max = 5', 0.3);
  yield* all(resTxts[3].opacity(1, 0.2), resTxts[3].text('5', 0.2));
  yield* waitFor(0.2);

  // Show remaining
  yield* all(window().x(startX + step * 5, 0.3, easeInOutCubic), boxes[3].opacity(0.4, 0.2));
  yield* all(resTxts[4].opacity(1, 0.2), resTxts[4].text('6', 0.2));
  yield* all(window().x(startX + step * 6, 0.3, easeInOutCubic), boxes[4].opacity(0.4, 0.2));
  yield* all(resTxts[5].opacity(1, 0.2), resTxts[5].text('7', 0.2));
  yield* statusTxt().text('Result: [3,3,5,5,6,7] ✅', 0.3);
  yield* statusTxt().fill(GREEN, 0.3);
  yield* waitFor(0.3);

  // Show code
  yield* all(codeBox().opacity(1, 0.4), codeBox().scale(1, 0.5, easeOutCubic));
  yield* all(codeLines[0].opacity(1, 0.1), codeLines[0].text('def maxSlidingWindow(nums, k):', 0.2));
  yield* all(codeLines[1].opacity(1, 0.1), codeLines[1].text('    dq = deque(); res = []', 0.2));
  yield* all(codeLines[2].opacity(1, 0.1), codeLines[2].text('    for i, n in enumerate(nums):', 0.2));
  yield* all(codeLines[3].opacity(1, 0.1), codeLines[3].text('        while dq and nums[dq[-1]] <= n:', 0.2));
  yield* all(codeLines[4].opacity(1, 0.1), codeLines[4].text('            dq.pop()', 0.2));
  yield* all(codeLines[5].opacity(1, 0.1), codeLines[5].text('        dq.append(i)', 0.2));
  yield* all(codeLines[6].opacity(1, 0.1), codeLines[6].text('        if dq[0] <= i - k: dq.popleft()', 0.2));
  yield* all(codeLines[7].opacity(1, 0.1), codeLines[7].text('        if i >= k - 1:', 0.2));
  yield* all(codeLines[8].opacity(1, 0.1), codeLines[8].text('            res.append(nums[dq[0]])', 0.2));

  yield* waitFor(2);
});
