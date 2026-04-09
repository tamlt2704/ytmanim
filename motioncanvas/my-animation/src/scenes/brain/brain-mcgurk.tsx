import {Rect, Txt, Circle, makeScene2D, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, ORANGE, CODE_FONT, TITLE_FONT} from '../../styles';
import {showThumbnail} from '../../thumbnail-intro';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  yield* showThumbnail(view, {number: '#4', topic: 'BRAIN', command: 'McGurk', commandColor: GREEN, emoji: '👄', subtitle: 'Your Eyes TRICK Your Ears!'});

  const face = createRef<Circle>();
  const mouth = createRef<Rect>();
  const soundLabel = createRef<Txt>();
  const soundVal = createRef<Txt>();
  const lipLabel = createRef<Txt>();
  const lipVal = createRef<Txt>();
  const hearLabel = createRef<Txt>();
  const hearVal = createRef<Txt>();
  const reveal = createRef<Txt>();
  const cta = createRef<Txt>();

  view.add(
    <Node y={-400}>
      <Circle ref={face} size={300} fill={'#ffd93d'} />
      <Circle size={30} fill={BG_COLOR} x={-60} y={-40} />
      <Circle size={30} fill={BG_COLOR} x={60} y={-40} />
      <Rect ref={mouth} width={80} height={40} y={60} radius={20} fill={BG_COLOR} />
    </Node>,
  );

  view.add(
    <Rect width={800} height={120} radius={16} fill={'#161b22'} stroke={'#30363d'} lineWidth={2} y={-100}>
      <Txt ref={soundLabel} text={'Audio plays:'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} x={-250} y={-20} opacity={0} />
      <Txt ref={soundVal} text={'"BA"'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={48} fontWeight={700} x={-250} y={30} opacity={0} />
    </Rect>,
  );

  view.add(
    <Rect width={800} height={120} radius={16} fill={'#161b22'} stroke={'#30363d'} lineWidth={2} y={70}>
      <Txt ref={lipLabel} text={'Lips show:'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} x={-260} y={-20} opacity={0} />
      <Txt ref={lipVal} text={'"GA"'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={48} fontWeight={700} x={-260} y={30} opacity={0} />
    </Rect>,
  );

  view.add(
    <Rect width={800} height={120} radius={16} fill={'#161b22'} stroke={GREEN} lineWidth={3} y={240}>
      <Txt ref={hearLabel} text={'You hear:'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} x={-270} y={-20} opacity={0} />
      <Txt ref={hearVal} text={'"DA" 🤯'} fill={GREEN} fontFamily={CODE_FONT} fontSize={56} fontWeight={800} x={-230} y={30} opacity={0} />
    </Rect>,
  );

  view.add(<Txt ref={reveal} text={'Your brain MERGES what it sees\nand hears into a third sound\nthat doesn\'t exist!'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={30} y={480} textAlign={'center'} lineHeight={48} opacity={0} />);
  view.add(<Txt ref={cta} text={'Follow for more brain tricks! 🔥'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={40} y={700} opacity={0} />);

  yield* waitFor(0.5);
  yield* mouth().height(60, 0.2);
  yield* mouth().height(40, 0.2);
  yield* all(soundLabel().opacity(1, 0.3), soundVal().opacity(1, 0.4));
  yield* waitFor(1);
  yield* mouth().width(120, 0.2);
  yield* mouth().width(80, 0.2);
  yield* all(lipLabel().opacity(1, 0.3), lipVal().opacity(1, 0.4));
  yield* waitFor(1.5);
  yield* all(hearLabel().opacity(1, 0.3), hearVal().opacity(1, 0.4));
  yield* waitFor(1.5);
  yield* reveal().opacity(1, 0.6);
  yield* waitFor(1.5);
  yield* cta().opacity(1, 0.5);
  yield* waitFor(2);
});
