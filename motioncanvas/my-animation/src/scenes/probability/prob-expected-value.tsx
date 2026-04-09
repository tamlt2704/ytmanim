import {Rect, Txt, makeScene2D, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, ORANGE, PURPLE, RED, CODE_FONT, TITLE_FONT, TERMINAL_BG} from '../../styles';
import {fadeIn, fadeInUp, fadeOut, typeText, popIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'Expected Value'} fill={GREEN} fontFamily={CODE_FONT} fontSize={90} fontWeight={800} y={-780} opacity={0} />);
  const sub = createRef<Txt>();
  view.add(<Txt ref={sub} text={'The Average Outcome Over Time'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={38} y={-700} opacity={0} />);

  yield* fadeInUp(title(), 30, 0.4);
  yield* fadeIn(sub(), 0.3);

  // Formula
  const formula = createRef<Txt>();
  view.add(<Txt ref={formula} text={''} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={48} fontWeight={800} y={-580} opacity={0} />);
  yield* formula().opacity(1, 0.2);
  yield* typeText(formula(), 'E(X) = \u03a3 x\u1d62 \u00b7 P(x\u1d62)', 0.05);
  yield* waitFor(0.3);

  // Dice faces
  const dice = createRefArray<Rect>();
  const faces = ['1', '2', '3', '4', '5', '6'];
  const diceColors = [RED, ORANGE, ORANGE, GREEN, GREEN, ACCENT_COLOR];

  for (let i = 0; i < 6; i++) {
    view.add(
      <Rect ref={dice} x={-325 + i * 130} y={-380} width={110} height={110} radius={16} fill={TERMINAL_BG} stroke={diceColors[i]} lineWidth={3} opacity={0} scale={0}>
        <Txt text={faces[i]} fill={diceColors[i]} fontFamily={CODE_FONT} fontSize={52} fontWeight={800} />
      </Rect>
    );
  }

  for (let i = 0; i < 6; i++) {
    yield* all(dice[i].opacity(1, 0.1), dice[i].scale(1, 0.2, easeOutCubic));
  }
  yield* waitFor(0.2);

  // Calculation steps
  const calc1 = createRef<Txt>();
  const calc2 = createRef<Txt>();
  const calc3 = createRef<Txt>();
  view.add(<Txt ref={calc1} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={34} y={-210} opacity={0} />);
  view.add(<Txt ref={calc2} text={''} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={32} y={-150} opacity={0} />);
  view.add(<Txt ref={calc3} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={48} fontWeight={800} y={-60} opacity={0} />);

  yield* calc1().opacity(1, 0.2);
  yield* typeText(calc1(), 'Each face: P = 1/6', 0.04);
  yield* waitFor(0.2);

  yield* calc2().opacity(1, 0.2);
  yield* typeText(calc2(), 'E = (1+2+3+4+5+6) / 6 = 21/6', 0.04);
  yield* waitFor(0.2);

  yield* calc3().opacity(1, 0.2);
  yield* typeText(calc3(), 'E(X) = 3.5', 0.05);
  yield* pulse(calc3() as any, 1.2, 0.4);
  yield* waitFor(0.3);

  // Practical example
  const practical = createRef<Rect>();
  view.add(
    <Rect ref={practical} y={130} width={800} height={180} radius={20} fill={TERMINAL_BG} stroke={ORANGE} lineWidth={3} opacity={0} scale={0}>
      <Txt text={'Game: Pay $4, win face value'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={32} fontWeight={700} y={-40} />
      <Txt text={'E(profit) = 3.5 - 4 = -$0.50 per game'} fill={RED} fontFamily={CODE_FONT} fontSize={34} fontWeight={800} y={30} />
    </Rect>
  );
  yield* all(practical().opacity(1, 0.3), practical().scale(1, 0.4, easeOutCubic));
  yield* waitFor(0.3);

  const verdict = createRef<Txt>();
  view.add(<Txt ref={verdict} text={"Don't play! Negative EV"} fill={RED} fontFamily={CODE_FONT} fontSize={40} fontWeight={800} y={320} opacity={0} />);
  yield* fadeInUp(verdict(), 20, 0.4);

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'Casinos always have negative EV\nfor the player. Math wins long-term.'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={530} textAlign={'center'} lineHeight={46} opacity={0} />);
  yield* fadeIn(tip(), 0.4);

  yield* waitFor(2);
});
