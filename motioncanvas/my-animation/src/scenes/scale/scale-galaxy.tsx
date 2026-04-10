import {Rect, Txt, Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(
    <Txt ref={title}
      text={'🌌 The Galaxy'}
      fill={PURPLE} fontFamily={TITLE_FONT}
      fontSize={72} fontWeight={900}
      y={-800} opacity={0}
    />,
  );
  yield* fadeInUp(title(), 30, 0.4);

  const sizeLabel = createRef<Txt>();
  view.add(<Txt ref={sizeLabel} text={'100,000 light-years across'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={32} y={-720} opacity={0} />);
  yield* fadeIn(sizeLabel(), 0.2);

  const sciLabel = createRef<Txt>();
  view.add(<Txt ref={sciLabel} text={'10²¹ meters'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={40} fontWeight={800} y={-660} opacity={0} />);
  yield* fadeIn(sciLabel(), 0.2);

  // Galaxy visual — ellipse with spiral dots
  const gx = 0, gy = -380;

  // Outer glow
  const glow = createRef<Circle>();
  view.add(<Circle ref={glow} x={gx} y={gy} size={350} fill={PURPLE} opacity={0} />);
  yield* glow().opacity(0.04, 0.3);

  // Disk shape (flattened ellipse)
  const disk = createRef<Rect>();
  view.add(<Rect ref={disk} x={gx} y={gy} width={380} height={120} radius={60} fill={PURPLE + '10'} stroke={PURPLE + '40'} lineWidth={2} opacity={0} />);
  yield* disk().opacity(1, 0.3);

  // Center bulge
  const bulge = createRef<Circle>();
  view.add(<Circle ref={bulge} x={gx} y={gy} size={80} fill={PURPLE + '25'} stroke={PURPLE} lineWidth={2} opacity={0} scale={0} />);
  yield* all(bulge().opacity(1, 0.2), bulge().scale(1, 0.3, easeOutBack));

  // Scatter stars
  let seed = 77;
  const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  for (let i = 0; i < 60; i++) {
    const angle = rand() * Math.PI * 2;
    const dist = rand() * 170;
    const sx = gx + Math.cos(angle) * dist;
    const sy = gy + Math.sin(angle) * dist * 0.35; // flatten
    const starSize = 2 + rand() * 4;
    const colors = [TEXT_COLOR, ACCENT_COLOR, ORANGE, PURPLE, '#ffffff'];
    const c = colors[Math.floor(rand() * colors.length)];
    view.add(<Circle x={sx} y={sy} size={starSize} fill={c} opacity={0.3 + rand() * 0.5} />);
  }

  // "You are here" marker
  const youX = gx + 80, youY = gy + 15;
  const youDot = createRef<Circle>();
  view.add(<Circle ref={youDot} x={youX} y={youY} size={10} fill={GREEN} opacity={0} scale={0} />);
  yield* all(youDot().opacity(1, 0.2), youDot().scale(1, 0.3, easeOutBack));
  const youLabel = createRef<Txt>();
  view.add(<Txt ref={youLabel} text={'← You are here'} fill={GREEN} fontFamily={CODE_FONT} fontSize={22} fontWeight={700} x={youX + 100} y={youY} opacity={0} />);
  yield* fadeIn(youLabel(), 0.2);

  yield* waitFor(0.8);

  // Facts
  const facts = [
    {emoji: '⭐', text: '100–400 billion stars\nin the Milky Way alone', color: ORANGE},
    {emoji: '🪐', text: 'Estimated 100 billion\nplanets in our galaxy', color: GREEN},
    {emoji: '🌀', text: 'Our solar system orbits\nthe center at 828,000 km/h', color: ACCENT_COLOR},
    {emoji: '⏱️', text: 'One full orbit takes\n225 million years', color: PURPLE},
    {emoji: '🔭', text: 'Nearest galaxy (Andromeda)\nis 2.5 million light-years away', color: RED},
  ];

  for (let i = 0; i < facts.length; i++) {
    const f = facts[i];
    const card = createRef<Rect>();
    view.add(
      <Rect ref={card}
        width={560} height={100} radius={16}
        fill={f.color + '12'} stroke={f.color} lineWidth={2}
        y={-200 + i * 120}
        opacity={0} scale={0}
      >
        <Txt text={f.emoji} fontSize={36} x={-230} />
        <Txt text={f.text} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} x={20} textAlign={'center'} lineHeight={34} />
      </Rect>,
    );
    yield* all(card().opacity(1, 0.2), card().scale(1, 0.3, easeOutBack));
    yield* waitFor(0.4);
  }

  const next = createRef<Txt>();
  view.add(<Txt ref={next} text={'Zoom out 100,000x →'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={430} opacity={0} />);
  yield* fadeIn(next(), 0.3);

  yield* waitFor(2);
});
