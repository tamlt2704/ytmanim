import {Rect, Txt, Circle, makeScene2D, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, TERMINAL_BORDER, CODE_FONT, TITLE_FONT, ORANGE, PURPLE} from '../../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const numberBadge = createRef<Rect>();
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const terminal = createRef<Rect>();
  const promptLines = createRefArray<Txt>();
  const tip = createRef<Txt>();
  const cta = createRef<Txt>();

  const blameRows = createRefArray<Rect>();
  const highlightRow = createRef<Rect>();
  const whoLabel = createRef<Txt>();

  view.add(
    <Rect ref={numberBadge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}>
      <Txt text={'#12'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} />
    </Rect>
  );

  view.add(<Txt ref={title} text={'git blame'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={100} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Who Wrote This?'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={48} y={-490} opacity={0} />);

  // Terminal
  view.add(
    <Rect ref={terminal} width={900} height={220} y={-240} radius={16} fill={TERMINAL_BG} stroke={TERMINAL_BORDER} lineWidth={2} opacity={0} scale={0.8} clip>
      <Rect width={900} height={50} y={-85} fill={'#21262d'}>
        <Circle size={16} fill={RED} x={-400} />
        <Circle size={16} fill={ORANGE} x={-370} />
        <Circle size={16} fill={GREEN} x={-340} />
      </Rect>
      <Txt ref={promptLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} x={-410} y={0} offsetX={-1} opacity={0} />
    </Rect>
  );

  // Blame output rows
  const blameData = [
    {hash: 'a1b2c3d', author: 'Alice', date: '2024-01-15', code: 'const x = 1;', color: ACCENT_COLOR},
    {hash: 'e4f5g6h', author: 'Bob  ', date: '2024-01-16', code: 'const y = 2;', color: PURPLE},
    {hash: 'a1b2c3d', author: 'Alice', date: '2024-01-15', code: 'const z = 3;', color: ACCENT_COLOR},
    {hash: 'k9l0m1n', author: 'Carol', date: '2024-01-17', code: 'return x+y+z;', color: GREEN},
  ];

  for (let i = 0; i < blameData.length; i++) {
    const d = blameData[i];
    view.add(
      <Rect ref={blameRows} x={0} y={10 + i * 75} width={850} height={60} radius={10} fill={TERMINAL_BG} stroke={'#30363d'} lineWidth={1} opacity={0} scale={0.9}>
        <Txt text={d.hash} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={20} x={-340} />
        <Txt text={d.author} fill={d.color} fontFamily={CODE_FONT} fontSize={22} fontWeight={700} x={-200} />
        <Txt text={d.date} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={18} x={-50} />
        <Txt text={d.code} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} x={170} />
      </Rect>
    );
  }

  // Highlight on Bob's row
  view.add(
    <Rect ref={highlightRow} x={0} y={10 + 1 * 75} width={870} height={65} radius={12} stroke={ORANGE} lineWidth={3} opacity={0} />
  );
  view.add(<Txt ref={whoLabel} text={'Who wrote this line? 🤔'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} x={0} y={10 + 1 * 75 + 50} opacity={0} />);

  view.add(<Txt ref={tip} text={'Track down who changed what\\nand when — line by line 🕵️'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={530} textAlign={'center'} lineHeight={46} opacity={0} />);
  view.add(<Txt ref={cta} text={'Follow for more Git tips! 🔥'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={40} y={780} opacity={0} />);

  // === ANIMATION ===
  yield* all(numberBadge().opacity(1, 0.3), numberBadge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* waitFor(0.2);

  yield* all(terminal().opacity(1, 0.4), terminal().scale(1, 0.5, easeOutCubic));

  yield* promptLines[0].opacity(1, 0.2);
  const cmd = '$ git blame app.js';
  for (let i = 0; i <= cmd.length; i++) {
    promptLines[0].text(cmd.slice(0, i) + '▌');
    yield* waitFor(0.06);
  }
  promptLines[0].text(cmd);

  yield* waitFor(0.3);

  // Show blame rows
  for (let i = 0; i < 4; i++) {
    yield* all(blameRows[i].opacity(1, 0.2), blameRows[i].scale(1, 0.3, easeOutCubic));
    yield* waitFor(0.1);
  }

  yield* waitFor(0.4);

  // Highlight Bob's line
  yield* all(highlightRow().opacity(1, 0.4), whoLabel().opacity(1, 0.4));

  yield* tip().opacity(1, 0.5);
  yield* waitFor(0.5);
  yield* cta().opacity(1, 0.5);
  yield* waitFor(2);
});
