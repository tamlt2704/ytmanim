import {Rect, Txt, Circle, makeScene2D, Node, Line} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, TERMINAL_BORDER, CODE_FONT, TITLE_FONT, ORANGE, PURPLE} from '../../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const numberBadge = createRef<Rect>();
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const terminal = createRef<Rect>();
  const promptTxt = createRef<Txt>();
  const outputLines = createRefArray<Txt>();
  const cloudIcon = createRef<Node>();
  const localIcon = createRef<Node>();
  const arrow = createRef<Line>();
  const tip = createRef<Txt>();
  const cta = createRef<Txt>();

  // Badge
  view.add(
    <Rect ref={numberBadge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}>
      <Txt text={'#2'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} />
    </Rect>
  );

  view.add(<Txt ref={title} text={'git clone'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={100} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Copy a Remote Repo'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={48} y={-490} opacity={0} />);

  // Terminal
  view.add(
    <Rect ref={terminal} width={900} height={400} y={-150} radius={16} fill={TERMINAL_BG} stroke={TERMINAL_BORDER} lineWidth={2} opacity={0} scale={0.8} clip>
      <Rect width={900} height={50} y={-175} fill={'#21262d'}>
        <Circle size={16} fill={RED} x={-400} />
        <Circle size={16} fill={ORANGE} x={-370} />
        <Circle size={16} fill={GREEN} x={-340} />
        <Txt text={'Terminal'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={18} />
      </Rect>
      <Txt ref={promptTxt} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} x={-410} y={-80} offsetX={-1} opacity={0} />
      <Txt ref={outputLines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={22} x={-410} y={-20} offsetX={-1} opacity={0} />
      <Txt ref={outputLines} text={''} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={22} x={-410} y={20} offsetX={-1} opacity={0} />
      <Txt ref={outputLines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={22} x={-410} y={60} offsetX={-1} opacity={0} />
    </Rect>
  );

  // Cloud (remote) icon
  view.add(
    <Node ref={cloudIcon} x={-250} y={380} opacity={0} scale={0}>
      <Rect width={200} height={150} radius={16} fill={ACCENT_COLOR} opacity={0.15} />
      <Txt text={'☁️'} fontSize={70} y={-15} />
      <Txt text={'GitHub'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={24} y={60} />
    </Node>
  );

  // Arrow
  view.add(
    <Line
      ref={arrow}
      points={[[-120, 380], [120, 380]]}
      stroke={GREEN}
      lineWidth={6}
      endArrow
      arrowSize={16}
      opacity={0}
      end={0}
    />
  );

  // Local folder icon
  view.add(
    <Node ref={localIcon} x={250} y={380} opacity={0} scale={0}>
      <Rect width={200} height={150} radius={16} fill={GREEN} opacity={0.15} />
      <Txt text={'💻'} fontSize={70} y={-15} />
      <Txt text={'Local'} fill={GREEN} fontFamily={CODE_FONT} fontSize={24} y={60} />
    </Node>
  );

  view.add(<Txt ref={tip} text={'Downloads the entire repo\nwith full history 📦'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={570} textAlign={'center'} lineHeight={50} opacity={0} />);
  view.add(<Txt ref={cta} text={'Follow for more Git tips! 🔥'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={40} y={780} opacity={0} />);

  // === ANIMATION ===
  yield* all(numberBadge().opacity(1, 0.3), numberBadge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* waitFor(0.3);

  yield* all(terminal().opacity(1, 0.4), terminal().scale(1, 0.5, easeOutCubic));
  yield* waitFor(0.2);

  // Type command
  yield* promptTxt().opacity(1, 0.2);
  const cmd = '$ git clone https://github.com/user/repo.git';
  for (let i = 0; i <= cmd.length; i++) {
    promptTxt().text(cmd.slice(0, i) + '▌');
    yield* waitFor(0.04);
  }
  promptTxt().text(cmd);
  yield* waitFor(0.3);

  yield* all(outputLines[0].opacity(1, 0.2), outputLines[0].text("Cloning into \'repo\'...", 0.4));
  yield* all(outputLines[1].opacity(1, 0.2), outputLines[1].text('remote: Counting objects: 142', 0.4));
  yield* all(outputLines[2].opacity(1, 0.2), outputLines[2].text('Receiving objects: 100% ✓', 0.4));

  yield* waitFor(0.4);

  // Cloud appears
  yield* all(cloudIcon().opacity(1, 0.3), cloudIcon().scale(1, 0.5, easeOutCubic));
  yield* waitFor(0.2);

  // Arrow animates
  yield* all(arrow().opacity(1, 0.2), arrow().end(1, 0.8));
  yield* waitFor(0.2);

  // Local appears
  yield* all(localIcon().opacity(1, 0.3), localIcon().scale(1, 0.5, easeOutCubic));

  yield* tip().opacity(1, 0.5);
  yield* waitFor(0.5);
  yield* cta().opacity(1, 0.5);
  yield* waitFor(2);
});
