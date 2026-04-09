import {Rect, Txt, makeScene2D, Line, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, ORANGE, PURPLE, RED, CODE_FONT, TITLE_FONT, TERMINAL_BG} from '../../styles';
import {fadeIn, fadeInUp, typeText, popIn, pulse, drawLine} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'P(A|B)'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={100} fontWeight={800} y={-780} opacity={0} />);
  const sub = createRef<Txt>();
  view.add(<Txt ref={sub} text={'Conditional Probability'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={40} y={-700} opacity={0} />);

  yield* fadeInUp(title(), 30, 0.4);
  yield* fadeIn(sub(), 0.3);

  // Formula
  const formula = createRef<Txt>();
  view.add(<Txt ref={formula} text={''} fill={PURPLE} fontFamily={CODE_FONT} fontSize={52} fontWeight={800} y={-580} opacity={0} />);
  yield* formula().opacity(1, 0.2);
  yield* typeText(formula(), 'P(A|B) = P(A\u2229B) / P(B)', 0.05);
  yield* waitFor(0.3);

  // Tree diagram: Bag with 3 red, 2 blue balls
  // Draw without replacement
  const treeRoot = createRef<Txt>();
  view.add(<Txt ref={treeRoot} text={'Bag: 3R 2B'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={32} fontWeight={700} x={0} y={-430} opacity={0} />);
  yield* fadeIn(treeRoot(), 0.3);

  // First draw branches
  const branch1R = createRef<Line>();
  const branch1B = createRef<Line>();
  view.add(<Line ref={branch1R} points={[[0, -400], [-200, -280]]} stroke={RED} lineWidth={3} end={0} opacity={1} />);
  view.add(<Line ref={branch1B} points={[[0, -400], [200, -280]]} stroke={ACCENT_COLOR} lineWidth={3} end={0} opacity={1} />);

  const label1R = createRef<Txt>();
  const label1B = createRef<Txt>();
  view.add(<Txt ref={label1R} text={'3/5'} fill={RED} fontFamily={CODE_FONT} fontSize={28} fontWeight={800} x={-140} y={-360} opacity={0} />);
  view.add(<Txt ref={label1B} text={'2/5'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={28} fontWeight={800} x={140} y={-360} opacity={0} />);

  const node1R = createRef<Txt>();
  const node1B = createRef<Txt>();
  view.add(<Txt ref={node1R} text={'Red'} fill={RED} fontFamily={CODE_FONT} fontSize={30} fontWeight={800} x={-200} y={-260} opacity={0} />);
  view.add(<Txt ref={node1B} text={'Blue'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={30} fontWeight={800} x={200} y={-260} opacity={0} />);

  yield* drawLine(branch1R(), 0.4);
  yield* all(label1R().opacity(1, 0.2), node1R().opacity(1, 0.2));
  yield* drawLine(branch1B(), 0.4);
  yield* all(label1B().opacity(1, 0.2), node1B().opacity(1, 0.2));
  yield* waitFor(0.2);

  // Second draw from Red branch
  const branch2RR = createRef<Line>();
  const branch2RB = createRef<Line>();
  view.add(<Line ref={branch2RR} points={[[-200, -240], [-340, -120]]} stroke={RED} lineWidth={3} end={0} opacity={1} />);
  view.add(<Line ref={branch2RB} points={[[-200, -240], [-60, -120]]} stroke={ACCENT_COLOR} lineWidth={3} end={0} opacity={1} />);

  const label2RR = createRef<Txt>();
  const label2RB = createRef<Txt>();
  view.add(<Txt ref={label2RR} text={'2/4'} fill={RED} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} x={-310} y={-200} opacity={0} />);
  view.add(<Txt ref={label2RB} text={'2/4'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} x={-90} y={-200} opacity={0} />);

  yield* drawLine(branch2RR(), 0.3);
  yield* label2RR().opacity(1, 0.2);
  yield* drawLine(branch2RB(), 0.3);
  yield* label2RB().opacity(1, 0.2);
  yield* waitFor(0.3);

  // Question
  const question = createRef<Txt>();
  view.add(<Txt ref={question} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={34} fontWeight={700} y={10} opacity={0} />);
  yield* question().opacity(1, 0.2);
  yield* typeText(question(), 'P(2nd Red | 1st Red) = ?', 0.04);
  yield* waitFor(0.3);

  const answer = createRef<Txt>();
  view.add(<Txt ref={answer} text={'= 2/4 = 50%'} fill={GREEN} fontFamily={CODE_FONT} fontSize={52} fontWeight={800} y={100} opacity={0} />);
  yield* fadeInUp(answer(), 20, 0.4);
  yield* pulse(answer() as any, 1.15, 0.3);

  const note = createRef<Txt>();
  view.add(<Txt ref={note} text={'Without replacement changes the odds!\nWith replacement: still 3/5 = 60%'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={350} textAlign={'center'} lineHeight={46} opacity={0} />);
  yield* fadeIn(note(), 0.4);

  yield* waitFor(2);
});
