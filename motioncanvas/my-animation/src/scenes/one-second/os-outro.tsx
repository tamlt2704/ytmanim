import {Rect, Txt, Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeOutCubic, easeInOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, PURPLE, ORANGE, CODE_FONT, TITLE_FONT} from '../../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const glow = createRef<Circle>();
  view.add(<Circle ref={glow} size={600} fill={RED} opacity={0} y={-300} />);

  const playBtn = createRef<Rect>();
  view.add(
    <Rect ref={playBtn} y={-450} width={180} height={120} radius={28} fill={RED} opacity={0} scale={0}>
      <Txt text={'▶'} fill={'#fff'} fontSize={60} x={5} />
    </Rect>,
  );

  const channel = createRef<Txt>();
  view.add(<Txt ref={channel} text={'it4life101'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={100} fontWeight={900} y={-270} letterSpacing={6} opacity={0} />);

  const subBtn = createRef<Rect>();
  view.add(
    <Rect ref={subBtn} y={-130} width={380} height={75} radius={38} fill={RED} opacity={0} scale={0}>
      <Txt text={'SUBSCRIBE'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={34} fontWeight={900} letterSpacing={4} />
    </Rect>,
  );

  const like = createRef<Txt>();
  const bell = createRef<Txt>();
  view.add(<Txt ref={like} text={'👍'} fontSize={70} x={-100} y={0} opacity={0} />);
  view.add(<Txt ref={bell} text={'🔔'} fontSize={70} x={100} y={0} opacity={0} />);

  const recap = createRef<Txt>();
  view.add(<Txt ref={recap} text={'Every second, the internet:'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={30} fontWeight={700} y={110} opacity={0} />);

  const topics = createRef<Txt>();
  view.add(<Txt ref={topics} text={'🔍 99K searches  📧 3.4M emails\n▶️ 8.3hrs video  📦 $17K sales\n🎵 2.8M TikToks  💬 1.1M msgs\n📸 1K posts  🌐 150K GB data'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} y={260} textAlign={'center'} lineHeight={40} opacity={0} />);

  const follow = createRef<Txt>();
  view.add(<Txt ref={follow} text={'More insane stats coming! 🔥'} fill={ORANGE} fontFamily={TITLE_FONT} fontSize={34} y={430} opacity={0} />);

  const handle = createRef<Txt>();
  view.add(<Txt ref={handle} text={'@it4life101'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={44} fontWeight={800} y={520} opacity={0} />);

  yield* glow().opacity(0.06, 0.2);
  yield* all(playBtn().opacity(1, 0.2), playBtn().scale(1, 0.3, easeOutBack));
  yield* channel().opacity(1, 0.3);
  yield* all(subBtn().opacity(1, 0.2), subBtn().scale(1, 0.3, easeOutBack));
  yield* all(like().opacity(1, 0.2), bell().opacity(1, 0.2));
  yield* recap().opacity(1, 0.3);
  yield* topics().opacity(1, 0.3);
  yield* follow().opacity(1, 0.3);
  yield* handle().opacity(1, 0.3);

  yield* subBtn().scale(1.08, 0.25, easeOutCubic);
  yield* subBtn().scale(1, 0.25, easeInOutCubic);
  yield* subBtn().scale(1.08, 0.25, easeOutCubic);
  yield* subBtn().scale(1, 0.25, easeInOutCubic);

  yield* waitFor(1.5);
});
