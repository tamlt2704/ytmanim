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
  view.add(<Txt ref={title} text={'Longest Substr'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={78} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'No Repeating Chars'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={44} y={-490} opacity={0} />);
  view.add(<Rect ref={difficulty} x={0} y={-430} width={180} height={44} radius={22} fill={ORANGE} opacity={0} scale={0}><Txt text={'Medium'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} /></Rect>);

  // String visualization: "abcabcbb"
  const chars = ['a', 'b', 'c', 'a', 'b', 'c', 'b', 'b'];
  const boxSize = 70;
  const gap = 8;
  const startX = -((chars.length - 1) * (boxSize + gap)) / 2;
  const arrY = -200;
  const boxes = createRefArray<Rect>();

  for (let i = 0; i < chars.length; i++) {
    view.add(
      <Rect ref={boxes} x={startX + i * (boxSize + gap)} y={arrY} width={boxSize} height={boxSize} radius={12} fill={TERMINAL_BG} stroke={'#30363d'} lineWidth={2} opacity={0} scale={0}>
        <Txt text={chars[i]} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={36} fontWeight={800} />
      </Rect>
    );
  }

  // Window highlight
  const window = createRef<Rect>();
  view.add(<Rect ref={window} x={startX} y={arrY} width={boxSize + 8} height={boxSize + 16} radius={16} stroke={ACCENT_COLOR} lineWidth={4} opacity={0} />);

  const statusTxt = createRef<Txt>();
  view.add(<Txt ref={statusTxt} text={''} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={32} fontWeight={800} y={arrY + 100} opacity={0} />);

  const setTxt = createRef<Txt>();
  view.add(<Txt ref={setTxt} text={''} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={26} y={arrY + 145} opacity={0} />);

  // Code block
  const codeBox = createRef<Rect>();
  const codeLines = createRefArray<Txt>();
  view.add(
    <Rect ref={codeBox} width={900} height={360} y={310} radius={16} fill={TERMINAL_BG} stroke={TERMINAL_BORDER} lineWidth={2} opacity={0} scale={0.8} clip>
      <Rect width={900} height={44} y={-158} fill={'#21262d'}><Txt text={'Python'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={18} /></Rect>
      <Txt ref={codeLines} text={''} fill={PURPLE} fontFamily={CODE_FONT} fontSize={20} x={-410} y={-100} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={20} x={-410} y={-66} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={20} x={-410} y={-32} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={20} x={-410} y={2} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={20} x={-410} y={36} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={20} x={-410} y={70} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={20} x={-410} y={104} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={20} x={-410} y={138} offsetX={-1} opacity={0} />
    </Rect>
  );

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'Expand right, shrink left on duplicate\nHashSet tracks window chars 🪟'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={630} textAlign={'center'} lineHeight={46} opacity={0} />);

  // === ANIMATION ===
  yield* all(badge().opacity(1, 0.3), badge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* all(difficulty().opacity(1, 0.3), difficulty().scale(1, 0.4, easeOutCubic));
  yield* waitFor(0.2);

  for (let i = 0; i < chars.length; i++) {
    yield* all(boxes[i].opacity(1, 0.08), boxes[i].scale(1, 0.15, easeOutCubic));
  }
  yield* all(window().opacity(1, 0.3), statusTxt().opacity(1, 0.2), setTxt().opacity(1, 0.2));

  // Expand window: a, b, c → len=3
  yield* all(setTxt().text('set: {a}', 0.2), boxes[0].stroke(GREEN, 0.2));
  yield* waitFor(0.2);
  const step = boxSize + gap;
  yield* all(window().width(boxSize * 2 + gap + 8, 0.3), window().x(startX + step / 2, 0.3), setTxt().text('set: {a, b}', 0.2), boxes[1].stroke(GREEN, 0.2));
  yield* waitFor(0.2);
  yield* all(window().width(boxSize * 3 + gap * 2 + 8, 0.3), window().x(startX + step, 0.3), setTxt().text('set: {a, b, c}', 0.2), boxes[2].stroke(GREEN, 0.2));
  yield* statusTxt().text('window = "abc" → len 3', 0.3);
  yield* waitFor(0.4);

  // Hit duplicate 'a' at index 3 → shrink from left
  yield* statusTxt().text("'a' duplicate! shrink left →", 0.3);
  yield* statusTxt().fill(RED, 0.2);
  yield* boxes[3].stroke(RED, 0.2);
  yield* waitFor(0.3);

  // Shrink: remove 'a', window is now [1..3] = "bca"
  yield* all(
    boxes[0].stroke('#30363d', 0.2), boxes[0].opacity(0.4, 0.2),
    window().x(startX + step * 2, 0.3), window().width(boxSize * 3 + gap * 2 + 8, 0.3),
    boxes[3].stroke(GREEN, 0.2),
    setTxt().text('set: {b, c, a}', 0.2),
    statusTxt().fill(ACCENT_COLOR, 0.2),
  );
  yield* statusTxt().text('window = "bca" → still 3', 0.3);
  yield* waitFor(0.4);

  // Best = 3
  yield* statusTxt().text('Answer: 3 ("abc") ✅', 0.3);
  yield* statusTxt().fill(GREEN, 0.3);
  yield* waitFor(0.4);

  // Show code
  yield* all(codeBox().opacity(1, 0.4), codeBox().scale(1, 0.5, easeOutCubic));
  yield* all(codeLines[0].opacity(1, 0.12), codeLines[0].text('def lengthOfLongestSubstring(s):', 0.25));
  yield* all(codeLines[1].opacity(1, 0.12), codeLines[1].text('    seen = set(); l = res = 0', 0.25));
  yield* all(codeLines[2].opacity(1, 0.12), codeLines[2].text('    for r in range(len(s)):', 0.25));
  yield* all(codeLines[3].opacity(1, 0.12), codeLines[3].text('        while s[r] in seen:', 0.25));
  yield* all(codeLines[4].opacity(1, 0.12), codeLines[4].text('            seen.remove(s[l])', 0.25));
  yield* all(codeLines[5].opacity(1, 0.12), codeLines[5].text('            l += 1', 0.25));
  yield* all(codeLines[6].opacity(1, 0.12), codeLines[6].text('        seen.add(s[r])', 0.25));
  yield* all(codeLines[7].opacity(1, 0.12), codeLines[7].text('        res = max(res, r - l + 1)', 0.25));

  yield* tip().opacity(1, 0.5);
  yield* waitFor(2);
});
