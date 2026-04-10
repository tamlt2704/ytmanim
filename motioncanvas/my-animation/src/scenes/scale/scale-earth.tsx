import {Rect, Txt, Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(
    <Txt ref={title}
      text={'🌍 Earth'}
      fill={ACCENT_COLOR} fontFamily={TITLE_FONT}
      fontSize={72} fontWeight={900}
      y={-800} opacity={0}
    />,
  );
  yield* fadeInUp(title(), 30, 0.4);

  const sizeLabel = createRef<Txt>();
  view.add(<Txt ref={sizeLabel} text={'12,742 km diameter'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={32} y={-720} opacity={0} />);
  yield* fadeIn(sizeLabel(), 0.2);

  const sciLabel = createRef<Txt>();
  view.add(<Txt ref={sciLabel} text={'10⁷ meters'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={40} fontWeight={800} y={-660} opacity={0} />);
  yield* fadeIn(sciLabel(), 0.2);

  // Planet size comparison — circles to scale (relative)
  const planetY = -380;
  const planets = [
    {name: 'Mercury', size: 16, color: '#8b949e', x: -300},
    {name: 'Mars', size: 22, color: RED, x: -200},
    {name: 'Venus', size: 40, color: ORANGE, x: -90},
    {name: 'Earth', size: 42, color: ACCENT_COLOR, x: 20},
    {name: 'Neptune', size: 65, color: '#4a8ad4', x: 150},
    {name: 'Jupiter', size: 150, color: '#b8862e', x: 340},
  ];

  for (const p of planets) {
    const planet = createRef<Circle>();
    view.add(<Circle ref={planet} x={p.x} y={planetY} size={p.size} fill={p.color + '30'} stroke={p.color} lineWidth={2} opacity={0} scale={0} />);
    yield* all(planet().opacity(1, 0.15), planet().scale(1, 0.25, easeOutBack));

    view.add(<Txt text={p.name} fill={p.color} fontFamily={CODE_FONT} fontSize={16} fontWeight={700} x={p.x} y={planetY + p.size / 2 + 18} opacity={0.8} />);
    yield* waitFor(0.15);
  }

  yield* waitFor(0.5);

  // Earth vs Sun teaser
  const vsCard = createRef<Rect>();
  view.add(
    <Rect ref={vsCard}
      width={560} height={90} radius={16}
      fill={ORANGE + '12'} stroke={ORANGE} lineWidth={2}
      y={-210} opacity={0} scale={0}
    >
      <Txt text={'☀️ The Sun is 109x wider than Earth'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} fontWeight={700} />
    </Rect>,
  );
  yield* all(vsCard().opacity(1, 0.2), vsCard().scale(1, 0.3, easeOutBack));
  yield* waitFor(0.5);

  // Earth facts
  const facts = [
    {emoji: '🧑', text: '7.5 million humans\nstacked = Earth\'s diameter', color: GREEN},
    {emoji: '🌊', text: '71% of Earth\'s surface\nis covered by water', color: ACCENT_COLOR},
    {emoji: '🏃', text: 'Walking non-stop around\nEarth = 1 year, 2 months', color: ORANGE},
    {emoji: '💡', text: 'Light crosses Earth\nin just 0.04 seconds', color: PURPLE},
  ];

  for (let i = 0; i < facts.length; i++) {
    const f = facts[i];
    const card = createRef<Rect>();
    view.add(
      <Rect ref={card}
        width={560} height={105} radius={16}
        fill={f.color + '12'} stroke={f.color} lineWidth={2}
        y={-90 + i * 125}
        opacity={0} scale={0}
      >
        <Txt text={f.emoji} fontSize={38} x={-230} />
        <Txt text={f.text} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} x={20} textAlign={'center'} lineHeight={34} />
      </Rect>,
    );
    yield* all(card().opacity(1, 0.2), card().scale(1, 0.3, easeOutBack));
    yield* waitFor(0.4);
  }

  const next = createRef<Txt>();
  view.add(<Txt ref={next} text={'Zoom out 100x →'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={440} opacity={0} />);
  yield* fadeIn(next(), 0.3);

  yield* waitFor(2);
});
