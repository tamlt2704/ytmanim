import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'#2 Memory Palace'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={64} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  // Rooms as boxes with items
  const rooms = [
    {emoji: '🚪', item: '🥛 Milk', color: ACCENT_COLOR, y: -500},
    {emoji: '🛋️', item: '🥚 Eggs', color: ORANGE, y: -300},
    {emoji: '🛏️', item: '🍞 Bread', color: GREEN, y: -100},
  ];

  for (const room of rooms) {
    const box = createRef<Rect>();
    const label = createRef<Txt>();
    const item = createRef<Txt>();
    view.add(
      <Rect ref={box} width={420} height={120} radius={20} fill={room.color + '22'} stroke={room.color} lineWidth={3} y={room.y} opacity={0} scale={0}>
        <Txt ref={label} text={room.emoji} fontSize={50} x={-150} />
        <Txt ref={item} text={room.item} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={36} fontWeight={700} x={40} />
      </Rect>,
    );
    yield* all(box().opacity(1, 0.2), box().scale(1, 0.3, easeOutBack));
    yield* waitFor(0.3);
  }

  // Explanation
  const explain = createRef<Txt>();
  view.add(<Txt ref={explain} text={'Place items in rooms\nyou already know'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={48} fontWeight={800} y={150} textAlign={'center'} lineHeight={66} opacity={0} />);
  yield* fadeInUp(explain(), 20, 0.3);

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'Walk through your house\nin your mind to recall! 🏠'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={330} textAlign={'center'} lineHeight={44} opacity={0} />);
  yield* fadeIn(tip(), 0.3);

  yield* waitFor(1.5);
});
