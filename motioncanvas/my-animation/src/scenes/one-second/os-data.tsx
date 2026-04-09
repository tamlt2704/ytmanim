import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const emoji = createRef<Txt>();
  view.add(<Txt ref={emoji} text={'🌐'} fontSize={180} y={-700} opacity={0} scale={0} />);
  yield* all(emoji().opacity(1, 0.3), emoji().scale(1, 0.4, easeOutBack));

  const label = createRef<Txt>();
  view.add(<Txt ref={label} text={'Data Transferred'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={56} fontWeight={900} y={-530} opacity={0} />);
  yield* fadeIn(label(), 0.3);

  const counter = createRef<Txt>();
  view.add(<Txt ref={counter} text={'0 GB'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={90} fontWeight={900} y={-390} opacity={0} />);
  yield* counter().opacity(1, 0.2);

  const steps = ['1,000 GB', '10,000 GB', '40,000 GB', '80,000 GB', '120,000 GB', '150,000 GB'];
  for (const n of steps) {
    counter().text(n);
    yield* waitFor(0.15);
  }
  yield* counter().fill(ACCENT_COLOR, 0.2);
  yield* pulse(counter() as any, 1.08, 0.3);

  const perSec = createRef<Txt>();
  view.add(<Txt ref={perSec} text={'flowing across the internet per second'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={24} y={-290} opacity={0} />);
  yield* fadeIn(perSec(), 0.3);
  yield* waitFor(0.5);

  const ctx1 = createRef<Rect>();
  view.add(
    <Rect ref={ctx1} width={460} height={70} radius={16} fill={ACCENT_COLOR + '15'} y={-170} opacity={0}>
      <Txt text={'💾 = 37,500 full movies per second'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} />
    </Rect>,
  );
  yield* ctx1().opacity(1, 0.3);

  const ctx2 = createRef<Rect>();
  view.add(
    <Rect ref={ctx2} width={460} height={70} radius={16} fill={ACCENT_COLOR + '15'} y={-80} opacity={0}>
      <Txt text={'📅 13 exabytes per day'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} />
    </Rect>,
  );
  yield* ctx2().opacity(1, 0.3);

  const fun = createRef<Txt>();
  view.add(<Txt ref={fun} text={"If stored on DVDs, one day's\ndata would stack to the Moon\nand back... twice 🌙"} fill={ORANGE} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} y={60} textAlign={'center'} lineHeight={40} opacity={0} />);
  yield* fadeInUp(fun(), 20, 0.3);

  yield* waitFor(2.5);
});
