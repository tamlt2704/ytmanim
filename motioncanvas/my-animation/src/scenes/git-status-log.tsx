import {Rect, Txt, Circle, makeScene2D, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray, sequence} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, TERMINAL_BORDER, CODE_FONT, TITLE_FONT, ORANGE, PURPLE} from '../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const numberBadge = createRef<Rect>();
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const terminal1 = createRef<Rect>();
  const terminal2 = createRef<Rect>();
  const statusLines = createRefArray<Txt>();
  const logLines = createRefArray<Txt>();
  const tip = createRef<Txt>();
  const cta = createRef<Txt>();

  view.add(
    <Rect ref={numberBadge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}>
      <Txt text={'#7'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} />
    </Rect>
  );

  view.add(<Txt ref={title} text={'status & log'} fill={GREEN} fontFamily={CODE_FONT} fontSize={85} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Check Your Progress'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={48} y={-490} opacity={0} />);

  // Terminal 1 - git status
  view.add(
    <Rect ref={terminal1} width={900} height={340} y={-220} radius={16} fill={TERMINAL_BG} stroke={TERMINAL_BORDER} lineWidth={2} opacity={0} scale={0.8} clip>
      <Rect width={900} height={50} y={-145} fill={'#21262d'}>
        <Circle size={16} fill={RED} x={-400} />
        <Circle size={16} fill={ORANGE} x={-370} />
        <Circle size={16} fill={GREEN} x={-340} />
        <Txt text={'git status'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={18} />
      </Rect>
      <Txt ref={statusLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={26} x={-410} y={-75} offsetX={-1} opacity={0} />
      <Txt ref={statusLines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={22} x={-410} y={-35} offsetX={-1} opacity={0} />
      <Txt ref={statusLines} text={''} fill={RED} fontFamily={CODE_FONT} fontSize={22} x={-410} y={0} offsetX={-1} opacity={0} />
      <Txt ref={statusLines} text={''} fill={RED} fontFamily={CODE_FONT} fontSize={22} x={-410} y={35} offsetX={-1} opacity={0} />
      <Txt ref={statusLines} text={''} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={22} x={-410} y={75} offsetX={-1} opacity={0} />
    </Rect>
  );

  // Terminal 2 - git log
  view.add(
    <Rect ref={terminal2} width={900} height={340} y={220} radius={16} fill={TERMINAL_BG} stroke={TERMINAL_BORDER} lineWidth={2} opacity={0} scale={0.8} clip>
      <Rect width={900} height={50} y={-145} fill={'#21262d'}>
        <Circle size={16} fill={RED} x={-400} />
        <Circle size={16} fill={ORANGE} x={-370} />
        <Circle size={16} fill={GREEN} x={-340} />
        <Txt text={'git log --oneline'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={18} />
      </Rect>
      <Txt ref={logLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={26} x={-410} y={-75} offsetX={-1} opacity={0} />
      <Txt ref={logLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} x={-410} y={-30} offsetX={-1} opacity={0} />
      <Txt ref={logLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} x={-410} y={10} offsetX={-1} opacity={0} />
      <Txt ref={logLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} x={-410} y={50} offsetX={-1} opacity={0} />
    </Rect>
  );

  view.add(<Txt ref={tip} text={'status = what changed\nlog = commit history 📋'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={520} textAlign={'center'} lineHeight={46} opacity={0} />);
  view.add(<Txt ref={cta} text={'Follow for more Git tips! 🔥'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={40} y={780} opacity={0} />);

  // === ANIMATION ===
  yield* all(numberBadge().opacity(1, 0.3), numberBadge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* waitFor(0.2);

  // Terminal 1 - status
  yield* all(terminal1().opacity(1, 0.4), terminal1().scale(1, 0.5, easeOutCubic));

  yield* statusLines[0].opacity(1, 0.2);
  const cmd1 = '$ git status';
  for (let i = 0; i <= cmd1.length; i++) {
    statusLines[0].text(cmd1.slice(0, i) + '▌');
    yield* waitFor(0.06);
  }
  statusLines[0].text(cmd1);
  yield* waitFor(0.2);

  yield* all(statusLines[1].opacity(1, 0.2), statusLines[1].text('  new file:   index.js', 0.3));
  yield* all(statusLines[2].opacity(1, 0.2), statusLines[2].text('  modified:   app.js', 0.3));
  yield* all(statusLines[3].opacity(1, 0.2), statusLines[3].text('  deleted:    old.js', 0.3));
  yield* all(statusLines[4].opacity(1, 0.2), statusLines[4].text('  untracked:  notes.txt', 0.3));

  yield* waitFor(0.4);

  // Terminal 2 - log
  yield* all(terminal2().opacity(1, 0.4), terminal2().scale(1, 0.5, easeOutCubic));

  yield* logLines[0].opacity(1, 0.2);
  const cmd2 = '$ git log --oneline';
  for (let i = 0; i <= cmd2.length; i++) {
    logLines[0].text(cmd2.slice(0, i) + '▌');
    yield* waitFor(0.05);
  }
  logLines[0].text(cmd2);
  yield* waitFor(0.2);

  yield* all(logLines[1].opacity(1, 0.2), logLines[1].text('abc1234 add login feature', 0.3));
  yield* all(logLines[2].opacity(1, 0.2), logLines[2].text('def5678 fix navbar bug', 0.3));
  yield* all(logLines[3].opacity(1, 0.2), logLines[3].text('ghi9012 initial commit', 0.3));

  yield* tip().opacity(1, 0.5);
  yield* waitFor(0.5);
  yield* cta().opacity(1, 0.5);
  yield* waitFor(2);
});
