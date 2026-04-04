import {Rect, Txt, Circle, makeScene2D, Node, Line} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, TERMINAL_BORDER, CODE_FONT, TITLE_FONT, ORANGE, PURPLE, CYAN} from '../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const numberBadge = createRef<Rect>();
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const terminal = createRef<Rect>();
  const promptLines = createRefArray<Txt>();
  const tip = createRef<Txt>();
  const cta = createRef<Txt>();

  // Branch visualization
  const mainLine = createRef<Line>();
  const featureLine = createRef<Line>();
  const commits = createRefArray<Circle>();
  const branchLabels = createRefArray<Rect>();
  const headPointer = createRef<Node>();

  view.add(
    <Rect ref={numberBadge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}>
      <Txt text={'#5'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} />
    </Rect>
  );

  view.add(<Txt ref={title} text={'branch'} fill={CYAN} fontFamily={CODE_FONT} fontSize={100} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Work in Parallel'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={48} y={-490} opacity={0} />);

  // Terminal
  view.add(
    <Rect ref={terminal} width={900} height={300} y={-200} radius={16} fill={TERMINAL_BG} stroke={TERMINAL_BORDER} lineWidth={2} opacity={0} scale={0.8} clip>
      <Rect width={900} height={50} y={-125} fill={'#21262d'}>
        <Circle size={16} fill={RED} x={-400} />
        <Circle size={16} fill={ORANGE} x={-370} />
        <Circle size={16} fill={GREEN} x={-340} />
      </Rect>
      <Txt ref={promptLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} x={-410} y={-45} offsetX={-1} opacity={0} />
      <Txt ref={promptLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} x={-410} y={10} offsetX={-1} opacity={0} />
      <Txt ref={promptLines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={24} x={-410} y={60} offsetX={-1} opacity={0} />
    </Rect>
  );

  // Branch visualization - main line
  view.add(
    <Line
      ref={mainLine}
      points={[[-350, 200], [350, 200]]}
      stroke={GREEN}
      lineWidth={6}
      opacity={0}
      end={0}
    />
  );

  // Commits on main
  const commitPositions = [-250, -100, 50, 200];
  for (const x of commitPositions) {
    view.add(
      <Circle ref={commits} x={x} y={200} size={40} fill={GREEN} opacity={0} scale={0}>
        <Circle size={20} fill={BG_COLOR} />
      </Circle>
    );
  }

  // Feature branch line
  view.add(
    <Line
      ref={featureLine}
      points={[[-100, 200], [-20, 100], [150, 100], [250, 100]]}
      stroke={PURPLE}
      lineWidth={6}
      opacity={0}
      end={0}
      radius={40}
    />
  );

  // Feature branch commits
  const featureCommitPositions = [{x: 50, y: 100}, {x: 180, y: 100}];
  for (const pos of featureCommitPositions) {
    view.add(
      <Circle ref={commits} x={pos.x} y={pos.y} size={40} fill={PURPLE} opacity={0} scale={0}>
        <Circle size={20} fill={BG_COLOR} />
      </Circle>
    );
  }

  // Branch labels
  view.add(
    <Rect ref={branchLabels} x={300} y={240} height={36} paddingLeft={16} paddingRight={16} radius={18} fill={GREEN} opacity={0} scale={0}>
      <Txt text={'main'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={20} fontWeight={700} />
    </Rect>
  );
  view.add(
    <Rect ref={branchLabels} x={310} y={100} height={36} paddingLeft={16} paddingRight={16} radius={18} fill={PURPLE} opacity={0} scale={0}>
      <Txt text={'feature'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={20} fontWeight={700} />
    </Rect>
  );

  // HEAD pointer
  view.add(
    <Node ref={headPointer} x={200} y={155} opacity={0}>
      <Txt text={'HEAD →'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={22} fontWeight={700} />
    </Node>
  );

  view.add(<Txt ref={tip} text={'Branches let you experiment\nwithout breaking main 🌿'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={450} textAlign={'center'} lineHeight={46} opacity={0} />);
  view.add(<Txt ref={cta} text={'Follow for more Git tips! 🔥'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={40} y={780} opacity={0} />);

  // === ANIMATION ===
  yield* all(numberBadge().opacity(1, 0.3), numberBadge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* waitFor(0.2);

  yield* all(terminal().opacity(1, 0.4), terminal().scale(1, 0.5, easeOutCubic));

  // git branch
  yield* promptLines[0].opacity(1, 0.2);
  const cmd1 = '$ git branch feature';
  for (let i = 0; i <= cmd1.length; i++) {
    promptLines[0].text(cmd1.slice(0, i) + '▌');
    yield* waitFor(0.06);
  }
  promptLines[0].text(cmd1);
  yield* waitFor(0.2);

  // git checkout
  yield* promptLines[1].opacity(1, 0.2);
  const cmd2 = '$ git checkout feature';
  for (let i = 0; i <= cmd2.length; i++) {
    promptLines[1].text(cmd2.slice(0, i) + '▌');
    yield* waitFor(0.06);
  }
  promptLines[1].text(cmd2);
  yield* all(promptLines[2].opacity(1, 0.2), promptLines[2].text("Switched to branch 'feature'", 0.4));

  yield* waitFor(0.4);

  // Draw main line
  yield* all(mainLine().opacity(1, 0.2), mainLine().end(1, 1));

  // Pop in main commits
  for (let i = 0; i < 4; i++) {
    yield* all(commits[i].opacity(1, 0.15), commits[i].scale(1, 0.3, easeOutCubic));
  }

  // Main label
  yield* all(branchLabels[0].opacity(1, 0.2), branchLabels[0].scale(1, 0.3, easeOutCubic));
  yield* waitFor(0.3);

  // Feature branch grows
  yield* all(featureLine().opacity(1, 0.2), featureLine().end(1, 0.8));

  // Feature commits
  for (let i = 4; i < 6; i++) {
    yield* all(commits[i].opacity(1, 0.15), commits[i].scale(1, 0.3, easeOutCubic));
  }

  // Feature label
  yield* all(branchLabels[1].opacity(1, 0.2), branchLabels[1].scale(1, 0.3, easeOutCubic));

  // HEAD pointer
  yield* headPointer().opacity(1, 0.4);

  yield* tip().opacity(1, 0.5);
  yield* waitFor(0.5);
  yield* cta().opacity(1, 0.5);
  yield* waitFor(2);
});
