import {Rect, Txt, makeScene2D, Circle, Line, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, easeOutBack} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, ORANGE, PURPLE, RED, CODE_FONT, TITLE_FONT, CYAN} from '../../styles';
import {fadeIn, fadeInUp, popIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  view.add(<Circle x={0} y={-200} size={900} fill={RED} opacity={0.04} />);
  view.add(<Rect x={0} y={-958} width={1080} height={4} fill={RED} opacity={0.6} />);
  view.add(<Rect x={0} y={958} width={1080} height={4} fill={RED} opacity={0.6} />);

  const playBtn = createRef<Rect>();
  view.add(
    <Rect ref={playBtn} x={0} y={-500} width={200} height={140} radius={30} fill={RED} opacity={0} scale={0}>
      <Line points={[[-30, -40], [-30, 40], [40, 0]]} closed fill={'#fff'} />
    </Rect>
  );

  const channel = createRef<Txt>();
  view.add(<Txt ref={channel} text={'it4life101'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={100} fontWeight={900} y={-320} opacity={0} letterSpacing={4} />);

  const subscribeTxt = createRef<Txt>();
  view.add(<Txt ref={subscribeTxt} text={'SUBSCRIBE'} fill={RED} fontFamily={TITLE_FONT} fontSize={72} fontWeight={900} y={-210} opacity={0} />);

  const subBtn = createRef<Rect>();
  view.add(
    <Rect ref={subBtn} x={0} y={-100} width={400} height={80} radius={40} fill={RED} opacity={0} scale={0}>
      <Txt text={'\u25b6  SUBSCRIBE'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={36} fontWeight={800} />
    </Rect>
  );

  const divider = createRef<Line>();
  view.add(<Line ref={divider} points={[[-300, -10], [300, -10]]} stroke={'#30363d'} lineWidth={3} opacity={0} />);

  const b1 = createRef<Txt>();
  const b2 = createRef<Txt>();
  const b3 = createRef<Txt>();
  const b4 = createRef<Txt>();
  view.add(<Txt ref={b1} text={'\u26a1 Animated Dev Tutorials'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={38} fontWeight={700} y={60} opacity={0} />);
  view.add(<Txt ref={b2} text={'\u2699 System Design Explained'} fill={GREEN} fontFamily={CODE_FONT} fontSize={38} fontWeight={700} y={130} opacity={0} />);
  view.add(<Txt ref={b3} text={'\u2316 LeetCode Visualized'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={38} fontWeight={700} y={200} opacity={0} />);
  view.add(<Txt ref={b4} text={'\u2708 New Shorts Every Week'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={38} fontWeight={700} y={270} opacity={0} />);

  const handle = createRef<Txt>();
  view.add(<Txt ref={handle} text={'youtube.com/@it4life101'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={34} fontWeight={700} y={500} opacity={0} />);

  yield* all(playBtn().opacity(1, 0.3), playBtn().scale(1, 0.5, easeOutBack));
  yield* fadeInUp(channel(), 30, 0.4);
  yield* fadeInUp(subscribeTxt(), 20, 0.3);
  yield* all(subBtn().opacity(1, 0.3), subBtn().scale(1, 0.4, easeOutBack));
  yield* divider().opacity(1, 0.2);
  yield* fadeInUp(b1(), 20, 0.2);
  yield* fadeInUp(b2(), 20, 0.2);
  yield* fadeInUp(b3(), 20, 0.2);
  yield* fadeInUp(b4(), 20, 0.2);
  yield* pulse(subBtn() as any, 1.1, 0.3);
  yield* pulse(subBtn() as any, 1.1, 0.3);
  yield* fadeIn(handle(), 0.3);
  yield* pulse(channel() as any, 1.08, 0.4);
  yield* waitFor(2);
});
