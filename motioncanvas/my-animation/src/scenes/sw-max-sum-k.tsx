import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, easeInOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, TERMINAL_BORDER, CODE_FONT, TITLE_FONT, ORANGE, PURPLE} from '../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const badge = createRef<Rect>();
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const difficulty = createRef<Rect>();

  view.add(<Rect ref={badge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}><Txt text={'#5'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} /></Rect>);
  view.add(<Txt ref={title} text={'Max Sum K'} fill={GREEN} fontFamily={CODE_FONT} fontSize={95} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Fixed-Size Window'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={44} y={-490} opacity={0} />);
  view.add(<Rect ref={difficulty} x={0} y={-430} width={140} height={44} radius={22} fill={GREEN} opacity={0} scale={0}><Txt text={'Easy'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} /></Rect>);

  // Array: [2, 1, 5, 1, 3, 2], k=3
  const nums = [2, 1, 5, 1, 3, 2];
  const boxSize = 85;
  const gap = 12;
  const startX = -((nums.length - 1) * (boxSize + gap)) / 2;
  const arrY = -200;
  const boxes = createRefArray<Rect>();

  for (let i = 0; i < nums.length; i++) {
    view.add(
      <Rect ref={boxes} x={startX + i * (boxSize + gap)} y={arrY} width={boxSize} height={boxSize} radius={14} fill={TERMINAL_BG} stroke={'#30363d'} lineWidth={2} opacity={0} scale={0}>
        <Txt text={`${nums[i]}`} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={40} fontWeight={800} />
      </Rect>
    );
  }

  const kLabel = createRef<Txt>();
  view.add(<Txt ref={kLabel} text={'k = 3'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={32} fontWeight={700} y={arrY - 70} opacity={0} />);

  // Window highlight
  const window = createRef<Rect>();
  const step = boxSize + gap;
  view.add(<Rect ref={window} x={startX + step} y={arrY} width={step * 2 + boxSize + 8} height={boxSize + 16} radius={16} stroke={ACCENT_COLOR} lineWidth={4} opacity={0} />);

  const statusTxt = createRef<Txt>();
  view.add(<Txt ref={statusTxt} text={''} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={32} fontWeight={800} y={arrY + 100} opacity={0} />);

  // Code block
  const codeBox = createRef<Rect>();
  const codeLines = createRefArray<Txt>();
  view.add(
    <Rect ref={codeBox} width={900} height={360} y={280} radius={16} fill={TERMINAL_BG} stroke={TERMINAL_BORDER} lineWidth={2} opacity={0} scale={0.8} clip>
      <Rect width={900} height={44} y={-158} fill={'#21262d'}><Txt text={'Python'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={18} /></Rect>
      <Txt ref={codeLines} text={''} fill={PURPLE} fontFamily={CODE_FONT} fontSize={22} x={-410} y={-100} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} x={-410} y={-65} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} x={-410} y={-30} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={22} x={-410} y={5} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} x={-410} y={40} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} x={-410} y={75} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} x={-410} y={110} offsetX={-1} opacity={0} />
    </Rect>
  );

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'Add right, subtract left\nSlide the window in O(n) 🪟'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={600} textAlign={'center'} lineHeight={46} opacity={0} />);

  // === ANIMATION ===
  yield* all(badge().opacity(1, 0.3), badge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* all(difficulty().opacity(1, 0.3), difficulty().scale(1, 0.4, easeOutCubic));
  yield* waitFor(0.2);

  yield* kLabel().opacity(1, 0.3);
  for (let i = 0; i < nums.length; i++) {
    yield* all(boxes[i].opacity(1, 0.1), boxes[i].scale(1, 0.2, easeOutCubic));
  }
  yield* statusTxt().opacity(1, 0.2);

  // Window 1: [2,1,5] = 8
  yield* window().opacity(1, 0.3);
  yield* window().x(startX + step, 0.3);
  yield* statusTxt().text('[2, 1, 5] = 8', 0.3);
  yield* all(boxes[0].stroke(ACCENT_COLOR, 0.2), boxes[1].stroke(ACCENT_COLOR, 0.2), boxes[2].stroke(ACCENT_COLOR, 0.2));
  yield* waitFor(0.4);

  // Slide: [1,5,1] = 7
  yield* all(
    window().x(startX + step * 2, 0.4, easeInOutCubic),
    boxes[0].stroke('#30363d', 0.2), boxes[0].opacity(0.5, 0.2),
    boxes[3].stroke(ACCENT_COLOR, 0.2),
  );
  yield* statusTxt().text('[1, 5, 1] = 7  (−2, +1)', 0.3);
  yield* waitFor(0.4);

  // Slide: [5,1,3] = 9 ★
  yield* all(
    window().x(startX + step * 3, 0.4, easeInOutCubic),
    boxes[1].stroke('#30363d', 0.2), boxes[1].opacity(0.5, 0.2),
    boxes[4].stroke(GREEN, 0.2),
  );
  yield* statusTxt().text('[5, 1, 3] = 9 ★ best!', 0.3);
  yield* statusTxt().fill(GREEN, 0.3);
  yield* waitFor(0.4);

  // Slide: [1,3,2] = 6
  yield* all(
    window().x(startX + step * 4, 0.4, easeInOutCubic),
    boxes[2].stroke('#30363d', 0.2), boxes[2].opacity(0.5, 0.2),
    boxes[5].stroke(ACCENT_COLOR, 0.2),
    statusTxt().fill(ACCENT_COLOR, 0.2),
  );
  yield* statusTxt().text('[1, 3, 2] = 6 → Answer: 9 ✅', 0.3);
  yield* statusTxt().fill(GREEN, 0.3);
  yield* waitFor(0.4);

  // Show code
  yield* all(codeBox().opacity(1, 0.4), codeBox().scale(1, 0.5, easeOutCubic));
  yield* all(codeLines[0].opacity(1, 0.15), codeLines[0].text('def maxSumK(nums, k):', 0.25));
  yield* all(codeLines[1].opacity(1, 0.15), codeLines[1].text('    window = sum(nums[:k])', 0.25));
  yield* all(codeLines[2].opacity(1, 0.15), codeLines[2].text('    best = window', 0.25));
  yield* all(codeLines[3].opacity(1, 0.15), codeLines[3].text('    for i in range(k, len(nums)):', 0.25));
  yield* all(codeLines[4].opacity(1, 0.15), codeLines[4].text('        window += nums[i] - nums[i-k]', 0.25));
  yield* all(codeLines[5].opacity(1, 0.15), codeLines[5].text('        best = max(best, window)', 0.25));
  yield* all(codeLines[6].opacity(1, 0.15), codeLines[6].text('    return best', 0.25));

  yield* tip().opacity(1, 0.5);
  yield* waitFor(2);
});
