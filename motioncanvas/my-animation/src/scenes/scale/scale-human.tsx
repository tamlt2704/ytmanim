import {Rect, Txt, Circle, Line, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(
    <Txt ref={title}
      text={'🧑 Human Scale'}
      fill={TEXT_COLOR} fontFamily={TITLE_FONT}
      fontSize={72} fontWeight={900}
      y={-800} opacity={0}
    />,
  );
  yield* fadeInUp(title(), 30, 0.4);

  const sizeLabel = createRef<Txt>();
  view.add(<Txt ref={sizeLabel} text={'~1.7 meters'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={32} y={-720} opacity={0} />);
  yield* fadeIn(sizeLabel(), 0.2);

  const sciLabel = createRef<Txt>();
  view.add(<Txt ref={sciLabel} text={'10⁰ meters'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={40} fontWeight={800} y={-660} opacity={0} />);
  yield* fadeIn(sciLabel(), 0.2);

  // Height comparison bars
  const baseY = -100;
  const barW = 80;
  const items = [
    {label: 'Ant', height: 3, size: '2mm', color: RED, emoji: '🐜'},
    {label: 'Cat', height: 20, size: '25cm', color: ORANGE, emoji: '🐱'},
    {label: 'Human', height: 80, size: '1.7m', color: ACCENT_COLOR, emoji: '🧑'},
    {label: 'Giraffe', height: 140, size: '5.5m', color: GREEN, emoji: '🦒'},
    {label: 'Blue\nWhale', height: 200, size: '30m', color: PURPLE, emoji: '🐋'},
  ];

  const startX = -((items.length - 1) * (barW + 30)) / 2;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const x = startX + i * (barW + 30);

    // Bar
    const bar = createRef<Rect>();
    view.add(
      <Rect ref={bar}
        x={x} y={baseY}
        width={barW} height={0} radius={8}
        fill={item.color}
        offset={[0, 1]}
        opacity={0}
      />,
    );
    yield* bar().opacity(1, 0.1);
    yield* bar().height(item.height, 0.4, easeOutCubic);

    // Emoji on top
    const emoji = createRef<Txt>();
    view.add(<Txt ref={emoji} text={item.emoji} fontSize={36} x={x} y={baseY - item.height - 25} opacity={0} />);
    yield* emoji().opacity(1, 0.15);

    // Label below
    view.add(<Txt text={item.label} fill={item.color} fontFamily={CODE_FONT} fontSize={20} fontWeight={700} x={x} y={baseY + 20} textAlign={'center'} lineHeight={24} />);
    view.add(<Txt text={item.size} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={18} x={x} y={baseY + 50} />);

    yield* waitFor(0.3);
  }

  yield* waitFor(0.5);

  // Scale context
  const context = [
    {emoji: '🏔️', text: 'Mt. Everest = 8,849m\n5,200x your height', color: ORANGE},
    {emoji: '✈️', text: 'Cruising altitude = 10,000m\nYou are a speck from up there', color: ACCENT_COLOR},
    {emoji: '🔬', text: 'You contain 37 trillion cells\neach with 2m of DNA\n= 74 billion km of DNA total', color: PURPLE},
  ];

  for (let i = 0; i < context.length; i++) {
    const c = context[i];
    const card = createRef<Rect>();
    view.add(
      <Rect ref={card}
        width={560} height={115} radius={16}
        fill={c.color + '12'} stroke={c.color} lineWidth={2}
        y={150 + i * 135}
        opacity={0} scale={0}
      >
        <Txt text={c.emoji} fontSize={38} x={-230} />
        <Txt text={c.text} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} x={20} textAlign={'center'} lineHeight={34} />
      </Rect>,
    );
    yield* all(card().opacity(1, 0.2), card().scale(1, 0.3, easeOutBack));
    yield* waitFor(0.5);
  }

  const next = createRef<Txt>();
  view.add(<Txt ref={next} text={'Zoom out 10,000,000x →'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={560} opacity={0} />);
  yield* fadeIn(next(), 0.3);

  yield* waitFor(2);
});
