import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, TERMINAL_BORDER, CODE_FONT, TITLE_FONT, ORANGE, PURPLE} from '../../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const badge = createRef<Rect>();
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const difficulty = createRef<Rect>();

  view.add(<Rect ref={badge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}><Txt text={'#4'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} /></Rect>);
  view.add(<Txt ref={title} text={'Min Window Sub'} fill={RED} fontFamily={CODE_FONT} fontSize={76} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Smallest Window Containing t'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={38} y={-490} opacity={0} />);
  view.add(<Rect ref={difficulty} x={0} y={-430} width={140} height={44} radius={22} fill={RED} opacity={0} scale={0}><Txt text={'Hard'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} /></Rect>);

  // s = "ADOBECODEBANC", t = "ABC"
  const chars = ['A','D','O','B','E','C','O','D','E','B','A','N','C'];
  const target = ['A', 'B', 'C'];
  const boxSize = 52;
  const gap = 4;
  const startX = -((chars.length - 1) * (boxSize + gap)) / 2;
  const arrY = -210;
  const boxes = createRefArray<Rect>();

  for (let i = 0; i < chars.length; i++) {
    const isTarget = target.includes(chars[i]);
    view.add(
      <Rect ref={boxes} x={startX + i * (boxSize + gap)} y={arrY} width={boxSize} height={boxSize} radius={10} fill={TERMINAL_BG} stroke={isTarget ? ACCENT_COLOR : '#30363d'} lineWidth={isTarget ? 2 : 1} opacity={0} scale={0}>
        <Txt text={chars[i]} fill={isTarget ? ACCENT_COLOR : '#8b949e'} fontFamily={CODE_FONT} fontSize={28} fontWeight={800} />
      </Rect>
    );
  }

  const tLabel = createRef<Txt>();
  view.add(<Txt ref={tLabel} text={'t = "ABC"'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={30} fontWeight={700} y={arrY - 65} opacity={0} />);

  // Window highlight
  const window = createRef<Rect>();
  view.add(<Rect ref={window} x={startX} y={arrY} width={boxSize + 6} height={boxSize + 14} radius={14} stroke={GREEN} lineWidth={4} opacity={0} />);

  const statusTxt = createRef<Txt>();
  view.add(<Txt ref={statusTxt} text={''} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={28} fontWeight={800} y={arrY + 90} opacity={0} />);

  const needTxt = createRef<Txt>();
  view.add(<Txt ref={needTxt} text={''} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={22} y={arrY + 130} opacity={0} />);

  // Code block
  const codeBox = createRef<Rect>();
  const codeLines = createRefArray<Txt>();
  view.add(
    <Rect ref={codeBox} width={900} height={380} y={330} radius={16} fill={TERMINAL_BG} stroke={TERMINAL_BORDER} lineWidth={2} opacity={0} scale={0.8} clip>
      <Rect width={900} height={44} y={-168} fill={'#21262d'}><Txt text={'Python'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={18} /></Rect>
      <Txt ref={codeLines} text={''} fill={PURPLE} fontFamily={CODE_FONT} fontSize={18} x={-410} y={-110} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={18} x={-410} y={-78} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={18} x={-410} y={-46} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={18} x={-410} y={-14} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={18} x={-410} y={18} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={18} x={-410} y={50} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={18} x={-410} y={82} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={18} x={-410} y={114} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={18} x={-410} y={146} offsetX={-1} opacity={0} />
    </Rect>
  );

  // === ANIMATION ===
  yield* all(badge().opacity(1, 0.3), badge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* all(difficulty().opacity(1, 0.3), difficulty().scale(1, 0.4, easeOutCubic));
  yield* waitFor(0.2);

  yield* tLabel().opacity(1, 0.3);
  for (let i = 0; i < chars.length; i++) {
    yield* all(boxes[i].opacity(1, 0.05), boxes[i].scale(1, 0.1, easeOutCubic));
  }
  yield* all(window().opacity(1, 0.3), statusTxt().opacity(1, 0.2), needTxt().opacity(1, 0.2));

  const step = boxSize + gap;

  // Expand to first valid window [0..5] = "ADOBEC"
  yield* needTxt().text('need: A=1 B=1 C=1', 0.2);
  yield* all(window().width(step * 5 + boxSize + 6, 0.4), window().x(startX + step * 2.5, 0.4));
  yield* needTxt().text('need: A=0 B=0 C=0 — all found!', 0.3);
  yield* statusTxt().text('"ADOBEC" len=6 — valid!', 0.3);
  yield* statusTxt().fill(GREEN, 0.2);
  yield* waitFor(0.4);

  // Shrink from left
  yield* statusTxt().text('Shrink left to minimize →', 0.3);
  yield* statusTxt().fill(ORANGE, 0.2);
  yield* all(window().width(step * 4 + boxSize + 6, 0.3), window().x(startX + step * 3, 0.3), boxes[0].opacity(0.4, 0.2));
  yield* needTxt().text('Lost A — need A again, expand right', 0.3);
  yield* waitFor(0.3);

  // Jump to answer window [10..12] = "BANC"
  yield* all(window().width(step * 3 + boxSize + 6, 0.3), window().x(startX + step * 11, 0.3));
  for (let i = 0; i < 10; i++) boxes[i].opacity(0.4, 0);
  yield* statusTxt().text('"BANC" len=4 — minimum! ✅', 0.3);
  yield* statusTxt().fill(GREEN, 0.3);
  yield* all(boxes[10].stroke(GREEN, 0.2), boxes[11].stroke(GREEN, 0.2), boxes[12].stroke(GREEN, 0.2));
  yield* waitFor(0.4);

  // Show code
  yield* all(codeBox().opacity(1, 0.4), codeBox().scale(1, 0.5, easeOutCubic));
  yield* all(codeLines[0].opacity(1, 0.1), codeLines[0].text('def minWindow(s, t):', 0.2));
  yield* all(codeLines[1].opacity(1, 0.1), codeLines[1].text('    need = Counter(t); missing = len(t)', 0.2));
  yield* all(codeLines[2].opacity(1, 0.1), codeLines[2].text('    l = start = end = 0', 0.2));
  yield* all(codeLines[3].opacity(1, 0.1), codeLines[3].text('    for r, c in enumerate(s):', 0.2));
  yield* all(codeLines[4].opacity(1, 0.1), codeLines[4].text('        if need[c] > 0: missing -= 1', 0.2));
  yield* all(codeLines[5].opacity(1, 0.1), codeLines[5].text('        need[c] -= 1', 0.2));
  yield* all(codeLines[6].opacity(1, 0.1), codeLines[6].text('        while missing == 0:  # valid', 0.2));
  yield* all(codeLines[7].opacity(1, 0.1), codeLines[7].text('            if r-l < end-start: start,end=l,r+1', 0.18));
  yield* all(codeLines[8].opacity(1, 0.1), codeLines[8].text('            need[s[l]]+=1; if need[s[l]]>0: missing+=1; l+=1', 0.18));

  yield* waitFor(2);
});
