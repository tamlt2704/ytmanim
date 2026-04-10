import {Rect, Txt, Circle, Line, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(
    <Txt ref={title}
      text={'⚛️ The Atom'}
      fill={RED} fontFamily={TITLE_FONT}
      fontSize={72} fontWeight={900}
      y={-800} opacity={0}
    />,
  );
  yield* fadeInUp(title(), 30, 0.4);

  const sizeLabel = createRef<Txt>();
  view.add(<Txt ref={sizeLabel} text={'~0.1 nanometers'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={32} y={-720} opacity={0} />);
  yield* fadeIn(sizeLabel(), 0.2);

  const sciLabel = createRef<Txt>();
  view.add(<Txt ref={sciLabel} text={'10⁻¹⁰ meters'} fill={RED} fontFamily={CODE_FONT} fontSize={40} fontWeight={800} y={-660} opacity={0} />);
  yield* fadeIn(sciLabel(), 0.2);

  // Atom visual — nucleus + orbit rings
  const atomY = -380;
  const nucleus = createRef<Circle>();
  view.add(<Circle ref={nucleus} x={0} y={atomY} size={50} fill={RED} opacity={0} scale={0} />);
  view.add(<Txt text={'+'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={30} fontWeight={900} x={0} y={atomY} />);
  yield* all(nucleus().opacity(1, 0.2), nucleus().scale(1, 0.3, easeOutBack));

  // Orbit rings
  const orbits = [120, 190, 260];
  for (let i = 0; i < orbits.length; i++) {
    const ring = createRef<Circle>();
    view.add(<Circle ref={ring} x={0} y={atomY} size={orbits[i]} fill={null} stroke={ACCENT_COLOR + '40'} lineWidth={2} lineDash={[8, 6]} opacity={0} />);
    yield* ring().opacity(1, 0.2);
  }

  // Electrons
  const electronPositions = [
    {x: 60, y: atomY - 0},
    {x: -40, y: atomY - 80},
    {x: 90, y: atomY + 60},
    {x: -120, y: atomY + 20},
    {x: 30, y: atomY + 110},
  ];
  for (const pos of electronPositions) {
    const e = createRef<Circle>();
    view.add(<Circle ref={e} x={pos.x} y={pos.y} size={18} fill={ACCENT_COLOR} opacity={0} scale={0} />);
    yield* all(e().opacity(1, 0.1), e().scale(1, 0.15, easeOutBack));
  }

  yield* waitFor(0.5);

  // Labels
  const nucLabel = createRef<Txt>();
  view.add(<Txt ref={nucLabel} text={'Nucleus\n(protons + neutrons)'} fill={RED} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} x={200} y={atomY - 30} textAlign={'center'} lineHeight={32} opacity={0} />);
  yield* fadeIn(nucLabel(), 0.2);

  const eLabel = createRef<Txt>();
  view.add(<Txt ref={eLabel} text={'Electrons'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} x={-220} y={atomY + 80} opacity={0} />);
  yield* fadeIn(eLabel(), 0.2);

  yield* waitFor(0.5);

  // Mind-blowing comparisons
  const comparisons = [
    {emoji: '📏', text: '1 million atoms fit across\na single human hair', color: ORANGE},
    {emoji: '⚡', text: 'Atoms are 99.9999%\nempty space', color: PURPLE},
    {emoji: '🌍', text: 'If an atom were the size\nof a stadium, the nucleus\nwould be a marble', color: GREEN},
  ];

  for (let i = 0; i < comparisons.length; i++) {
    const c = comparisons[i];
    const card = createRef<Rect>();
    view.add(
      <Rect ref={card}
        width={560} height={120} radius={16}
        fill={c.color + '12'} stroke={c.color} lineWidth={2}
        y={-120 + i * 140}
        opacity={0} scale={0}
      >
        <Txt text={c.emoji} fontSize={40} x={-230} />
        <Txt text={c.text} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} fontWeight={700} x={20} textAlign={'center'} lineHeight={36} />
      </Rect>,
    );
    yield* all(card().opacity(1, 0.2), card().scale(1, 0.3, easeOutBack));
    yield* waitFor(0.5);
  }

  const next = createRef<Txt>();
  view.add(<Txt ref={next} text={'Zoom out 10,000x →'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={380} opacity={0} />);
  yield* fadeIn(next(), 0.3);

  yield* waitFor(2);
});
