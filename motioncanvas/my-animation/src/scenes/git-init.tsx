import {Rect, Txt, Line, Circle, makeScene2D, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, sequence, chain, easeOutCubic, easeInOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, TERMINAL_BORDER, CODE_FONT, TITLE_FONT, ORANGE, CYAN} from '../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  // Title card
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const commandBox = createRef<Rect>();
  const commandTxt = createRef<Txt>();
  const terminal = createRef<Rect>();
  const promptTxt = createRef<Txt>();
  const outputLines = createRefArray<Txt>();
  const folderIcon = createRef<Node>();
  const gitFolder = createRef<Node>();
  const numberBadge = createRef<Rect>();

  // Episode number badge
  view.add(
    <Rect
      ref={numberBadge}
      x={0} y={-750}
      width={300} height={100}
      radius={50}
      fill={ACCENT_COLOR}
      opacity={0}
      scale={0}
    >
      <Txt
        text={'#1'}
        fill={'#fff'}
        fontFamily={TITLE_FONT}
        fontSize={56}
        fontWeight={800}
      />
    </Rect>
  );

  // Title
  view.add(
    <Txt
      ref={title}
      text={'git init'}
      fill={GREEN}
      fontFamily={CODE_FONT}
      fontSize={100}
      fontWeight={800}
      y={-580}
      opacity={0}
    />
  );

  // Subtitle
  view.add(
    <Txt
      ref={subtitle}
      text={'Start a New Repository'}
      fill={TEXT_COLOR}
      fontFamily={TITLE_FONT}
      fontSize={48}
      y={-490}
      opacity={0}
    />
  );

  // Terminal window
  view.add(
    <Rect
      ref={terminal}
      width={900}
      height={500}
      y={-100}
      radius={16}
      fill={TERMINAL_BG}
      stroke={TERMINAL_BORDER}
      lineWidth={2}
      opacity={0}
      scale={0.8}
      clip
    >
      {/* Title bar */}
      <Rect width={900} height={50} y={-225} fill={'#21262d'}>
        <Circle size={16} fill={RED} x={-400} />
        <Circle size={16} fill={ORANGE} x={-370} />
        <Circle size={16} fill={GREEN} x={-340} />
        <Txt text={'Terminal'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={18} />
      </Rect>

      {/* Prompt line */}
      <Txt
        ref={promptTxt}
        text={''}
        fill={TEXT_COLOR}
        fontFamily={CODE_FONT}
        fontSize={32}
        x={-410}
        y={-130}
        offsetX={-1}
        opacity={0}
      />

      {/* Output lines */}
      <Txt
        ref={outputLines}
        text={''}
        fill={GREEN}
        fontFamily={CODE_FONT}
        fontSize={26}
        x={-410}
        y={-60}
        offsetX={-1}
        opacity={0}
      />
      <Txt
        ref={outputLines}
        text={''}
        fill={'#8b949e'}
        fontFamily={CODE_FONT}
        fontSize={24}
        x={-410}
        y={0}
        offsetX={-1}
        opacity={0}
      />
    </Rect>
  );

  // Folder visualization
  view.add(
    <Node ref={folderIcon} y={350} opacity={0} scale={0}>
      <Rect width={200} height={160} radius={12} fill={ORANGE} opacity={0.2} />
      <Rect width={200} height={130} y={15} radius={12} fill={ORANGE} opacity={0.4} />
      <Txt text={'📁'} fontSize={80} y={-10} />
      <Txt text={'my-project/'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} y={100} />
    </Node>
  );

  // .git folder appearing
  view.add(
    <Node ref={gitFolder} y={350} x={280} opacity={0} scale={0}>
      <Rect width={160} height={130} radius={12} fill={GREEN} opacity={0.2} />
      <Rect width={160} height={100} y={15} radius={12} fill={GREEN} opacity={0.4} />
      <Txt text={'📂'} fontSize={60} y={-10} />
      <Txt text={'.git/'} fill={GREEN} fontFamily={CODE_FONT} fontSize={28} fontWeight={700} y={80} />
    </Node>
  );

  // Bottom tip
  const tip = createRef<Txt>();
  view.add(
    <Txt
      ref={tip}
      text={'Creates a hidden .git folder\nto track your changes ✨'}
      fill={'#8b949e'}
      fontFamily={CODE_FONT}
      fontSize={30}
      y={600}
      textAlign={'center'}
      lineHeight={50}
      opacity={0}
    />
  );

  // CTA
  const cta = createRef<Txt>();
  view.add(
    <Txt
      ref={cta}
      text={'Follow for more Git tips! 🔥'}
      fill={ACCENT_COLOR}
      fontFamily={TITLE_FONT}
      fontSize={40}
      y={780}
      opacity={0}
    />
  );

  // === ANIMATION ===

  // Badge flies in
  yield* all(
    numberBadge().opacity(1, 0.3),
    numberBadge().scale(1, 0.5, easeOutCubic),
  );

  // Title types in
  yield* all(
    title().opacity(1, 0.4),
    title().y(-600, 0, easeOutCubic),
    title().y(-580, 0.5, easeOutCubic),
  );

  yield* subtitle().opacity(1, 0.4);

  yield* waitFor(0.3);

  // Terminal appears
  yield* all(
    terminal().opacity(1, 0.4),
    terminal().scale(1, 0.5, easeOutCubic),
  );

  yield* waitFor(0.3);

  // Type command
  yield* promptTxt().opacity(1, 0.2);
  const fullCommand = '$ git init';
  for (let i = 0; i <= fullCommand.length; i++) {
    promptTxt().text(fullCommand.slice(0, i) + '▌');
    yield* waitFor(0.06);
  }
  promptTxt().text(fullCommand);

  yield* waitFor(0.4);

  // Show output
  yield* all(
    outputLines[0].opacity(1, 0.3),
    outputLines[0].text('Initialized empty Git repository', 0.5),
  );
  yield* all(
    outputLines[1].opacity(1, 0.3),
    outputLines[1].text('in /my-project/.git/', 0.5),
  );

  yield* waitFor(0.5);

  // Show folder visualization
  yield* all(
    folderIcon().opacity(1, 0.4),
    folderIcon().scale(1, 0.5, easeOutCubic),
  );

  yield* waitFor(0.4);

  // .git folder pops in
  yield* all(
    gitFolder().opacity(1, 0.3),
    gitFolder().scale(1, 0.5, easeOutCubic),
  );

  // Arrow from folder to .git
  yield* waitFor(0.3);

  // Tip text
  yield* tip().opacity(1, 0.5);

  yield* waitFor(0.5);

  // CTA
  yield* cta().opacity(1, 0.5);

  yield* waitFor(2);
});
