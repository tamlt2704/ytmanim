import {Rect, Txt, Line, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, easeOutBack} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'#3 Spaced Repetition'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={60} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  // Forgetting curve — declining line
  const axis = createRef<Line>();
  view.add(<Line ref={axis} points={[[-300, -300], [-300, -600], [300, -600]]} stroke={'#30363d'} lineWidth={3} end={0} />);
  yield* axis().end(1, 0.3, easeOutCubic);

  view.add(<Txt text={'Memory'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={20} x={-380} y={-450} rotation={-90} />);
  view.add(<Txt text={'Time →'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={20} x={0} y={-570} />);

  const curve = createRef<Line>();
  view.add(<Line ref={curve} points={[[-300, -300], [-150, -420], [0, -510], [150, -560], [300, -580]]} stroke={RED} lineWidth={4} radius={80} end={0} />);
  yield* curve().end(1, 0.5, easeOutCubic);

  const drop = createRef<Txt>();
  view.add(<Txt ref={drop} text={'📉 You forget 70% in 24h!'} fill={RED} fontFamily={CODE_FONT} fontSize={30} fontWeight={700} y={-230} opacity={0} />);
  yield* fadeIn(drop(), 0.3);
  yield* waitFor(0.6);

  // Review intervals
  const intervals = [
    {text: '1 day', color: ACCENT_COLOR},
    {text: '3 days', color: GREEN},
    {text: '1 week', color: ORANGE},
    {text: '1 month', color: ACCENT_COLOR},
  ];
  const boxes = intervals.map((iv, i) => {
    const ref = createRef<Rect>();
    view.add(
      <Rect ref={ref} x={-225 + i * 150} y={-80} width={130} height={55} radius={12} fill={iv.color} opacity={0} scale={0}>
        <Txt text={iv.text} fill={'#fff'} fontFamily={CODE_FONT} fontSize={22} fontWeight={800} />
      </Rect>,
    );
    return ref;
  });
  yield* all(...boxes.map(b => all(b().opacity(1, 0.2), b().scale(1, 0.3, easeOutBack))));

  const fix = createRef<Txt>();
  view.add(<Txt ref={fix} text={'Review at growing intervals\nto lock it in forever! 🔒'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={42} fontWeight={800} y={80} textAlign={'center'} lineHeight={60} opacity={0} />);
  yield* fadeInUp(fix(), 20, 0.3);

  const apps = createRef<Txt>();
  view.add(<Txt ref={apps} text={'Apps like Anki use this!'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={220} opacity={0} />);
  yield* fadeIn(apps(), 0.3);

  yield* waitFor(1.5);
});
