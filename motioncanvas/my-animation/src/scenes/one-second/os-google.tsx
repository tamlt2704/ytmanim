import {Rect, Txt, Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  // Emoji
  const emoji = createRef<Txt>();
  view.add(<Txt ref={emoji} text={'🔍'} fontSize={180} y={-700} opacity={0} scale={0} />);
  yield* all(emoji().opacity(1, 0.3), emoji().scale(1, 0.4, easeOutBack));

  const label = createRef<Txt>();
  view.add(<Txt ref={label} text={'Google Searches'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={60} fontWeight={900} y={-530} opacity={0} />);
  yield* fadeIn(label(), 0.3);

  // Animated counter
  const counter = createRef<Txt>();
  view.add(<Txt ref={counter} text={'0'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={120} fontWeight={900} y={-380} opacity={0} />);
  yield* counter().opacity(1, 0.2);

  const steps = [1000, 5000, 15000, 35000, 60000, 80000, 92000, 97000, 99000];
  for (const n of steps) {
    counter().text(n.toLocaleString());
    yield* waitFor(0.12);
  }
  yield* counter().fill(ACCENT_COLOR, 0.2);
  yield* pulse(counter() as any, 1.08, 0.3);

  const perSec = createRef<Txt>();
  view.add(<Txt ref={perSec} text={'every single second'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={-280} opacity={0} />);
  yield* fadeIn(perSec(), 0.3);

  yield* waitFor(0.5);

  // Context
  const ctx1 = createRef<Rect>();
  view.add(
    <Rect ref={ctx1} width={440} height={70} radius={16} fill={ACCENT_COLOR + '15'} y={-160} opacity={0}>
      <Txt text={'📅 8.5 billion per day'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} />
    </Rect>,
  );
  yield* ctx1().opacity(1, 0.3);

  const ctx2 = createRef<Rect>();
  view.add(
    <Rect ref={ctx2} width={440} height={70} radius={16} fill={ACCENT_COLOR + '15'} y={-70} opacity={0}>
      <Txt text={"🌍 More than Earth's population"} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} />
    </Rect>,
  );
  yield* ctx2().opacity(1, 0.3);

  const fun = createRef<Txt>();
  view.add(<Txt ref={fun} text={'By the time you read this,\n200,000+ searches happened'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} y={70} textAlign={'center'} lineHeight={40} opacity={0} />);
  yield* fadeInUp(fun(), 20, 0.3);

  yield* waitFor(2.5);
});
