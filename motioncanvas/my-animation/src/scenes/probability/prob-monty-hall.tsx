import {Rect, Txt, makeScene2D, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, easeInOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, ORANGE, PURPLE, RED, CODE_FONT, TITLE_FONT, TERMINAL_BG} from '../../styles';
import {fadeIn, fadeInUp, fadeOut, showCreate, typeText, popIn, pulse, shake} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'Monty Hall'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={95} fontWeight={800} y={-780} opacity={0} />);
  const sub = createRef<Txt>();
  view.add(<Txt ref={sub} text={'Should You Switch Doors?'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={40} y={-700} opacity={0} />);

  yield* fadeInUp(title(), 30, 0.4);
  yield* fadeIn(sub(), 0.3);
  yield* waitFor(0.2);

  // Three doors
  const doors = createRefArray<Rect>();
  const doorLabels = createRefArray<Txt>();
  const doorIcons = createRefArray<Txt>();
  const doorColors = [ACCENT_COLOR, ACCENT_COLOR, ACCENT_COLOR];
  const doorX = [-250, 0, 250];

  for (let i = 0; i < 3; i++) {
    view.add(
      <Rect ref={doors} x={doorX[i]} y={-400} width={180} height={280} radius={16} fill={TERMINAL_BG} stroke={doorColors[i]} lineWidth={4} opacity={0} scale={0}>
        <Txt ref={doorLabels} text={`Door ${i + 1}`} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} fontWeight={700} y={-100} />
        <Txt ref={doorIcons} text={'?'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={80} fontWeight={800} y={20} />
      </Rect>
    );
  }

  // Show doors
  for (let i = 0; i < 3; i++) {
    yield* all(doors[i].opacity(1, 0.2), doors[i].scale(1, 0.3, easeOutCubic));
    yield* waitFor(0.1);
  }
  yield* waitFor(0.3);

  // Step 1: You pick door 1
  const step1 = createRef<Txt>();
  view.add(<Txt ref={step1} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={36} fontWeight={700} y={-120} opacity={0} />);
  yield* step1().opacity(1, 0.2);
  yield* typeText(step1(), 'You pick Door 1', 0.05);
  yield* doors[0].stroke(GREEN, 0.3);
  yield* waitFor(0.3);

  // Step 2: Host opens door 3 (goat)
  yield* step1().text('Host opens Door 3...', 0.3);
  yield* doors[2].stroke(RED, 0.3);
  yield* doorIcons[2].text('\ud83d\udc10', 0.2);
  yield* waitFor(0.4);

  // Step 3: Switch?
  yield* step1().text('Switch to Door 2?', 0.3);
  yield* doors[1].stroke(ORANGE, 0.3);
  yield* waitFor(0.3);

  // Answer
  const answer = createRef<Txt>();
  view.add(<Txt ref={answer} text={'YES! Always switch!'} fill={GREEN} fontFamily={CODE_FONT} fontSize={52} fontWeight={800} y={0} opacity={0} />);
  yield* fadeInUp(answer(), 20, 0.4);
  yield* pulse(answer() as any, 1.2, 0.4);
  yield* waitFor(0.3);

  // Probability boxes
  const stayBox = createRef<Rect>();
  const switchBox = createRef<Rect>();
  view.add(
    <Rect ref={stayBox} x={-180} y={160} width={300} height={140} radius={16} fill={TERMINAL_BG} stroke={RED} lineWidth={3} opacity={0} scale={0}>
      <Txt text={'Stay'} fill={RED} fontFamily={CODE_FONT} fontSize={32} fontWeight={800} y={-30} />
      <Txt text={'1/3 = 33%'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={36} fontWeight={800} y={25} />
    </Rect>
  );
  view.add(
    <Rect ref={switchBox} x={180} y={160} width={300} height={140} radius={16} fill={TERMINAL_BG} stroke={GREEN} lineWidth={3} opacity={0} scale={0}>
      <Txt text={'Switch'} fill={GREEN} fontFamily={CODE_FONT} fontSize={32} fontWeight={800} y={-30} />
      <Txt text={'2/3 = 67%'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={36} fontWeight={800} y={25} />
    </Rect>
  );

  yield* all(stayBox().opacity(1, 0.3), stayBox().scale(1, 0.4, easeOutCubic));
  yield* all(switchBox().opacity(1, 0.3), switchBox().scale(1, 0.4, easeOutCubic));
  yield* waitFor(0.3);

  // Tip
  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'The host KNOWS where the prize is.\nOpening a losing door gives you info!'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={500} textAlign={'center'} lineHeight={46} opacity={0} />);
  yield* fadeIn(tip(), 0.4);

  yield* waitFor(2);
});
