import {Rect, Txt, Circle, Line, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(
    <Txt ref={title}
      text={'🔬 The Cell'}
      fill={GREEN} fontFamily={TITLE_FONT}
      fontSize={72} fontWeight={900}
      y={-800} opacity={0}
    />,
  );
  yield* fadeInUp(title(), 30, 0.4);

  const sizeLabel = createRef<Txt>();
  view.add(<Txt ref={sizeLabel} text={'~10 micrometers'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={32} y={-720} opacity={0} />);
  yield* fadeIn(sizeLabel(), 0.2);

  const sciLabel = createRef<Txt>();
  view.add(<Txt ref={sciLabel} text={'10⁻⁵ meters'} fill={GREEN} fontFamily={CODE_FONT} fontSize={40} fontWeight={800} y={-660} opacity={0} />);
  yield* fadeIn(sciLabel(), 0.2);

  // Cell visual — outer membrane
  const cellY = -370;
  const membrane = createRef<Circle>();
  view.add(<Circle ref={membrane} x={0} y={cellY} size={300} fill={GREEN + '08'} stroke={GREEN} lineWidth={4} opacity={0} scale={0} />);
  yield* all(membrane().opacity(1, 0.3), membrane().scale(1, 0.4, easeOutBack));

  // Nucleus
  const nuc = createRef<Circle>();
  view.add(<Circle ref={nuc} x={0} y={cellY} size={100} fill={PURPLE + '20'} stroke={PURPLE} lineWidth={3} opacity={0} scale={0} />);
  yield* all(nuc().opacity(1, 0.2), nuc().scale(1, 0.3, easeOutBack));

  // DNA inside nucleus
  const dna = createRef<Txt>();
  view.add(<Txt ref={dna} text={'🧬'} fontSize={40} x={0} y={cellY} opacity={0} />);
  yield* dna().opacity(1, 0.2);

  // Organelles
  const organelles = [
    {x: -80, y: cellY - 60, size: 30, color: ORANGE, label: 'Mitochondria'},
    {x: 70, y: cellY - 50, size: 25, color: ACCENT_COLOR, label: 'Ribosome'},
    {x: -60, y: cellY + 70, size: 28, color: RED, label: 'Lysosome'},
    {x: 80, y: cellY + 60, size: 35, color: GREEN, label: 'ER'},
  ];

  for (const o of organelles) {
    const org = createRef<Circle>();
    view.add(<Circle ref={org} x={o.x} y={o.y} size={o.size} fill={o.color + '40'} stroke={o.color} lineWidth={2} opacity={0} scale={0} />);
    yield* all(org().opacity(1, 0.1), org().scale(1, 0.15, easeOutBack));
  }

  // Labels
  view.add(<Txt text={'Nucleus'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={22} fontWeight={700} x={180} y={cellY - 10} opacity={0.8} />);
  view.add(<Txt text={'Membrane'} fill={GREEN} fontFamily={CODE_FONT} fontSize={22} fontWeight={700} x={-210} y={cellY - 130} opacity={0.8} />);

  yield* waitFor(0.8);

  // Scale chain: atom → DNA → cell
  const chain = createRef<Rect>();
  view.add(
    <Rect ref={chain}
      width={560} height={80} radius={16}
      fill={'#21262d'} y={-150}
      opacity={0} scale={0}
    >
      <Txt text={'⚛️ Atom'} fill={RED} fontFamily={CODE_FONT} fontSize={22} fontWeight={700} x={-200} />
      <Txt text={'→'} fill={'#8b949e'} fontSize={24} x={-110} />
      <Txt text={'🧬 DNA'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={22} fontWeight={700} x={-40} />
      <Txt text={'→'} fill={'#8b949e'} fontSize={24} x={30} />
      <Txt text={'🔬 Cell'} fill={GREEN} fontFamily={CODE_FONT} fontSize={22} fontWeight={700} x={100} />
      <Txt text={'100,000x'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={18} fontWeight={800} x={210} />
    </Rect>,
  );
  yield* all(chain().opacity(1, 0.2), chain().scale(1, 0.3, easeOutBack));

  // Facts
  const facts = [
    {emoji: '🔢', text: '37.2 trillion cells\nin your body', color: ACCENT_COLOR},
    {emoji: '📏', text: 'DNA in one cell stretched\nout = 2 meters long', color: PURPLE},
    {emoji: '🔄', text: '3.8 million cells die\nevery second in your body', color: RED},
  ];

  for (let i = 0; i < facts.length; i++) {
    const f = facts[i];
    const card = createRef<Rect>();
    view.add(
      <Rect ref={card}
        width={560} height={105} radius={16}
        fill={f.color + '12'} stroke={f.color} lineWidth={2}
        y={-30 + i * 125}
        opacity={0} scale={0}
      >
        <Txt text={f.emoji} fontSize={38} x={-230} />
        <Txt text={f.text} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} fontWeight={700} x={20} textAlign={'center'} lineHeight={36} />
      </Rect>,
    );
    yield* all(card().opacity(1, 0.2), card().scale(1, 0.3, easeOutBack));
    yield* waitFor(0.5);
  }

  const next = createRef<Txt>();
  view.add(<Txt ref={next} text={'Zoom out 100,000x →'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={400} opacity={0} />);
  yield* fadeIn(next(), 0.3);

  yield* waitFor(2);
});
