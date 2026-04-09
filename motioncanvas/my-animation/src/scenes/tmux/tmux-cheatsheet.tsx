import {Rect, Txt, Line, Circle, makeScene2D, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray, easeInOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, TERMINAL_BORDER, CODE_FONT, TITLE_FONT, ORANGE, PURPLE, CYAN} from '../../styles';

function* typeText(ref: any, text: string, speed = 0.05) {
  for (let i = 0; i <= text.length; i++) {
    ref.text(text.slice(0, i) + '▌');
    yield* waitFor(speed);
  }
  ref.text(text);
}

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  // ===== TITLE CARD =====
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();

  view.add(<Txt ref={title} text={'tmux'} fill={GREEN} fontFamily={CODE_FONT} fontSize={120} fontWeight={800} y={-600} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Terminal Multiplexer Cheatsheet'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={44} y={-490} opacity={0} />);

  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* waitFor(0.5);

  // ===== SECTION 1: Sessions =====
  const sectionTitle = createRef<Txt>();
  view.add(<Txt ref={sectionTitle} text={''} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={52} fontWeight={800} y={-380} opacity={0} />);

  yield* all(sectionTitle().opacity(1, 0.3), sectionTitle().text('📦 Sessions', 0.3));

  // Terminal for sessions
  const term1 = createRef<Rect>();
  const t1Lines = createRefArray<Txt>();

  view.add(
    <Rect ref={term1} width={900} height={500} y={0} radius={16} fill={TERMINAL_BG} stroke={TERMINAL_BORDER} lineWidth={2} opacity={0} scale={0.8} clip>
      <Rect width={900} height={50} y={-225} fill={'#21262d'}>
        <Circle size={16} fill={RED} x={-400} />
        <Circle size={16} fill={ORANGE} x={-370} />
        <Circle size={16} fill={GREEN} x={-340} />
        <Txt text={'Terminal'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={18} />
      </Rect>
      <Txt ref={t1Lines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={26} x={-410} y={-140} offsetX={-1} opacity={0} />
      <Txt ref={t1Lines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={22} x={-410} y={-90} offsetX={-1} opacity={0} />
      <Txt ref={t1Lines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={26} x={-410} y={-30} offsetX={-1} opacity={0} />
      <Txt ref={t1Lines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={22} x={-410} y={20} offsetX={-1} opacity={0} />
      <Txt ref={t1Lines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={26} x={-410} y={80} offsetX={-1} opacity={0} />
      <Txt ref={t1Lines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={22} x={-410} y={130} offsetX={-1} opacity={0} />
    </Rect>
  );

  // Session boxes visualization
  const sessionBoxes = createRefArray<Rect>();
  const sessionData = [
    {name: 'dev', color: GREEN, x: -250},
    {name: 'deploy', color: ORANGE, x: 0},
    {name: 'logs', color: ACCENT_COLOR, x: 250},
  ];
  for (const s of sessionData) {
    view.add(
      <Rect ref={sessionBoxes} x={s.x} y={500} width={180} height={90} radius={14} fill={s.color} opacity={0} scale={0}>
        <Txt text={'🖥️'} fontSize={28} y={-14} />
        <Txt text={s.name} fill={'#fff'} fontFamily={CODE_FONT} fontSize={20} fontWeight={700} y={22} />
      </Rect>
    );
  }

  yield* all(term1().opacity(1, 0.4), term1().scale(1, 0.5, easeOutCubic));

  // tmux new -s dev
  yield* t1Lines[0].opacity(1, 0.2);
  yield* typeText(t1Lines[0], '$ tmux new -s dev');
  yield* all(t1Lines[1].opacity(1, 0.2), t1Lines[1].text('Create named session ✓', 0.4));
  yield* waitFor(0.3);

  // tmux ls
  yield* t1Lines[2].opacity(1, 0.2);
  yield* typeText(t1Lines[2], '$ tmux ls');
  yield* all(t1Lines[3].opacity(1, 0.2), t1Lines[3].text('dev: 1 windows (attached)', 0.4));
  yield* waitFor(0.3);

  // tmux detach
  yield* t1Lines[4].opacity(1, 0.2);
  yield* typeText(t1Lines[4], '$ Ctrl+b  d');
  yield* all(t1Lines[5].opacity(1, 0.2), t1Lines[5].text('Detached from session ✓', 0.4));

  // Show session boxes
  yield* waitFor(0.3);
  for (let i = 0; i < 3; i++) {
    yield* all(sessionBoxes[i].opacity(1, 0.2), sessionBoxes[i].scale(1, 0.3, easeOutCubic));
  }

  const sessionTip = createRef<Txt>();
  view.add(<Txt ref={sessionTip} text={'Sessions persist even after disconnect!'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={26} y={620} opacity={0} />);
  yield* sessionTip().opacity(1, 0.4);

  yield* waitFor(1.5);

  // Fade out section 1
  yield* all(
    term1().opacity(0, 0.4),
    sectionTitle().opacity(0, 0.3),
    sessionTip().opacity(0, 0.3),
    ...sessionBoxes.map(b => b.opacity(0, 0.3)),
  );

  // ===== SECTION 2: Windows & Panes =====
  yield* sectionTitle().text('');
  yield* all(sectionTitle().opacity(1, 0.3), sectionTitle().text('🪟 Windows & Panes', 0.3));

  // Tmux window visualization
  const tmuxFrame = createRef<Rect>();
  const pane1 = createRef<Rect>();
  const pane2 = createRef<Rect>();
  const pane3 = createRef<Rect>();
  const statusBar = createRef<Rect>();
  const splitLine1 = createRef<Line>();
  const splitLine2 = createRef<Line>();

  view.add(
    <Rect ref={tmuxFrame} width={860} height={600} y={50} radius={16} fill={TERMINAL_BG} stroke={GREEN} lineWidth={3} opacity={0} scale={0.8} clip>
      {/* Status bar at bottom */}
      <Rect ref={statusBar} width={860} height={40} y={280} fill={GREEN} opacity={0.9}>
        <Txt text={'[dev] 0:vim  1:server  2:logs'} fill={'#000'} fontFamily={CODE_FONT} fontSize={20} fontWeight={700} />
      </Rect>

      {/* Single pane initially */}
      <Rect ref={pane1} width={840} height={540} y={-10} fill={TERMINAL_BG} radius={4}>
        <Txt text={'$ vim app.js'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={24} x={-350} y={-200} offsetX={-1} />
        <Txt text={'~'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={24} x={-350} y={-160} offsetX={-1} />
        <Txt text={'~'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={24} x={-350} y={-120} offsetX={-1} />
      </Rect>

      {/* Pane 2 (right) - hidden initially */}
      <Rect ref={pane2} width={0} height={540} x={210} y={-10} fill={'#1a2332'} radius={4} opacity={0}>
        <Txt text={'$ node server.js'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={20} x={-150} y={-200} offsetX={-1} />
        <Txt text={'Listening on :3000'} fill={GREEN} fontFamily={CODE_FONT} fontSize={18} x={-150} y={-160} offsetX={-1} />
      </Rect>

      {/* Pane 3 (bottom right) - hidden initially */}
      <Rect ref={pane3} width={0} height={0} x={210} y={150} fill={'#1e2a3a'} radius={4} opacity={0}>
        <Txt text={'$ tail -f app.log'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={18} x={-150} y={-60} offsetX={-1} />
      </Rect>

      {/* Split lines */}
      <Line ref={splitLine1} points={[[0, -280], [0, 260]]} stroke={GREEN} lineWidth={2} x={-10} opacity={0} />
      <Line ref={splitLine2} points={[[-10, 0], [420, 0]]} stroke={GREEN} lineWidth={2} x={-10} y={0} opacity={0} />
    </Rect>
  );

  yield* all(tmuxFrame().opacity(1, 0.4), tmuxFrame().scale(1, 0.5, easeOutCubic));
  yield* waitFor(0.5);

  // Show shortcut for vertical split
  const shortcut = createRef<Txt>();
  view.add(<Txt ref={shortcut} text={''} fill={ORANGE} fontFamily={CODE_FONT} fontSize={36} fontWeight={800} y={450} opacity={0} />);

  yield* all(shortcut().opacity(1, 0.3), shortcut().text('Ctrl+b  %  → Vertical Split', 0.3));
  yield* waitFor(0.3);

  // Animate vertical split
  yield* all(
    pane1().width(410, 0.5, easeInOutCubic),
    pane1().x(-215, 0.5, easeInOutCubic),
    pane2().opacity(1, 0.3),
    pane2().width(410, 0.5, easeInOutCubic),
    splitLine1().opacity(1, 0.3),
  );

  yield* waitFor(0.5);

  // Horizontal split
  yield* shortcut().text('Ctrl+b  "  → Horizontal Split', 0.3);
  yield* waitFor(0.3);

  yield* all(
    pane2().height(260, 0.5, easeInOutCubic),
    pane2().y(-140, 0.5, easeInOutCubic),
    pane3().opacity(1, 0.3),
    pane3().width(410, 0.5, easeInOutCubic),
    pane3().height(260, 0.5, easeInOutCubic),
    splitLine2().opacity(1, 0.3),
  );

  yield* waitFor(0.5);

  // Navigate panes
  yield* shortcut().text('Ctrl+b  ←↑↓→  → Navigate Panes', 0.3);
  yield* waitFor(1);

  // Resize
  yield* shortcut().text('Ctrl+b  Ctrl+←→  → Resize Pane', 0.3);
  yield* waitFor(1);

  // Fade out section 2
  yield* all(
    tmuxFrame().opacity(0, 0.4),
    sectionTitle().opacity(0, 0.3),
    shortcut().opacity(0, 0.3),
  );

  // ===== SECTION 3: Key Shortcuts =====
  yield* sectionTitle().text('');
  yield* all(sectionTitle().opacity(1, 0.3), sectionTitle().text('⌨️ Essential Shortcuts', 0.3));

  const shortcuts = [
    {key: 'Ctrl+b  c', desc: 'New window', color: GREEN},
    {key: 'Ctrl+b  n / p', desc: 'Next / Prev window', color: ACCENT_COLOR},
    {key: 'Ctrl+b  ,', desc: 'Rename window', color: ORANGE},
    {key: 'Ctrl+b  w', desc: 'List windows', color: PURPLE},
    {key: 'Ctrl+b  d', desc: 'Detach session', color: RED},
    {key: 'Ctrl+b  z', desc: 'Zoom pane (toggle)', color: CYAN},
    {key: 'Ctrl+b  [', desc: 'Scroll mode', color: ACCENT_COLOR},
    {key: 'Ctrl+b  x', desc: 'Kill pane', color: RED},
  ];

  const shortcutCards = createRefArray<Rect>();
  for (let i = 0; i < shortcuts.length; i++) {
    const s = shortcuts[i];
    const row = Math.floor(i / 2);
    const col = i % 2;
    view.add(
      <Rect
        ref={shortcutCards}
        x={col === 0 ? -230 : 230}
        y={-200 + row * 130}
        width={420} height={110}
        radius={14}
        fill={TERMINAL_BG}
        stroke={s.color}
        lineWidth={2}
        opacity={0}
        scale={0.8}
      >
        <Txt text={s.key} fill={s.color} fontFamily={CODE_FONT} fontSize={26} fontWeight={800} y={-18} />
        <Txt text={s.desc} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} y={22} />
      </Rect>
    );
  }

  // Animate cards in pairs
  for (let row = 0; row < 4; row++) {
    const i = row * 2;
    yield* all(
      shortcutCards[i].opacity(1, 0.3),
      shortcutCards[i].scale(1, 0.4, easeOutCubic),
      shortcutCards[i + 1].opacity(1, 0.3),
      shortcutCards[i + 1].scale(1, 0.4, easeOutCubic),
    );
    yield* waitFor(0.3);
  }

  yield* waitFor(1.5);

  // Fade out section 3
  yield* all(
    sectionTitle().opacity(0, 0.3),
    ...shortcutCards.map(c => c.opacity(0, 0.3)),
  );

  // ===== SECTION 4: Pro Tips =====
  yield* sectionTitle().text('');
  yield* all(sectionTitle().opacity(1, 0.3), sectionTitle().text('🚀 Pro Tips', 0.3));

  const tips = [
    {text: 'tmux attach -t dev', desc: 'Reattach to session', color: GREEN},
    {text: 'tmux kill-session -t old', desc: 'Kill a session', color: RED},
    {text: 'tmux new -s work -d', desc: 'Create detached session', color: ORANGE},
    {text: '~/.tmux.conf', desc: 'Customize everything!', color: PURPLE},
  ];

  const tipCards = createRefArray<Rect>();
  for (let i = 0; i < tips.length; i++) {
    const t = tips[i];
    view.add(
      <Rect ref={tipCards} x={0} y={-150 + i * 140} width={800} height={110} radius={14} fill={TERMINAL_BG} stroke={t.color} lineWidth={2} opacity={0} scale={0.8}>
        <Txt text={t.text} fill={t.color} fontFamily={CODE_FONT} fontSize={30} fontWeight={800} y={-16} />
        <Txt text={t.desc} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={22} y={24} />
      </Rect>
    );
  }

  for (let i = 0; i < tips.length; i++) {
    yield* all(tipCards[i].opacity(1, 0.3), tipCards[i].scale(1, 0.4, easeOutCubic));
    yield* waitFor(0.3);
  }

  yield* waitFor(1);

  // Fade out
  yield* all(
    sectionTitle().opacity(0, 0.3),
    ...tipCards.map(c => c.opacity(0, 0.3)),
  );

  // ===== CTA =====
  const endTitle = createRef<Txt>();
  const cta = createRef<Txt>();
  view.add(<Txt ref={endTitle} text={'tmux = Productivity 🔥'} fill={GREEN} fontFamily={TITLE_FONT} fontSize={60} fontWeight={800} y={-100} opacity={0} />);
  view.add(<Txt ref={cta} text={'Follow for more dev tips!'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={44} y={50} opacity={0} />);

  yield* all(endTitle().opacity(1, 0.5), endTitle().y(-80, 0.5, easeOutCubic));
  yield* cta().opacity(1, 0.5);

  // Fade out title/subtitle at top
  yield* all(title().opacity(0, 0.3), subtitle().opacity(0, 0.3));

  yield* waitFor(2);
});
