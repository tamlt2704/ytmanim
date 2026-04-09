import {Rect, Txt, Circle, makeScene2D, Node, Line} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray, chain} from '@motion-canvas/core';
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

  // Staging area visualization
  const workingArea = createRef<Node>();
  const stagingArea = createRef<Node>();
  const commitArea = createRef<Node>();
  const arrow1 = createRef<Line>();
  const arrow2 = createRef<Line>();
  const files = createRefArray<Rect>();

  view.add(
    <Rect ref={numberBadge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}>
      <Txt text={'#3'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} />
    </Rect>
  );

  view.add(<Txt ref={title} text={'add & commit'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={85} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Save Your Changes'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={48} y={-490} opacity={0} />);

  // Terminal
  view.add(
    <Rect ref={terminal} width={900} height={350} y={-170} radius={16} fill={TERMINAL_BG} stroke={TERMINAL_BORDER} lineWidth={2} opacity={0} scale={0.8} clip>
      <Rect width={900} height={50} y={-150} fill={'#21262d'}>
        <Circle size={16} fill={RED} x={-400} />
        <Circle size={16} fill={ORANGE} x={-370} />
        <Circle size={16} fill={GREEN} x={-340} />
      </Rect>
      <Txt ref={promptLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} x={-410} y={-70} offsetX={-1} opacity={0} />
      <Txt ref={promptLines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={24} x={-410} y={-20} offsetX={-1} opacity={0} />
      <Txt ref={promptLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} x={-410} y={40} offsetX={-1} opacity={0} />
      <Txt ref={promptLines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={24} x={-410} y={90} offsetX={-1} opacity={0} />
    </Rect>
  );

  // 3-stage visualization: Working → Staging → Commit
  view.add(
    <Node ref={workingArea} x={-320} y={350} opacity={0} scale={0}>
      <Rect width={220} height={180} radius={16} fill={RED} opacity={0.12} stroke={RED} lineWidth={2} />
      <Txt text={'Working'} fill={RED} fontFamily={CODE_FONT} fontSize={22} fontWeight={700} y={-60} />
      <Rect ref={files} width={140} height={35} y={-15} radius={8} fill={RED} opacity={0.3}>
        <Txt text={'index.js'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={18} />
      </Rect>
      <Rect ref={files} width={140} height={35} y={30} radius={8} fill={RED} opacity={0.3}>
        <Txt text={'style.css'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={18} />
      </Rect>
    </Node>
  );

  view.add(
    <Line ref={arrow1} points={[[-180, 350], [0, 350]]} stroke={ORANGE} lineWidth={5} endArrow arrowSize={14} opacity={0} end={0} />
  );

  view.add(
    <Node ref={stagingArea} x={0} y={350} opacity={0} scale={0}>
      <Rect width={220} height={180} radius={16} fill={ORANGE} opacity={0.12} stroke={ORANGE} lineWidth={2} />
      <Txt text={'Staged'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={22} fontWeight={700} y={-60} />
      <Txt text={'📦'} fontSize={50} y={15} />
    </Node>
  );

  view.add(
    <Line ref={arrow2} points={[{x: 140, y: 350}, {x: 320, y: 350}]} stroke={GREEN} lineWidth={5} endArrow arrowSize={14} opacity={0} end={0} />
  );

  view.add(
    <Node ref={commitArea} x={320} y={350} opacity={0} scale={0}>
      <Rect width={220} height={180} radius={16} fill={GREEN} opacity={0.12} stroke={GREEN} lineWidth={2} />
      <Txt text={'Committed'} fill={GREEN} fontFamily={CODE_FONT} fontSize={22} fontWeight={700} y={-60} />
      <Txt text={'✅'} fontSize={50} y={15} />
    </Node>
  );

  view.add(<Txt ref={tip} text={'git add stages files\ngit commit saves a snapshot 📸'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={570} textAlign={'center'} lineHeight={46} opacity={0} />);
  view.add(<Txt ref={cta} text={'Follow for more Git tips! 🔥'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={40} y={780} opacity={0} />);

  // === ANIMATION ===
  yield* all(numberBadge().opacity(1, 0.3), numberBadge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* waitFor(0.2);

  yield* all(terminal().opacity(1, 0.4), terminal().scale(1, 0.5, easeOutCubic));

  // Type git add
  yield* promptLines[0].opacity(1, 0.2);
  const cmd1 = '$ git add .';
  for (let i = 0; i <= cmd1.length; i++) {
    promptLines[0].text(cmd1.slice(0, i) + '▌');
    yield* waitFor(0.06);
  }
  promptLines[0].text(cmd1);
  yield* waitFor(0.2);
  yield* all(promptLines[1].opacity(1, 0.2), promptLines[1].text('Changes staged for commit ✓', 0.4));

  yield* waitFor(0.3);

  // Type git commit
  yield* promptLines[2].opacity(1, 0.2);
  const cmd2 = '$ git commit -m "initial commit"';
  for (let i = 0; i <= cmd2.length; i++) {
    promptLines[2].text(cmd2.slice(0, i) + '▌');
    yield* waitFor(0.04);
  }
  promptLines[2].text(cmd2);
  yield* waitFor(0.2);
  yield* all(promptLines[3].opacity(1, 0.2), promptLines[3].text('[main abc1234] initial commit', 0.4));

  yield* waitFor(0.3);

  // Show 3-stage flow
  yield* all(workingArea().opacity(1, 0.3), workingArea().scale(1, 0.5, easeOutCubic));
  yield* waitFor(0.3);

  yield* all(arrow1().opacity(1, 0.2), arrow1().end(1, 0.6));
  yield* all(stagingArea().opacity(1, 0.3), stagingArea().scale(1, 0.5, easeOutCubic));
  yield* waitFor(0.3);

  yield* all(arrow2().opacity(1, 0.2), arrow2().end(1, 0.6));
  yield* all(commitArea().opacity(1, 0.3), commitArea().scale(1, 0.5, easeOutCubic));

  yield* tip().opacity(1, 0.5);
  yield* waitFor(0.5);
  yield* cta().opacity(1, 0.5);
  yield* waitFor(2);
});
