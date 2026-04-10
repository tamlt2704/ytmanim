import {Rect, Txt, Line, Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(
    <Txt ref={title}
      text={'How Big Is\nEverything?'}
      fill={TEXT_COLOR} fontFamily={TITLE_FONT}
      fontSize={80} fontWeight={900}
      y={-780} textAlign={'center'} lineHeight={90}
      opacity={0}
    />,
  );
  yield* fadeInUp(title(), 30, 0.4);

  const hook = createRef<Txt>();
  view.add(
    <Txt ref={hook}
      text={'The universe spans\n62 orders of magnitude\nfrom atoms to the cosmos'}
      fill={ACCENT_COLOR} fontFamily={CODE_FONT}
      fontSize={36} fontWeight={700}
      y={-570} textAlign={'center'} lineHeight={50}
      opacity={0}
    />,
  );
  yield* fadeInUp(hook(), 20, 0.4);
  yield* waitFor(1);

  // Scale bar — vertical line with markers
  const barX = -200;
  const barTop = -400;
  const barBot = 300;
  const bar = createRef<Line>();
  view.add(<Line ref={bar} points={[[barX, barTop], [barX, barBot]]} stroke={'#30363d'} lineWidth={3} endArrow arrowSize={10} end={0} />);
  yield* bar().end(1, 0.6, easeOutCubic);

  const levels = [
    {label: 'Atom', size: '10⁻¹⁰ m', emoji: '⚛️', color: RED},
    {label: 'DNA', size: '10⁻⁹ m', emoji: '🧬', color: ORANGE},
    {label: 'Cell', size: '10⁻⁵ m', emoji: '🔬', color: GREEN},
    {label: 'Human', size: '10⁰ m', emoji: '🧑', color: TEXT_COLOR},
    {label: 'Earth', size: '10⁷ m', emoji: '🌍', color: ACCENT_COLOR},
    {label: 'Sun', size: '10⁹ m', emoji: '☀️', color: ORANGE},
    {label: 'Solar System', size: '10¹³ m', emoji: '🪐', color: GREEN},
    {label: 'Galaxy', size: '10²¹ m', emoji: '🌌', color: PURPLE},
    {label: 'Universe', size: '10²⁶ m', emoji: '✨', color: ACCENT_COLOR},
  ];

  const spacing = (barBot - barTop) / (levels.length - 1);

  for (let i = 0; i < levels.length; i++) {
    const l = levels[i];
    const y = barTop + i * spacing;

    // Tick mark
    const tick = createRef<Line>();
    view.add(<Line ref={tick} points={[[barX - 10, y], [barX + 10, y]]} stroke={l.color} lineWidth={3} opacity={0} />);

    // Dot
    const dot = createRef<Circle>();
    view.add(<Circle ref={dot} x={barX} y={y} size={14} fill={l.color} opacity={0} scale={0} />);

    // Label
    const label = createRef<Txt>();
    view.add(<Txt ref={label} text={`${l.emoji} ${l.label}`} fill={l.color} fontFamily={CODE_FONT} fontSize={28} fontWeight={700} x={barX + 130} y={y - 12} opacity={0} />);

    const sizeLabel = createRef<Txt>();
    view.add(<Txt ref={sizeLabel} text={l.size} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={22} x={barX + 130} y={y + 14} opacity={0} />);

    yield* all(
      tick().opacity(1, 0.1),
      dot().opacity(1, 0.15), dot().scale(1, 0.2, easeOutBack),
      label().opacity(1, 0.15),
      sizeLabel().opacity(1, 0.15),
    );
    yield* waitFor(0.3);
  }

  yield* waitFor(0.5);

  const cta = createRef<Txt>();
  view.add(
    <Txt ref={cta}
      text={"Let's zoom through\neach level 🔭"}
      fill={GREEN} fontFamily={TITLE_FONT}
      fontSize={40} fontWeight={800}
      y={440} textAlign={'center'} lineHeight={56}
      opacity={0}
    />,
  );
  yield* fadeInUp(cta(), 20, 0.3);
  yield* pulse(cta() as any, 1.05, 0.3);

  yield* waitFor(2);
});
