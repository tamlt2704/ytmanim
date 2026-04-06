import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, easeInOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, TERMINAL_BORDER, CODE_FONT, TITLE_FONT, ORANGE, PURPLE} from '../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const badge = createRef<Rect>();
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const difficulty = createRef<Rect>();

  view.add(<Rect ref={badge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}><Txt text={'#6'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} /></Rect>);
  view.add(<Txt ref={title} text={'Permutation'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={88} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Is s1 a Permutation in s2?'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={40} y={-490} opacity={0} />);
  view.add(<Rect ref={difficulty} x={0} y={-430} width={180} height={44} radius={22} fill={ORANGE} opacity={0} scale={0}><Txt text={'Medium'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} /></Rect>);

  // s1 = "ab", s2 = "eidbaooo"
  const s1Label = createRef<Txt>();
  view.add(<Txt ref={s1Label} text={'s1 = "ab"'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={30} fontWeight={700} y={-350} opacity={0} />);

  const chars = ['e', 'i', 'd', 'b', 'a', 'o', 'o', 'o'];
  const boxSize = 65;
  const gap = 8;
  const startX = -((chars.length - 1) * (boxSize + gap)) / 2;
  const arrY = -220;
  const boxes = createRefArray<Rect>();

  for (let i = 0; i < chars.length; i++) {
    const highlight = chars[i] === 'a' || chars[i] === 'b';
    view.add(
      <Rect ref={boxes} x={startX + i * (boxSize + gap)} y={arrY} width={boxSize} height={boxSize} radius={12} fill={TERMINAL_BG} stroke={'#30363d'} lineWidth={2} opacity={0} scale={0}>
        <Txt text={chars[i]} fill={highlight ? ACCENT_COLOR : TEXT_COLOR} fontFamily={CODE_FONT} fontSize={34} fontWeight={800} />
      </Rect>
    );
  }

  // Window (size = len(s1) = 2)
  const window = createRef<Rect>();
  const step = boxSize + gap;
  view.add(<Rect ref={window} x={startX + step / 2} y={arrY} width={step + boxSize + 6} height={boxSize + 14} radius={14} stroke={ACCENT_COLOR} lineWidth={4} opacity={0} />);

  const statusTxt = createRef<Txt>();
  view.add(<Txt ref={statusTxt} text={''} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={30} fontWeight={800} y={arrY + 90} opacity={0} />);

  const countTxt = createRef<Txt>();
  view.add(<Txt ref={countTxt} text={''} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={24} y={arrY + 130} opacity={0} />);

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
  view.add(<Txt ref={tip} text={'Fixed window = len(s1)\nCompare char frequency counts 🔢'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={630} textAlign={'center'} lineHeight={46} opacity={0} />);

  // === ANIMATION ===
  yield* all(badge().opacity(1, 0.3), badge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* all(difficulty().opacity(1, 0.3), difficulty().scale(1, 0.4, easeOutCubic));
  yield* waitFor(0.2);

  yield* s1Label().opacity(1, 0.3);
  for (let i = 0; i < chars.length; i++) {
    yield* all(boxes[i].opacity(1, 0.06), boxes[i].scale(1, 0.12, easeOutCubic));
  }
  yield* all(window().opacity(1, 0.3), statusTxt().opacity(1, 0.2), countTxt().opacity(1, 0.2));

  // Window [e,i] → no match
  yield* countTxt().text('need: {a:1,b:1} window: {e:1,i:1}', 0.3);
  yield* statusTxt().text('"ei" — no match', 0.3);
  yield* waitFor(0.3);

  // Slide [i,d]
  yield* all(window().x(startX + step * 1.5, 0.3, easeInOutCubic), boxes[0].opacity(0.4, 0.2));
  yield* countTxt().text('window: {i:1,d:1}', 0.2);
  yield* statusTxt().text('"id" — no match', 0.3);
  yield* waitFor(0.3);

  // Slide [d,b]
  yield* all(window().x(startX + step * 2.5, 0.3, easeInOutCubic), boxes[1].opacity(0.4, 0.2));
  yield* countTxt().text('window: {d:1,b:1}', 0.2);
  yield* statusTxt().text('"db" — close!', 0.3);
  yield* waitFor(0.3);

  // Slide [b,a] → MATCH!
  yield* all(window().x(startX + step * 3.5, 0.3, easeInOutCubic), boxes[2].opacity(0.4, 0.2));
  yield* countTxt().text('window: {b:1,a:1} == need!', 0.3);
  yield* statusTxt().text('"ba" — permutation found! ✅', 0.3);
  yield* statusTxt().fill(GREEN, 0.3);
  yield* all(boxes[3].stroke(GREEN, 0.2), boxes[4].stroke(GREEN, 0.2));
  yield* window().stroke(GREEN, 0.3);
  yield* waitFor(0.5);

  // Show code
  yield* all(codeBox().opacity(1, 0.4), codeBox().scale(1, 0.5, easeOutCubic));
  yield* all(codeLines[0].opacity(1, 0.12), codeLines[0].text('def checkInclusion(s1, s2):', 0.25));
  yield* all(codeLines[1].opacity(1, 0.12), codeLines[1].text('    c1 = Counter(s1)', 0.25));
  yield* all(codeLines[2].opacity(1, 0.12), codeLines[2].text('    c2 = Counter(s2[:len(s1)])', 0.25));
  yield* all(codeLines[3].opacity(1, 0.12), codeLines[3].text('    if c1 == c2: return True', 0.25));
  yield* all(codeLines[4].opacity(1, 0.12), codeLines[4].text('    for i in range(len(s1), len(s2)):', 0.25));
  yield* all(codeLines[5].opacity(1, 0.12), codeLines[5].text('        c2[s2[i]] += 1', 0.25));
  yield* all(codeLines[6].opacity(1, 0.12), codeLines[6].text('        c2[s2[i-len(s1)]] -= 1', 0.25));
  yield* all(codeLines[7].opacity(1, 0.12), codeLines[7].text('        if c1 == c2: return True', 0.25));

  yield* tip().opacity(1, 0.5);
  yield* waitFor(2);
});
