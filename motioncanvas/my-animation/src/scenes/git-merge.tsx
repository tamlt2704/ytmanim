import {Rect, Txt, Circle, makeScene2D, Node, Line} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, TERMINAL_BORDER, CODE_FONT, TITLE_FONT, ORANGE, PURPLE} from '../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const numberBadge = createRef<Rect>();
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const terminal = createRef<Rect>();
  const promptLines = createRefArray<Txt>();
  const tip = createRef<Txt>();
  const cta = createRef<Txt>();

  // Merge visualization
  const mainLine = createRef<Line>();
  const featureLine = createRef<Line>();
  const mergeLine = createRef<Line>();
  const commits = createRefArray<Circle>();
  const mergeCommit = createRef<Circle>();
  const mergeFlash = createRef<Circle>();

  view.add(
    <Rect ref={numberBadge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}>
      <Txt text={'#6'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} />
    </Rect>
  );

  view.add(<Txt ref={title} text={'git merge'} fill={RED} fontFamily={CODE_FONT} fontSize={100} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Combine Branches'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={48} y={-490} opacity={0} />);

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

  // Main branch line
  view.add(<Line ref={mainLine} points={[[-350, 280], [350, 280]]} stroke={GREEN} lineWidth={6} opacity={0} end={0} />);

  // Main commits
  const mainPos = [-250, -100, 250];
  for (const x of mainPos) {
    view.add(
      <Circle ref={commits} x={x} y={280} size={40} fill={GREEN} opacity={0} scale={0}>
        <Circle size={20} fill={BG_COLOR} />
      </Circle>
    );
  }

  // Feature branch
  view.add(<Line ref={featureLine} points={[[-100, 280], [-20, 160], [120, 160]]} stroke={PURPLE} lineWidth={6} opacity={0} end={0} radius={40} />);

  // Feature commits
  view.add(
    <Circle ref={commits} x={60} y={160} size={40} fill={PURPLE} opacity={0} scale={0}>
      <Circle size={20} fill={BG_COLOR} />
    </Circle>
  );

  // Merge line (feature back to main)
  view.add(<Line ref={mergeLine} points={[{x: 120, y: 160}, {x: 200, y: 220}, {x: 250, y: 280}]} stroke={PURPLE} lineWidth={6} opacity={0} end={0} radius={40} lineDash={[12, 8]} />);

  // Merge commit (special)
  view.add(
    <Circle ref={mergeCommit} x={250} y={280} size={55} fill={ORANGE} opacity={0} scale={0}>
      <Circle size={25} fill={BG_COLOR} />
    </Circle>
  );

  // Flash effect
  view.add(<Circle ref={mergeFlash} x={250} y={280} size={55} fill={ORANGE} opacity={0} />);

  // Labels
  const mainLabel = createRef<Rect>();
  const featureLabel = createRef<Rect>();
  view.add(
    <Rect ref={mainLabel} x={-300} y={330} height={36} paddingLeft={16} paddingRight={16} radius={18} fill={GREEN} opacity={0}>
      <Txt text={'main'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={20} fontWeight={700} />
    </Rect>
  );
  view.add(
    <Rect ref={featureLabel} x={60} y={120} height={36} paddingLeft={16} paddingRight={16} radius={18} fill={PURPLE} opacity={0}>
      <Txt text={'feature'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={20} fontWeight={700} />
    </Rect>
  );

  view.add(<Txt ref={tip} text={'Merges combine work from\ndifferent branches 🔀'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={480} textAlign={'center'} lineHeight={46} opacity={0} />);
  view.add(<Txt ref={cta} text={'Follow for more Git tips! 🔥'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={40} y={780} opacity={0} />);

  // === ANIMATION ===
  yield* all(numberBadge().opacity(1, 0.3), numberBadge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* waitFor(0.2);

  yield* all(terminal().opacity(1, 0.4), terminal().scale(1, 0.5, easeOutCubic));

  yield* promptLines[0].opacity(1, 0.2);
  const cmd1 = '$ git checkout main';
  for (let i = 0; i <= cmd1.length; i++) {
    promptLines[0].text(cmd1.slice(0, i) + '▌');
    yield* waitFor(0.06);
  }
  promptLines[0].text(cmd1);
  yield* waitFor(0.2);

  yield* promptLines[1].opacity(1, 0.2);
  const cmd2 = '$ git merge feature';
  for (let i = 0; i <= cmd2.length; i++) {
    promptLines[1].text(cmd2.slice(0, i) + '▌');
    yield* waitFor(0.06);
  }
  promptLines[1].text(cmd2);
  yield* all(promptLines[2].opacity(1, 0.2), promptLines[2].text('Merge made by recursive ✓', 0.4));

  yield* waitFor(0.4);

  // Draw main line + commits
  yield* all(mainLine().opacity(1, 0.2), mainLine().end(1, 0.8));
  for (let i = 0; i < 2; i++) {
    yield* all(commits[i].opacity(1, 0.15), commits[i].scale(1, 0.3, easeOutCubic));
  }
  yield* mainLabel().opacity(1, 0.3);

  // Feature branch
  yield* all(featureLine().opacity(1, 0.2), featureLine().end(1, 0.6));
  yield* all(commits[3].opacity(1, 0.15), commits[3].scale(1, 0.3, easeOutCubic));
  yield* featureLabel().opacity(1, 0.3);

  yield* waitFor(0.3);

  // Merge line
  yield* all(mergeLine().opacity(1, 0.2), mergeLine().end(1, 0.6));

  // Merge commit with flash
  yield* all(
    mergeCommit().opacity(1, 0.2),
    mergeCommit().scale(1, 0.4, easeOutCubic),
    commits[2].opacity(1, 0.15),
    commits[2].scale(1, 0.3, easeOutCubic),
  );
  yield* all(
    mergeFlash().opacity(0.6, 0.1),
    mergeFlash().size(120, 0.4),
  );
  yield* all(
    mergeFlash().opacity(0, 0.3),
    mergeFlash().size(180, 0.3),
  );

  yield* tip().opacity(1, 0.5);
  yield* waitFor(0.5);
  yield* cta().opacity(1, 0.5);
  yield* waitFor(2);
});
