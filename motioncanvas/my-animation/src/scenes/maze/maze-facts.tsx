import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(
    <Txt ref={title}
      text={'Fun Facts'}
      fill={ORANGE} fontFamily={TITLE_FONT}
      fontSize={80} fontWeight={900}
      y={-800} opacity={0}
    />,
  );
  yield* fadeInUp(title(), 30, 0.4);

  const facts = [
    {emoji: '🏛️', text: 'Oldest known maze:\nEgyptian labyrinth\n~1800 BC', color: ORANGE},
    {emoji: '🎮', text: 'Pac-Man is a maze game!\nReleased 1980 by Namco', color: GREEN},
    {emoji: '🧠', text: 'Maze solving is used in\nrobotics, AI pathfinding,\nand network routing', color: ACCENT_COLOR},
    {emoji: '🌽', text: 'World\'s largest corn maze:\n60 acres (24 hectares)\nDixon, California', color: PURPLE},
    {emoji: '🐁', text: 'Mice can solve mazes!\nUsed in neuroscience\nsince the 1900s', color: RED},
    {emoji: '🔢', text: 'A 100×100 maze has\n10,000 cells but only\n~5,000 passages', color: GREEN},
  ];

  for (let i = 0; i < facts.length; i++) {
    const f = facts[i];
    const card = createRef<Rect>();
    view.add(
      <Rect ref={card}
        width={560} height={150} radius={18}
        fill={f.color + '12'} stroke={f.color} lineWidth={2}
        y={-600 + i * 170}
        opacity={0} scale={0}
      >
        <Txt text={f.emoji} fontSize={52} x={-220} />
        <Txt text={f.text} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={30} fontWeight={700} x={20} textAlign={'center'} lineHeight={40} />
      </Rect>,
    );
    yield* all(card().opacity(1, 0.2), card().scale(1, 0.3, easeOutBack));
    yield* waitFor(0.8);
  }

  const mind = createRef<Txt>();
  view.add(
    <Txt ref={mind}
      text={'Mazes are everywhere\nin CS and nature 🤯'}
      fill={ACCENT_COLOR} fontFamily={TITLE_FONT}
      fontSize={40} fontWeight={800}
      y={460} textAlign={'center'} lineHeight={58}
      opacity={0}
    />,
  );
  yield* fadeInUp(mind(), 20, 0.3);

  yield* waitFor(2);
});
