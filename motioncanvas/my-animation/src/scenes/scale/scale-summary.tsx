import {Rect, Txt, Line, Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(
    <Txt ref={title}
      text={'THE FULL SCALE'}
      fill={TEXT_COLOR} fontFamily={TITLE_FONT}
      fontSize={64} fontWeight={900}
      y={-820} letterSpacing={6} opacity={0}
    />,
  );
  yield* fadeInUp(title(), 30, 0.4);

  // Vertical scale line
  const lineX = -220;
  const lineTop = -720;
  const lineBot = 350;
  const scaleLine = createRef<Line>();
  view.add(<Line ref={scaleLine} points={[[lineX, lineTop], [lineX, lineBot]]} stroke={'#30363d'} lineWidth={3} end={0} />);
  yield* scaleLine().end(1, 0.5, easeOutCubic);

  const levels = [
    {emoji: '⚛️', name: 'Atom', size: '0.1 nm', power: '10⁻¹⁰', color: RED},
    {emoji: '🧬', name: 'DNA', size: '2 nm', power: '10⁻⁹', color: ORANGE},
    {emoji: '🔬', name: 'Cell', size: '10 μm', power: '10⁻⁵', color: GREEN},
    {emoji: '🧑', name: 'Human', size: '1.7 m', power: '10⁰', color: TEXT_COLOR},
    {emoji: '🌍', name: 'Earth', size: '12,742 km', power: '10⁷', color: ACCENT_COLOR},
    {emoji: '☀️', name: 'Sun', size: '1.4M km', power: '10⁹', color: ORANGE},
    {emoji: '🪐', name: 'Solar System', size: '9B km', power: '10¹³', color: GREEN},
    {emoji: '🌌', name: 'Milky Way', size: '100K ly', power: '10²¹', color: PURPLE},
    {emoji: '✨', name: 'Universe', size: '93B ly', power: '10²⁶', color: ACCENT_COLOR},
  ];

  const spacing = (lineBot - lineTop) / (levels.length - 1);

  for (let i = 0; i < levels.length; i++) {
    const l = levels[i];
    const y = lineTop + i * spacing;

    // Dot on line
    const dot = createRef<Circle>();
    view.add(<Circle ref={dot} x={lineX} y={y} size={14} fill={l.color} opacity={0} scale={0} />);

    // Emoji + name
    const label = createRef<Txt>();
    view.add(<Txt ref={label} text={`${l.emoji} ${l.name}`} fill={l.color} fontFamily={CODE_FONT} fontSize={26} fontWeight={800} x={lineX + 100} y={y - 14} opacity={0} />);

    // Size + power
    const detail = createRef<Txt>();
    view.add(<Txt ref={detail} text={`${l.size}  (${l.power} m)`} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={20} x={lineX + 100} y={y + 12} opacity={0} />);

    yield* all(
      dot().opacity(1, 0.1), dot().scale(1, 0.2, easeOutBack),
      label().opacity(1, 0.15),
      detail().opacity(1, 0.15),
    );
    yield* waitFor(0.3);
  }

  yield* waitFor(0.5);

  // Total span
  const spanCard = createRef<Rect>();
  view.add(
    <Rect ref={spanCard}
      width={560} height={120} radius={20}
      fill={PURPLE + '12'} stroke={PURPLE} lineWidth={3}
      y={450} opacity={0} scale={0}
    >
      <Txt text={'36 orders of magnitude'} fill={PURPLE} fontFamily={TITLE_FONT} fontSize={36} fontWeight={900} y={-20} />
      <Txt text={'from atom to observable universe'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} y={25} />
    </Rect>,
  );
  yield* all(spanCard().opacity(1, 0.2), spanCard().scale(1, 0.3, easeOutBack));
  yield* pulse(spanCard() as any, 1.05, 0.3);

  const lesson = createRef<Txt>();
  view.add(
    <Txt ref={lesson}
      text={'You are exactly in the middle\nof the smallest and largest\nthings we know ✨'}
      fill={ACCENT_COLOR} fontFamily={TITLE_FONT}
      fontSize={32} fontWeight={800}
      y={580} textAlign={'center'} lineHeight={46}
      opacity={0}
    />,
  );
  yield* fadeInUp(lesson(), 20, 0.3);

  yield* waitFor(2.5);
});
