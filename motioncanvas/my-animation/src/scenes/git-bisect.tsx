import {Rect, Txt, Circle, makeScene2D, Node, Line} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, TERMINAL_BORDER, CODE_FONT, TITLE_FONT, ORANGE} from '../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const numberBadge = createRef<Rect>();
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const terminal = createRef<Rect>();
  const promptLines = createRefArray<Txt>();
  const tip = createRef<Txt>();
  const cta = createRef<Txt>();

  const commitLine = createRef<Line>();
  const commits = createRefArray<Circle>();
  const commitLabels = createRefArray<Txt>();
  const highlight = createRef<Rect>();
  const hlLabel = createRef<Txt>();

  view.add(
    <Rect ref={numberBadge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}>
      <Txt text={'#9'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} />
    </Rect>
  );

  view.add(<Txt ref={title} text={'git bisect'} fill={GREEN} fontFamily={CODE_FONT} fontSize={100} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Find Bugs Fast'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={48} y={-490} opacity={0} />);

  // Terminal
  view.add(
    <Rect ref={terminal} width={900} height={280} y={-200} radius={16} fill={TERMINAL_BG} stroke={TERMINAL_BORDER} lineWidth={2} opacity={0} scale={0.8} clip>
      <Rect width={900} height={50} y={-115} fill={'#21262d'}>
        <Circle size={16} fill={RED} x={-400} />
        <Circle size={16} fill={ORANGE} x={-370} />
        <Circle size={16} fill={GREEN} x={-340} />
      </Rect>
      <Txt ref={promptLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} x={-410} y={-40} offsetX={-1} opacity={0} />
      <Txt ref={promptLines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={24} x={-410} y={10} offsetX={-1} opacity={0} />
      <Txt ref={promptLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} x={-410} y={60} offsetX={-1} opacity={0} />
    </Rect>
  );

  // Commit timeline
  const colors = [GREEN, GREEN, GREEN, '#8b949e', '#8b949e', RED, RED, RED];
  const startX = -350;
  const spacing = 100;

  view.add(
    <Line
      ref={commitLine}
      points={[[startX, 150], [startX + 7 * spacing, 150]]}
      stroke={'#30363d'}
      lineWidth={4}
      opacity={0}
      end={0}
    />
  );

  for (let i = 0; i < 8; i++) {
    view.add(
      <Circle ref={commits} x={startX + i * spacing} y={150} size={32} fill={colors[i]} opacity={0} scale={0} />
    );
  }

  view.add(<Txt ref={commitLabels} text={'good ✓'} fill={GREEN} fontFamily={CODE_FONT} fontSize={22} fontWeight={700} x={startX} y={195} opacity={0} />);
  view.add(<Txt ref={commitLabels} text={'bad ✗'} fill={RED} fontFamily={CODE_FONT} fontSize={22} fontWeight={700} x={startX + 7 * spacing} y={195} opacity={0} />);

  // Highlight box for binary search
  view.add(
    <Rect ref={highlight} x={startX + 3 * spacing} y={150} width={55} height={55} radius={10} stroke={ORANGE} lineWidth={3} opacity={0} />
  );
  view.add(<Txt ref={hlLabel} text={'test here'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={20} fontWeight={700} x={startX + 3 * spacing} y={100} opacity={0} />);

  view.add(<Txt ref={tip} text={'Binary search through commits\\nFinds bugs in O(log n) 🔍'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={450} textAlign={'center'} lineHeight={46} opacity={0} />);
  view.add(<Txt ref={cta} text={'Follow for more Git tips! 🔥'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={40} y={780} opacity={0} />);

  // === ANIMATION ===
  yield* all(numberBadge().opacity(1, 0.3), numberBadge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* waitFor(0.2);

  yield* all(terminal().opacity(1, 0.4), terminal().scale(1, 0.5, easeOutCubic));

  yield* promptLines[0].opacity(1, 0.2);
  const cmd1 = '$ git bisect start';
  for (let i = 0; i <= cmd1.length; i++) {
    promptLines[0].text(cmd1.slice(0, i) + '▌');
    yield* waitFor(0.06);
  }
  promptLines[0].text(cmd1);
  yield* all(promptLines[1].opacity(1, 0.2), promptLines[1].text('Bisecting: 4 revisions left to test', 0.4));

  yield* waitFor(0.3);

  // Show commit timeline
  yield* all(commitLine().opacity(1, 0.2), commitLine().end(1, 0.8));
  for (let i = 0; i < 8; i++) {
    yield* all(commits[i].opacity(1, 0.1), commits[i].scale(1, 0.2, easeOutCubic));
  }
  yield* all(commitLabels[0].opacity(1, 0.3), commitLabels[1].opacity(1, 0.3));

  yield* waitFor(0.3);

  // Binary search step 1 - test middle
  yield* all(highlight().opacity(1, 0.3), hlLabel().opacity(1, 0.3));
  yield* waitFor(0.6);

  // Step 2 - narrow down
  yield* all(
    highlight().x(startX + 4 * spacing, 0.4, easeOutCubic),
    hlLabel().x(startX + 4 * spacing, 0.4, easeOutCubic),
    hlLabel().text('narrow down', 0.3),
  );
  yield* waitFor(0.6);

  // Step 3 - found it
  yield* all(
    highlight().x(startX + 5 * spacing, 0.4, easeOutCubic),
    hlLabel().x(startX + 5 * spacing, 0.4, easeOutCubic),
    hlLabel().text('found bug! 🐛', 0.3),
    hlLabel().fill(RED, 0.3),
    highlight().stroke(RED, 0.3),
  );

  yield* waitFor(0.3);

  // Terminal output
  yield* promptLines[2].opacity(1, 0.2);
  const cmd2 = '→ abc123 is the first bad commit';
  for (let i = 0; i <= cmd2.length; i++) {
    promptLines[2].text(cmd2.slice(0, i) + '▌');
    yield* waitFor(0.04);
  }
  promptLines[2].text(cmd2);
  promptLines[2].fill(RED);

  yield* tip().opacity(1, 0.5);
  yield* waitFor(0.5);
  yield* cta().opacity(1, 0.5);
  yield* waitFor(2);
});
