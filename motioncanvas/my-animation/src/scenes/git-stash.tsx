import {Rect, Txt, Circle, makeScene2D, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray, easeInCubic} from '@motion-canvas/core';
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

  // Stash visualization - files going into a box
  const fileCards = createRefArray<Rect>();
  const stashBox = createRef<Node>();
  const stashLid = createRef<Rect>();

  view.add(
    <Rect ref={numberBadge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}>
      <Txt text={'#8'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} />
    </Rect>
  );

  view.add(<Txt ref={title} text={'git stash'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={100} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Save Work for Later'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={48} y={-490} opacity={0} />);

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

  // File cards floating
  const fileData = [
    {name: 'app.js', color: ORANGE, x: -200, y: 350},
    {name: 'style.css', color: ACCENT_COLOR, x: 0, y: 330},
    {name: 'index.html', color: RED, x: 200, y: 350},
  ];
  for (const f of fileData) {
    view.add(
      <Rect ref={fileCards} x={f.x} y={f.y} width={160} height={80} radius={12} fill={f.color} opacity={0} scale={0}>
        <Txt text={'📄'} fontSize={30} y={-12} />
        <Txt text={f.name} fill={'#fff'} fontFamily={CODE_FONT} fontSize={16} fontWeight={700} y={22} />
      </Rect>
    );
  }

  // Stash box
  view.add(
    <Node ref={stashBox} y={550} opacity={0} scale={0}>
      <Rect width={300} height={150} radius={16} fill={ORANGE} opacity={0.15} stroke={ORANGE} lineWidth={3} />
      <Txt text={'📦 STASH'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={32} fontWeight={800} />
    </Node>
  );

  view.add(<Txt ref={tip} text={'Temporarily shelve changes\nand restore them later 🗃️'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={700} textAlign={'center'} lineHeight={46} opacity={0} />);
  view.add(<Txt ref={cta} text={'Follow for more Git tips! 🔥'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={40} y={800} opacity={0} />);

  // === ANIMATION ===
  yield* all(numberBadge().opacity(1, 0.3), numberBadge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* waitFor(0.2);

  yield* all(terminal().opacity(1, 0.4), terminal().scale(1, 0.5, easeOutCubic));

  // git stash
  yield* promptLines[0].opacity(1, 0.2);
  const cmd1 = '$ git stash';
  for (let i = 0; i <= cmd1.length; i++) {
    promptLines[0].text(cmd1.slice(0, i) + '▌');
    yield* waitFor(0.06);
  }
  promptLines[0].text(cmd1);
  yield* all(promptLines[1].opacity(1, 0.2), promptLines[1].text('Saved working directory ✓', 0.4));

  yield* waitFor(0.3);

  // Show file cards
  for (let i = 0; i < 3; i++) {
    yield* all(fileCards[i].opacity(1, 0.2), fileCards[i].scale(1, 0.3, easeOutCubic));
  }

  yield* waitFor(0.3);

  // Stash box appears
  yield* all(stashBox().opacity(1, 0.3), stashBox().scale(1, 0.5, easeOutCubic));

  yield* waitFor(0.2);

  // Files fly into stash box
  for (let i = 0; i < 3; i++) {
    yield* all(
      fileCards[i].y(550, 0.5, easeInCubic),
      fileCards[i].x(0, 0.5),
      fileCards[i].scale(0.3, 0.5),
      fileCards[i].opacity(0, 0.4),
    );
  }

  yield* waitFor(0.4);

  // git stash pop
  yield* promptLines[2].opacity(1, 0.2);
  const cmd2 = '$ git stash pop';
  for (let i = 0; i <= cmd2.length; i++) {
    promptLines[2].text(cmd2.slice(0, i) + '▌');
    yield* waitFor(0.06);
  }
  promptLines[2].text(cmd2);
  yield* all(promptLines[3].opacity(1, 0.2), promptLines[3].text('Changes restored ✓', 0.4));

  // Files pop back out
  for (let i = 0; i < 3; i++) {
    fileCards[i].y(550);
    fileCards[i].x(0);
    fileCards[i].scale(0.3);
    yield* all(
      fileCards[i].opacity(1, 0.2),
      fileCards[i].y(fileData[i].y, 0.5, easeOutCubic),
      fileCards[i].x(fileData[i].x, 0.5, easeOutCubic),
      fileCards[i].scale(1, 0.5, easeOutCubic),
    );
  }

  yield* tip().opacity(1, 0.5);
  yield* waitFor(0.5);
  yield* cta().opacity(1, 0.5);
  yield* waitFor(2);
});
