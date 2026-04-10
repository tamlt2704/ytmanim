import {Rect, Txt, Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(
    <Txt ref={title}
      text={'✨ The Universe'}
      fill={ACCENT_COLOR} fontFamily={TITLE_FONT}
      fontSize={72} fontWeight={900}
      y={-800} opacity={0}
    />,
  );
  yield* fadeInUp(title(), 30, 0.4);

  const sizeLabel = createRef<Txt>();
  view.add(<Txt ref={sizeLabel} text={'93 billion light-years across'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={32} y={-720} opacity={0} />);
  yield* fadeIn(sizeLabel(), 0.2);

  const sciLabel = createRef<Txt>();
  view.add(<Txt ref={sciLabel} text={'10²⁶ meters'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={40} fontWeight={800} y={-660} opacity={0} />);
  yield* fadeIn(sciLabel(), 0.2);

  // Cosmic web visual — scattered galaxy clusters
  const webY = -380;
  let seed = 99;
  const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

  // Filaments (faint lines connecting clusters)
  const clusterPositions: [number, number][] = [];
  for (let i = 0; i < 25; i++) {
    const cx = -250 + rand() * 500;
    const cy = webY - 120 + rand() * 240;
    clusterPositions.push([cx, cy]);
  }

  // Galaxy clusters as glowing dots
  for (const [cx, cy] of clusterPositions) {
    const size = 4 + rand() * 12;
    const colors = [ACCENT_COLOR, PURPLE, ORANGE, GREEN, TEXT_COLOR];
    const c = colors[Math.floor(rand() * colors.length)];
    // Glow
    view.add(<Circle x={cx} y={cy} size={size * 3} fill={c} opacity={0.05} />);
    // Core
    view.add(<Circle x={cx} y={cy} size={size} fill={c} opacity={0.3 + rand() * 0.4} />);
  }

  const webLabel = createRef<Txt>();
  view.add(<Txt ref={webLabel} text={'The Cosmic Web'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={28} fontWeight={700} y={webY + 150} opacity={0} />);
  yield* fadeIn(webLabel(), 0.3);

  const webDesc = createRef<Txt>();
  view.add(<Txt ref={webDesc} text={'Galaxies cluster along filaments\nwith vast voids in between'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={24} y={webY + 195} textAlign={'center'} lineHeight={34} opacity={0} />);
  yield* fadeIn(webDesc(), 0.2);

  yield* waitFor(0.8);

  // Mind-blowing numbers
  const facts = [
    {emoji: '🌌', text: '2 trillion galaxies\nin the observable universe', color: PURPLE},
    {emoji: '⭐', text: '~200 billion trillion stars\n(200,000,000,000,000,000,000,000)', color: ORANGE},
    {emoji: '💥', text: 'Started 13.8 billion years ago\nfrom a point smaller than an atom', color: RED},
    {emoji: '🏃', text: 'The universe is expanding\nfaster than the speed of light', color: GREEN},
    {emoji: '🔭', text: 'We can only see 5% of it\n95% is dark matter & dark energy', color: ACCENT_COLOR},
  ];

  for (let i = 0; i < facts.length; i++) {
    const f = facts[i];
    const card = createRef<Rect>();
    view.add(
      <Rect ref={card}
        width={560} height={100} radius={16}
        fill={f.color + '12'} stroke={f.color} lineWidth={2}
        y={-100 + i * 115}
        opacity={0} scale={0}
      >
        <Txt text={f.emoji} fontSize={36} x={-230} />
        <Txt text={f.text} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} x={20} textAlign={'center'} lineHeight={34} />
      </Rect>,
    );
    yield* all(card().opacity(1, 0.2), card().scale(1, 0.3, easeOutBack));
    yield* waitFor(0.5);
  }

  const mind = createRef<Txt>();
  view.add(
    <Txt ref={mind}
      text={'And this might be just\none of infinite universes 🤯'}
      fill={ACCENT_COLOR} fontFamily={TITLE_FONT}
      fontSize={34} fontWeight={800}
      y={500} textAlign={'center'} lineHeight={50}
      opacity={0}
    />,
  );
  yield* fadeInUp(mind(), 20, 0.3);
  yield* pulse(mind() as any, 1.05, 0.3);

  yield* waitFor(2);
});
