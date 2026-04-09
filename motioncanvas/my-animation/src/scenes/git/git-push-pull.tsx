import {Rect, Txt, Circle, makeScene2D, Node, Line} from '@motion-canvas/2d';
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
  const localBox = createRef<Node>();
  const remoteBox = createRef<Node>();
  const pushArrow = createRef<Line>();
  const pullArrow = createRef<Line>();
  const pushLabel = createRef<Txt>();
  const pullLabel = createRef<Txt>();

  view.add(
    <Rect ref={numberBadge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}>
      <Txt text={'#4'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} />
    </Rect>
  );

  view.add(<Txt ref={title} text={'push & pull'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={90} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Sync with Remote'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={48} y={-490} opacity={0} />);

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

  // Local ↔ Remote visualization
  view.add(
    <Node ref={localBox} x={-280} y={380} opacity={0} scale={0}>
      <Rect width={250} height={180} radius={16} fill={GREEN} opacity={0.12} stroke={GREEN} lineWidth={2} />
      <Txt text={'💻'} fontSize={60} y={-20} />
      <Txt text={'Local Repo'} fill={GREEN} fontFamily={CODE_FONT} fontSize={22} fontWeight={700} y={55} />
    </Node>
  );

  view.add(
    <Node ref={remoteBox} x={280} y={380} opacity={0} scale={0}>
      <Rect width={250} height={180} radius={16} fill={PURPLE} opacity={0.12} stroke={PURPLE} lineWidth={2} />
      <Txt text={'☁️'} fontSize={60} y={-20} />
      <Txt text={'Remote Repo'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={22} fontWeight={700} y={55} />
    </Node>
  );

  // Push arrow (top, going right)
  view.add(<Line ref={pushArrow} points={[[-120, 340], [120, 340]]} stroke={GREEN} lineWidth={5} endArrow arrowSize={14} opacity={0} end={0} />);
  view.add(<Txt ref={pushLabel} text={'push'} fill={GREEN} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} y={320} opacity={0} />);

  // Pull arrow (bottom, going left)
  view.add(<Line ref={pullArrow} points={[{x: 120, y: 420}, {x: -120, y: 420}]} stroke={PURPLE} lineWidth={5} endArrow arrowSize={14} opacity={0} end={0} />);
  view.add(<Txt ref={pullLabel} text={'pull'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} y={440} opacity={0} />);

  view.add(<Txt ref={tip} text={'push uploads your commits\npull downloads & merges ↕️'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={570} textAlign={'center'} lineHeight={46} opacity={0} />);
  view.add(<Txt ref={cta} text={'Follow for more Git tips! 🔥'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={40} y={780} opacity={0} />);

  // === ANIMATION ===
  yield* all(numberBadge().opacity(1, 0.3), numberBadge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* waitFor(0.2);

  yield* all(terminal().opacity(1, 0.4), terminal().scale(1, 0.5, easeOutCubic));

  // git push
  yield* promptLines[0].opacity(1, 0.2);
  const cmd1 = '$ git push origin main';
  for (let i = 0; i <= cmd1.length; i++) {
    promptLines[0].text(cmd1.slice(0, i) + '▌');
    yield* waitFor(0.05);
  }
  promptLines[0].text(cmd1);
  yield* all(promptLines[1].opacity(1, 0.2), promptLines[1].text('Everything up-to-date ✓', 0.4));

  yield* waitFor(0.3);

  // git pull
  yield* promptLines[2].opacity(1, 0.2);
  const cmd2 = '$ git pull origin main';
  for (let i = 0; i <= cmd2.length; i++) {
    promptLines[2].text(cmd2.slice(0, i) + '▌');
    yield* waitFor(0.05);
  }
  promptLines[2].text(cmd2);
  yield* all(promptLines[3].opacity(1, 0.2), promptLines[3].text('Already up to date ✓', 0.4));

  yield* waitFor(0.4);

  // Show boxes
  yield* all(
    localBox().opacity(1, 0.3), localBox().scale(1, 0.5, easeOutCubic),
    remoteBox().opacity(1, 0.3), remoteBox().scale(1, 0.5, easeOutCubic),
  );
  yield* waitFor(0.3);

  // Push arrow
  yield* all(pushArrow().opacity(1, 0.2), pushArrow().end(1, 0.6), pushLabel().opacity(1, 0.4));
  yield* waitFor(0.3);

  // Pull arrow
  yield* all(pullArrow().opacity(1, 0.2), pullArrow().end(1, 0.6), pullLabel().opacity(1, 0.4));

  yield* tip().opacity(1, 0.5);
  yield* waitFor(0.5);
  yield* cta().opacity(1, 0.5);
  yield* waitFor(2);
});
