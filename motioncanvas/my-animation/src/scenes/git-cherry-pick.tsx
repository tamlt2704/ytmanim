import {Rect, Txt, Circle, makeScene2D, Node, Line} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, easeInOutCubic, createRefArray} from '@motion-canvas/core';
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

  const mainLine = createRef<Line>();
  const featLine = createRef<Line>();
  const mainCommits = createRefArray<Circle>();
  const featCommits = createRefArray<Circle>();
  const pickArrow = createRef<Line>();
  const pickLabel = createRef<Txt>();
  const pickedCommit = createRef<Circle>();

  const mainY = 200;
  const featY = 350;
  const startX = -350;
  const sp = 140;

  view.add(
    <Rect ref={numberBadge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}>
      <Txt text={'#11'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} />
    </Rect>
  );

  view.add(<Txt ref={title} text={'cherry-pick'} fill={RED} fontFamily={CODE_FONT} fontSize={90} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Pick Specific Commits'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={48} y={-490} opacity={0} />);

  // Terminal
  view.add(
    <Rect ref={terminal} width={900} height={250} y={-220} radius={16} fill={TERMINAL_BG} stroke={TERMINAL_BORDER} lineWidth={2} opacity={0} scale={0.8} clip>
      <Rect width={900} height={50} y={-100} fill={'#21262d'}>
        <Circle size={16} fill={RED} x={-400} />
        <Circle size={16} fill={ORANGE} x={-370} />
        <Circle size={16} fill={GREEN} x={-340} />
      </Rect>
      <Txt ref={promptLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} x={-410} y={-25} offsetX={-1} opacity={0} />
      <Txt ref={promptLines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={24} x={-410} y={25} offsetX={-1} opacity={0} />
    </Rect>
  );

  // Main branch
  view.add(
    <Line ref={mainLine} points={[[startX, mainY], [startX + 4 * sp, mainY]]} stroke={ACCENT_COLOR} lineWidth={5} opacity={0} end={0} />
  );
  view.add(
    <Rect x={startX - 60} y={mainY} height={30} paddingLeft={10} paddingRight={10} radius={15} fill={ACCENT_COLOR} opacity={0}>
      <Txt text={'main'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={18} fontWeight={700} />
    </Rect>
  );

  for (let i = 0; i < 5; i++) {
    view.add(
      <Circle ref={mainCommits} x={startX + i * sp} y={mainY} size={32} fill={ACCENT_COLOR} opacity={0} scale={0} />
    );
  }

  // Feature branch
  view.add(
    <Line ref={featLine} points={[[startX + sp, featY], [startX + 4 * sp, featY]]} stroke={GREEN} lineWidth={5} opacity={0} end={0} />
  );
  view.add(
    <Rect x={startX + sp - 75} y={featY} height={30} paddingLeft={10} paddingRight={10} radius={15} fill={GREEN} opacity={0}>
      <Txt text={'feature'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={18} fontWeight={700} />
    </Rect>
  );

  for (let i = 0; i < 4; i++) {
    view.add(
      <Circle ref={featCommits} x={startX + (i + 1) * sp} y={featY} size={32} fill={i === 2 ? ORANGE : GREEN} opacity={0} scale={0} />
    );
  }

  // Cherry-pick arrow
  view.add(
    <Line
      ref={pickArrow}
      points={[[startX + 3 * sp, featY - 20], [startX + 4 * sp, mainY + 20]]}
      stroke={ORANGE}
      lineWidth={4}
      endArrow
      arrowSize={14}
      opacity={0}
      end={0}
      lineDash={[8, 6]}
    />
  );
  view.add(<Txt ref={pickLabel} text={'cherry-pick 🍒'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} x={startX + 4 * sp + 30} y={(mainY + featY) / 2} opacity={0} />);

  // Ghost commit appearing on main
  view.add(
    <Circle ref={pickedCommit} x={startX + 4 * sp} y={mainY} size={32} fill={ORANGE} opacity={0} scale={0} />
  );

  view.add(<Txt ref={tip} text={'Grab any commit from any branch\\nwithout merging everything 🍒'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={550} textAlign={'center'} lineHeight={46} opacity={0} />);
  view.add(<Txt ref={cta} text={'Follow for more Git tips! 🔥'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={40} y={780} opacity={0} />);

  // === ANIMATION ===
  yield* all(numberBadge().opacity(1, 0.3), numberBadge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* waitFor(0.2);

  yield* all(terminal().opacity(1, 0.4), terminal().scale(1, 0.5, easeOutCubic));

  yield* promptLines[0].opacity(1, 0.2);
  const cmd = '$ git cherry-pick abc123';
  for (let i = 0; i <= cmd.length; i++) {
    promptLines[0].text(cmd.slice(0, i) + '▌');
    yield* waitFor(0.05);
  }
  promptLines[0].text(cmd);
  yield* all(promptLines[1].opacity(1, 0.2), promptLines[1].text('Cherry-picked commit applied ✓', 0.4));

  yield* waitFor(0.3);

  // Draw branches
  yield* all(mainLine().opacity(1, 0.2), mainLine().end(1, 0.6));
  for (let i = 0; i < 4; i++) {
    yield* all(mainCommits[i].opacity(1, 0.1), mainCommits[i].scale(1, 0.2, easeOutCubic));
  }

  yield* all(featLine().opacity(1, 0.2), featLine().end(1, 0.6));
  for (let i = 0; i < 4; i++) {
    yield* all(featCommits[i].opacity(1, 0.1), featCommits[i].scale(1, 0.2, easeOutCubic));
  }

  yield* waitFor(0.3);

  // Cherry-pick animation
  yield* all(pickArrow().opacity(1, 0.2), pickArrow().end(1, 0.6, easeInOutCubic));
  yield* pickLabel().opacity(1, 0.3);
  yield* all(pickedCommit().opacity(1, 0.2), pickedCommit().scale(1, 0.4, easeOutCubic));

  yield* tip().opacity(1, 0.5);
  yield* waitFor(0.5);
  yield* cta().opacity(1, 0.5);
  yield* waitFor(2);
});
