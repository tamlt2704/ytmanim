import {Rect, Txt, Circle, makeScene2D, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, TERMINAL_BORDER, CODE_FONT, TITLE_FONT, ORANGE} from '../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const numberBadge = createRef<Rect>();
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const terminal = createRef<Rect>();
  const promptLines = createRefArray<Txt>();
  const tip = createRef<Txt>();
  const cta = createRef<Txt>();

  const entries = createRefArray<Rect>();
  const rescueBox = createRef<Rect>();
  const rescueLabel = createRef<Txt>();

  view.add(
    <Rect ref={numberBadge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}>
      <Txt text={'#10'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} />
    </Rect>
  );

  view.add(<Txt ref={title} text={'git reflog'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={100} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Your Safety Net'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={48} y={-490} opacity={0} />);

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

  // Reflog entries
  const reflogData = [
    {hash: 'a1b2c3d', action: 'commit: fix bug', color: TEXT_COLOR},
    {hash: 'e4f5g6h', action: 'reset: moving to HEAD~1', color: RED},
    {hash: 'i7j8k9l', action: 'commit: add feature', color: ORANGE},
    {hash: 'k0l1m2n', action: 'checkout: moving to main', color: TEXT_COLOR},
  ];

  for (let i = 0; i < reflogData.length; i++) {
    const d = reflogData[i];
    view.add(
      <Rect ref={entries} x={0} y={30 + i * 70} width={800} height={55} radius={10} fill={TERMINAL_BG} stroke={'#30363d'} lineWidth={1} opacity={0} scale={0.9}>
        <Txt text={`HEAD@{${i}}`} fill={ORANGE} fontFamily={CODE_FONT} fontSize={22} fontWeight={700} x={-310} />
        <Txt text={d.hash} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={20} x={-140} />
        <Txt text={d.action} fill={d.color} fontFamily={CODE_FONT} fontSize={22} x={100} />
      </Rect>
    );
  }

  // Rescue highlight on entry 2
  view.add(
    <Rect ref={rescueBox} x={0} y={30 + 2 * 70} width={820} height={60} radius={12} stroke={GREEN} lineWidth={3} opacity={0} />
  );
  view.add(<Txt ref={rescueLabel} text={'← recover this!'} fill={GREEN} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} x={0} y={30 + 2 * 70 + 45} opacity={0} />);

  view.add(<Txt ref={tip} text={'Undo accidental resets & deletes\\nNothing is truly lost 🛟'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={500} textAlign={'center'} lineHeight={46} opacity={0} />);
  view.add(<Txt ref={cta} text={'Follow for more Git tips! 🔥'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={40} y={780} opacity={0} />);

  // === ANIMATION ===
  yield* all(numberBadge().opacity(1, 0.3), numberBadge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* waitFor(0.2);

  yield* all(terminal().opacity(1, 0.4), terminal().scale(1, 0.5, easeOutCubic));

  yield* promptLines[0].opacity(1, 0.2);
  const cmd = '$ git reflog';
  for (let i = 0; i <= cmd.length; i++) {
    promptLines[0].text(cmd.slice(0, i) + '▌');
    yield* waitFor(0.06);
  }
  promptLines[0].text(cmd);
  yield* all(promptLines[1].opacity(1, 0.2), promptLines[1].text('Showing all HEAD movements ✓', 0.4));

  yield* waitFor(0.3);

  // Show reflog entries one by one
  for (let i = 0; i < 4; i++) {
    yield* all(entries[i].opacity(1, 0.2), entries[i].scale(1, 0.3, easeOutCubic));
    yield* waitFor(0.15);
  }

  yield* waitFor(0.4);

  // Highlight the recoverable commit
  yield* all(rescueBox().opacity(1, 0.4), rescueLabel().opacity(1, 0.4));

  yield* tip().opacity(1, 0.5);
  yield* waitFor(0.5);
  yield* cta().opacity(1, 0.5);
  yield* waitFor(2);
});
