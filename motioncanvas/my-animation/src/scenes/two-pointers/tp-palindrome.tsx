import {Rect, Txt, makeScene2D, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, easeInOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, TERMINAL_BORDER, CODE_FONT, TITLE_FONT, ORANGE, PURPLE} from '../../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const badge = createRef<Rect>();
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const difficulty = createRef<Rect>();

  view.add(<Rect ref={badge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}><Txt text={'#2'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} /></Rect>);
  view.add(<Txt ref={title} text={'Valid Palindrome'} fill={GREEN} fontFamily={CODE_FONT} fontSize={72} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Check Both Ends'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={44} y={-490} opacity={0} />);
  view.add(<Rect ref={difficulty} x={0} y={-430} width={140} height={44} radius={22} fill={GREEN} opacity={0} scale={0}><Txt text={'Easy'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} /></Rect>);

  // Array visualization: "racecar"
  const chars = ['r', 'a', 'c', 'e', 'c', 'a', 'r'];
  const boxSize = 80;
  const gap = 10;
  const startX = -((chars.length - 1) * (boxSize + gap)) / 2;
  const arrY = -200;
  const boxes = createRefArray<Rect>();
  const charTxts = createRefArray<Txt>();

  for (let i = 0; i < chars.length; i++) {
    view.add(
      <Rect ref={boxes} x={startX + i * (boxSize + gap)} y={arrY} width={boxSize} height={boxSize} radius={12} fill={TERMINAL_BG} stroke={'#30363d'} lineWidth={2} opacity={0} scale={0}>
        <Txt ref={charTxts} text={chars[i]} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={40} fontWeight={800} />
      </Rect>
    );
  }

  const leftPtr = createRef<Node>();
  const rightPtr = createRef<Node>();
  view.add(<Node ref={leftPtr} x={startX} y={arrY + 75} opacity={0}><Txt text={'↑'} fill={GREEN} fontFamily={CODE_FONT} fontSize={30} y={-15} /><Txt text={'L'} fill={GREEN} fontFamily={CODE_FONT} fontSize={32} fontWeight={800} y={15} /></Node>);
  view.add(<Node ref={rightPtr} x={startX + 6 * (boxSize + gap)} y={arrY + 75} opacity={0}><Txt text={'↑'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={30} y={-15} /><Txt text={'R'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={32} fontWeight={800} y={15} /></Node>);

  const matchTxt = createRef<Txt>();
  view.add(<Txt ref={matchTxt} text={''} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={34} fontWeight={800} y={arrY + 140} opacity={0} />);

  // Code block
  const codeBox = createRef<Rect>();
  const codeLines = createRefArray<Txt>();
  view.add(
    <Rect ref={codeBox} width={900} height={340} y={260} radius={16} fill={TERMINAL_BG} stroke={TERMINAL_BORDER} lineWidth={2} opacity={0} scale={0.8} clip>
      <Rect width={900} height={44} y={-148} fill={'#21262d'}><Txt text={'Python'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={18} /></Rect>
      <Txt ref={codeLines} text={''} fill={PURPLE} fontFamily={CODE_FONT} fontSize={22} x={-410} y={-90} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} x={-410} y={-55} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} x={-410} y={-20} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={22} x={-410} y={15} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} x={-410} y={50} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} x={-410} y={85} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={22} x={-410} y={120} offsetX={-1} opacity={0} />
    </Rect>
  );

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'O(n) time — skip non-alphanumeric\nCompare from outside in 🪞'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={590} textAlign={'center'} lineHeight={46} opacity={0} />);

  // === ANIMATION ===
  yield* all(badge().opacity(1, 0.3), badge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* all(difficulty().opacity(1, 0.3), difficulty().scale(1, 0.4, easeOutCubic));
  yield* waitFor(0.2);

  for (let i = 0; i < chars.length; i++) {
    yield* all(boxes[i].opacity(1, 0.1), boxes[i].scale(1, 0.2, easeOutCubic));
  }
  yield* all(leftPtr().opacity(1, 0.3), rightPtr().opacity(1, 0.3));
  yield* matchTxt().opacity(1, 0.2);

  // Step 1: r == r ✓
  yield* matchTxt().text("'r' == 'r' ✓", 0.3);
  yield* all(boxes[0].stroke(GREEN, 0.3), boxes[6].stroke(GREEN, 0.3));
  yield* waitFor(0.4);
  yield* all(leftPtr().x(startX + 1 * (boxSize + gap), 0.3, easeInOutCubic), rightPtr().x(startX + 5 * (boxSize + gap), 0.3, easeInOutCubic));

  // Step 2: a == a ✓
  yield* matchTxt().text("'a' == 'a' ✓", 0.3);
  yield* all(boxes[1].stroke(GREEN, 0.3), boxes[5].stroke(GREEN, 0.3));
  yield* waitFor(0.4);
  yield* all(leftPtr().x(startX + 2 * (boxSize + gap), 0.3, easeInOutCubic), rightPtr().x(startX + 4 * (boxSize + gap), 0.3, easeInOutCubic));

  // Step 3: c == c ✓
  yield* matchTxt().text("'c' == 'c' ✓", 0.3);
  yield* all(boxes[2].stroke(GREEN, 0.3), boxes[4].stroke(GREEN, 0.3));
  yield* waitFor(0.4);

  // Pointers meet → palindrome!
  yield* matchTxt().text('Palindrome! ✅', 0.3);
  yield* matchTxt().fill(GREEN, 0.3);
  yield* boxes[3].stroke(GREEN, 0.3);
  yield* waitFor(0.4);

  // Show code
  yield* all(codeBox().opacity(1, 0.4), codeBox().scale(1, 0.5, easeOutCubic));
  yield* all(codeLines[0].opacity(1, 0.15), codeLines[0].text('def isPalindrome(s):', 0.3));
  yield* all(codeLines[1].opacity(1, 0.15), codeLines[1].text('    s = [c.lower() for c in s if c.isalnum()]', 0.3));
  yield* all(codeLines[2].opacity(1, 0.15), codeLines[2].text('    l, r = 0, len(s) - 1', 0.3));
  yield* all(codeLines[3].opacity(1, 0.15), codeLines[3].text('    while l < r:', 0.3));
  yield* all(codeLines[4].opacity(1, 0.15), codeLines[4].text('        if s[l] != s[r]: return False', 0.3));
  yield* all(codeLines[5].opacity(1, 0.15), codeLines[5].text('        l += 1; r -= 1', 0.3));
  yield* all(codeLines[6].opacity(1, 0.15), codeLines[6].text('    return True', 0.3));

  yield* tip().opacity(1, 0.5);
  yield* waitFor(2);
});
