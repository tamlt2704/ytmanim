import {Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const emoji = createRef<Txt>();
  view.add(<Txt ref={emoji} text={'📦'} fontSize={150} y={-750} opacity={0} scale={0} />);
  yield* all(emoji().opacity(1, 0.3), emoji().scale(1, 0.4, easeOutBack));

  const name = createRef<Txt>();
  view.add(<Txt ref={name} text={'Andy Jassy'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={68} fontWeight={900} y={-600} opacity={0} />);
  yield* fadeIn(name(), 0.3);

  const company = createRef<Txt>();
  view.add(<Txt ref={company} text={'CEO of Amazon'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={30} y={-530} opacity={0} />);
  yield* fadeIn(company(), 0.2);

  const annual = createRef<Rect>();
  view.add(
    <Rect ref={annual} width={440} height={80} radius={18} fill={'#21262d'} y={-410} opacity={0}>
      <Txt text={'Annual: $29.2 million'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={30} fontWeight={800} />
    </Rect>,
  );
  yield* annual().opacity(1, 0.3);
  yield* waitFor(0.5);

  const perSecLabel = createRef<Txt>();
  view.add(<Txt ref={perSecLabel} text={'Per second:'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={-310} opacity={0} />);
  yield* fadeIn(perSecLabel(), 0.2);

  const counter = createRef<Txt>();
  view.add(<Txt ref={counter} text={'$0.00'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={100} fontWeight={900} y={-210} opacity={0} />);
  yield* counter().opacity(1, 0.2);

  const steps = ['$0.10', '$0.30', '$0.50', '$0.70', '$0.85', '$0.90', '$0.93'];
  for (const s of steps) {
    counter().text(s);
    yield* waitFor(0.12);
  }
  yield* counter().fill(ORANGE, 0.2);
  yield* pulse(counter() as any, 1.08, 0.3);

  const note = createRef<Txt>();
  view.add(<Txt ref={note} text={'"Only" $0.93/sec?\nSeems low for Amazon...'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={26} y={-80} textAlign={'center'} lineHeight={40} opacity={0} />);
  yield* fadeIn(note(), 0.3);
  yield* waitFor(0.8);

  const but = createRef<Rect>();
  view.add(
    <Rect ref={but} width={460} height={120} radius={20} fill={RED + '15'} stroke={RED} lineWidth={3} y={60} opacity={0} scale={0}>
      <Txt text={"But that's still\n$55 per minute 💸"} fill={RED} fontFamily={CODE_FONT} fontSize={30} fontWeight={800} textAlign={'center'} lineHeight={42} />
    </Rect>,
  );
  yield* all(but().opacity(1, 0.2), but().scale(1, 0.3, easeOutBack));

  const context = createRef<Txt>();
  view.add(<Txt ref={context} text={'Most people earn $55\nin an entire work day'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} y={200} textAlign={'center'} lineHeight={40} opacity={0} />);
  yield* fadeInUp(context(), 20, 0.3);

  yield* waitFor(2);
});
