import {Rect, Txt, Circle, makeScene2D, Node, Line} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, TERMINAL_BORDER, CODE_FONT, TITLE_FONT, ORANGE, CYAN} from '../../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const numberBadge = createRef<Rect>();
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const terminal = createRef<Rect>();
  const promptLines = createRefArray<Txt>();
  const tip = createRef<Txt>();
  const cta = createRef<Txt>();

  const wt1 = createRef<Rect>();
  const wt2 = createRef<Rect>();
  const dashLine = createRef<Line>();
  const sharedLabel = createRef<Txt>();
  const gitIcon = createRef<Node>();

  view.add(
    <Rect ref={numberBadge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}>
      <Txt text={'#13'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} />
    </Rect>
  );

  view.add(<Txt ref={title} text={'git worktree'} fill={CYAN} fontFamily={CODE_FONT} fontSize={90} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Multiple Working Dirs'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={48} y={-490} opacity={0} />);

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

  // Worktree 1
  view.add(
    <Rect ref={wt1} x={-220} y={150} width={280} height={180} radius={16} fill={TERMINAL_BG} stroke={ACCENT_COLOR} lineWidth={3} opacity={0} scale={0}>
      <Txt text={'📁'} fontSize={50} y={-30} />
      <Txt text={'main'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} y={30} />
      <Txt text={'(worktree 1)'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={18} y={60} />
    </Rect>
  );

  // Worktree 2
  view.add(
    <Rect ref={wt2} x={220} y={150} width={280} height={180} radius={16} fill={TERMINAL_BG} stroke={GREEN} lineWidth={3} opacity={0} scale={0}>
      <Txt text={'📁'} fontSize={50} y={-30} />
      <Txt text={'feature'} fill={GREEN} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} y={30} />
      <Txt text={'(worktree 2)'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={18} y={60} />
    </Rect>
  );

  // Dashed connection line
  view.add(
    <Line ref={dashLine} points={[[-70, 150], [70, 150]]} stroke={ORANGE} lineWidth={3} lineDash={[10, 6]} opacity={0} end={0} />
  );

  // Shared .git label
  view.add(
    <Node ref={gitIcon} y={310} opacity={0} scale={0}>
      <Rect width={220} height={50} radius={25} fill={ORANGE} opacity={0.2} stroke={ORANGE} lineWidth={2}>
        <Txt text={'Same .git 📦'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={22} fontWeight={700} />
      </Rect>
    </Node>
  );

  view.add(<Txt ref={sharedLabel} text={'No stashing needed!'} fill={CYAN} fontFamily={CODE_FONT} fontSize={28} fontWeight={700} y={390} opacity={0} />);

  view.add(<Txt ref={tip} text={'Work on multiple branches\\nsimultaneously in separate dirs 🌳'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={530} textAlign={'center'} lineHeight={46} opacity={0} />);
  view.add(<Txt ref={cta} text={'Follow for more Git tips! 🔥'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={40} y={780} opacity={0} />);

  // === ANIMATION ===
  yield* all(numberBadge().opacity(1, 0.3), numberBadge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* waitFor(0.2);

  yield* all(terminal().opacity(1, 0.4), terminal().scale(1, 0.5, easeOutCubic));

  yield* promptLines[0].opacity(1, 0.2);
  const cmd = '$ git worktree add ../feat feature';
  for (let i = 0; i <= cmd.length; i++) {
    promptLines[0].text(cmd.slice(0, i) + '▌');
    yield* waitFor(0.05);
  }
  promptLines[0].text(cmd);
  yield* all(promptLines[1].opacity(1, 0.2), promptLines[1].text("Preparing worktree (branch 'feature') ✓", 0.4));

  yield* waitFor(0.3);

  // Show worktrees
  yield* all(wt1().opacity(1, 0.3), wt1().scale(1, 0.5, easeOutCubic));
  yield* waitFor(0.2);
  yield* all(wt2().opacity(1, 0.3), wt2().scale(1, 0.5, easeOutCubic));

  yield* waitFor(0.3);

  // Dashed line connecting them
  yield* all(dashLine().opacity(1, 0.2), dashLine().end(1, 0.5));

  // Shared .git
  yield* all(gitIcon().opacity(1, 0.3), gitIcon().scale(1, 0.4, easeOutCubic));
  yield* sharedLabel().opacity(1, 0.4);

  yield* tip().opacity(1, 0.5);
  yield* waitFor(0.5);
  yield* cta().opacity(1, 0.5);
  yield* waitFor(2);
});
