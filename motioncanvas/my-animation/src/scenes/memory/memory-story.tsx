import {Rect, Txt, Line, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'#5 Story Linking'} fill={RED} fontFamily={CODE_FONT} fontSize={72} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  // Random words
  const words = [
    {text: '🐱 Cat', color: ORANGE, y: -550},
    {text: '🚗 Car', color: ACCENT_COLOR, y: -550},
    {text: '🌙 Moon', color: PURPLE, y: -550},
  ];
  const wordRefs = words.map((w, i) => {
    const ref = createRef<Rect>();
    view.add(
      <Rect ref={ref} x={-220 + i * 220} y={w.y} width={180} height={70} radius={14} fill={w.color + '22'} stroke={w.color} lineWidth={3} opacity={0} scale={0}>
        <Txt text={w.text} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={28} fontWeight={700} />
      </Rect>,
    );
    return ref;
  });
  yield* all(...wordRefs.map(r => all(r().opacity(1, 0.2), r().scale(1, 0.3, easeOutBack))));

  const boring = createRef<Txt>();
  view.add(<Txt ref={boring} text={'Random words? Hard! 😩'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={-450} opacity={0} />);
  yield* fadeIn(boring(), 0.2);
  yield* waitFor(0.6);

  // Story
  const story = createRef<Txt>();
  view.add(<Txt ref={story} text={'"A Cat drove a Car\nto the Moon"'} fill={GREEN} fontFamily={TITLE_FONT} fontSize={48} fontWeight={800} y={-280} textAlign={'center'} lineHeight={66} opacity={0} />);
  yield* fadeInUp(story(), 20, 0.4);

  const check = createRef<Txt>();
  view.add(<Txt ref={check} text={'✅ Instant recall!'} fill={GREEN} fontFamily={CODE_FONT} fontSize={32} fontWeight={700} y={-150} opacity={0} />);
  yield* fadeIn(check(), 0.2);

  // Arrows connecting the words in the story
  const arrow1 = createRef<Line>();
  const arrow2 = createRef<Line>();
  view.add(<Line ref={arrow1} points={[[-120, -510], [0, -510]]} stroke={'#30363d'} lineWidth={3} endArrow arrowSize={10} end={0} />);
  view.add(<Line ref={arrow2} points={[[100, -510], [220, -510]]} stroke={'#30363d'} lineWidth={3} endArrow arrowSize={10} end={0} />);
  yield* all(arrow1().end(1, 0.3, easeOutCubic), arrow2().end(1, 0.3, easeOutCubic));

  const explain = createRef<Txt>();
  view.add(<Txt ref={explain} text={'Your brain remembers\nstories, not lists'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={44} fontWeight={800} y={0} textAlign={'center'} lineHeight={62} opacity={0} />);
  yield* fadeInUp(explain(), 20, 0.3);

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'The weirder the story,\nthe better it sticks! 🤪'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={170} textAlign={'center'} lineHeight={44} opacity={0} />);
  yield* fadeIn(tip(), 0.3);

  yield* waitFor(1.5);
});
