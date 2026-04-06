import {Rect, Txt, makeScene2D, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, TERMINAL_BORDER, CODE_FONT, TITLE_FONT, ORANGE, PURPLE} from '../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);
  const badge = createRef<Rect>(); const title = createRef<Txt>(); const subtitle = createRef<Txt>(); const difficulty = createRef<Rect>();
  view.add(<Rect ref={badge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}><Txt text={'#5'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} /></Rect>);
  view.add(<Txt ref={title} text={'Interleave'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={80} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Can s3 Interleave s1+s2?'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={44} y={-490} opacity={0} />);
  view.add(<Rect ref={difficulty} x={0} y={-430} width={180} height={44} radius={22} fill={ORANGE} opacity={0} scale={0}><Txt text={'Medium'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} /></Rect>);
  const boxes = createRefArray<Rect>();
  const boxSize = 75; const gap = 10;
  const startX = -((3 - 1) * (boxSize + gap)) / 2;
  const arrY = -200;
    view.add(
      <Rect ref={boxes} x={startX + 0 * (boxSize + gap)} y={arrY} width={boxSize} height={boxSize} radius={12} fill={TERMINAL_BG} stroke={'#30363d'} lineWidth={2} opacity={0} scale={0}>
        <Txt text={'aab'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={36} fontWeight={800} />
      </Rect>
    );
    view.add(
      <Rect ref={boxes} x={startX + 1 * (boxSize + gap)} y={arrY} width={boxSize} height={boxSize} radius={12} fill={TERMINAL_BG} stroke={'#30363d'} lineWidth={2} opacity={0} scale={0}>
        <Txt text={'axy'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={36} fontWeight={800} />
      </Rect>
    );
    view.add(
      <Rect ref={boxes} x={startX + 2 * (boxSize + gap)} y={arrY} width={boxSize} height={boxSize} radius={12} fill={TERMINAL_BG} stroke={'#30363d'} lineWidth={2} opacity={0} scale={0}>
        <Txt text={'aaxaby'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={36} fontWeight={800} />
      </Rect>
    );

  const statusTxt = createRef<Txt>();
  view.add(<Txt ref={statusTxt} text={''} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={30} fontWeight={800} y={arrY + 90} opacity={0} />);
  const codeBox = createRef<Rect>(); const codeLines = createRefArray<Txt>();
  view.add(
    <Rect ref={codeBox} width={900} height={426} y={320} radius={16} fill={TERMINAL_BG} stroke={TERMINAL_BORDER} lineWidth={2} opacity={0} scale={0.8} clip>
      <Rect width={900} height={44} y={-191} fill={'#21262d'}><Txt text={'Python'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={18} /></Rect>
      <Txt ref={codeLines} text={''} fill={PURPLE} fontFamily={CODE_FONT} fontSize={20} x={-410} y={-110} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={20} x={-410} y={-78} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={20} x={-410} y={-46} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={20} x={-410} y={-14} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={20} x={-410} y={18} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={20} x={-410} y={50} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={20} x={-410} y={82} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={20} x={-410} y={114} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={20} x={-410} y={146} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={20} x={-410} y={178} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={20} x={-410} y={210} offsetX={-1} opacity={0} />
    </Rect>
  );
  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'O(m×n) — two pointers into s1, s2\nmerge to form s3 🧩'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={640} textAlign={'center'} lineHeight={46} opacity={0} />);

  yield* all(badge().opacity(1, 0.3), badge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* all(difficulty().opacity(1, 0.3), difficulty().scale(1, 0.4, easeOutCubic));
  yield* waitFor(0.2);
  for (let i = 0; i < 3; i++) {
    yield* all(boxes[i].opacity(1, 0.08), boxes[i].scale(1, 0.15, easeOutCubic));
  }
  yield* statusTxt().opacity(1, 0.2);
  yield* statusTxt().text('dp[i][j] = s1[:i] + s2[:j] forms s3[:i+j]?', 0.3);
  yield* waitFor(0.4);
  yield* statusTxt().text('Take from s1 if s1[i-1]==s3[i+j-1]', 0.3);
  yield* waitFor(0.4);
  yield* statusTxt().text('Or from s2 if s2[j-1]==s3[i+j-1]', 0.3);
  yield* waitFor(0.4);
  yield* statusTxt().text('True ✅', 0.3);
  yield* statusTxt().fill(GREEN, 0.2);
  yield* waitFor(0.5);

  yield* all(codeBox().opacity(1, 0.4), codeBox().scale(1, 0.5, easeOutCubic));
  yield* all(codeLines[0].opacity(1, 0.12), codeLines[0].text('def isInterleave(s1, s2, s3):', 0.2));
  yield* all(codeLines[1].opacity(1, 0.12), codeLines[1].text('    m, n = len(s1), len(s2)', 0.2));
  yield* all(codeLines[2].opacity(1, 0.12), codeLines[2].text('    if m + n != len(s3): return False', 0.2));
  yield* all(codeLines[3].opacity(1, 0.12), codeLines[3].text('    dp = [[False]*(n+1) for _ in range(m+1)]', 0.2));
  yield* all(codeLines[4].opacity(1, 0.12), codeLines[4].text('    dp[0][0] = True', 0.2));
  yield* all(codeLines[5].opacity(1, 0.12), codeLines[5].text('    for i in range(m+1):', 0.2));
  yield* all(codeLines[6].opacity(1, 0.12), codeLines[6].text('        for j in range(n+1):', 0.2));
  yield* all(codeLines[7].opacity(1, 0.12), codeLines[7].text('            if i and s1[i-1]==s3[i+j-1]:', 0.2));
  yield* all(codeLines[8].opacity(1, 0.12), codeLines[8].text('                dp[i][j] |= dp[i-1][j]', 0.2));
  yield* all(codeLines[9].opacity(1, 0.12), codeLines[9].text('            if j and s2[j-1]==s3[i+j-1]:', 0.2));
  yield* all(codeLines[10].opacity(1, 0.12), codeLines[10].text('                dp[i][j] |= dp[i][j-1]', 0.2));

  yield* tip().opacity(1, 0.5);
  yield* waitFor(2);
});
