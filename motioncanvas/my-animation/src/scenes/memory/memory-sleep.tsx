import {Rect, Txt, Circle, Line, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(<Txt ref={title} text={'#8 Sleep On It'} fill={PURPLE} fontFamily={CODE_FONT} fontSize={72} fontWeight={800} y={-800} opacity={0} />);
  yield* fadeInUp(title(), 30, 0.3);

  // Brain awake — scattered dots
  const awake = createRef<Txt>();
  view.add(<Txt ref={awake} text={'😵 Awake — info scattered'} fill={RED} fontFamily={CODE_FONT} fontSize={28} fontWeight={700} y={-600} opacity={0} />);
  yield* fadeIn(awake(), 0.2);

  const dots = [
    {x: -200, y: -480}, {x: 100, y: -520}, {x: -50, y: -440},
    {x: 200, y: -460}, {x: -150, y: -530}, {x: 50, y: -490},
  ];
  const dotRefs = dots.map(d => {
    const ref = createRef<Circle>();
    view.add(<Circle ref={ref} x={d.x} y={d.y} size={20} fill={ORANGE} opacity={0} />);
    return ref;
  });
  yield* all(...dotRefs.map(d => d().opacity(1, 0.15)));
  yield* waitFor(0.5);

  // Sleep phase
  const sleep = createRef<Txt>();
  view.add(<Txt ref={sleep} text={'😴'} fontSize={120} y={-300} opacity={0} />);
  yield* fadeIn(sleep(), 0.3);

  // Brain asleep — organized connected dots
  const organized = createRef<Txt>();
  view.add(<Txt ref={organized} text={'💤 Sleep — brain organizes!'} fill={GREEN} fontFamily={CODE_FONT} fontSize={28} fontWeight={700} y={-180} opacity={0} />);
  yield* fadeIn(organized(), 0.2);

  const connDots = [
    {x: -150, y: -80}, {x: -50, y: -80}, {x: 50, y: -80},
    {x: 150, y: -80},
  ];
  const connRefs = connDots.map(d => {
    const ref = createRef<Circle>();
    view.add(<Circle ref={ref} x={d.x} y={d.y} size={24} fill={GREEN} opacity={0} scale={0} />);
    return ref;
  });
  yield* all(...connRefs.map(c => all(c().opacity(1, 0.2), c().scale(1, 0.3, easeOutBack))));

  // Lines connecting them
  for (let i = 0; i < connDots.length - 1; i++) {
    const line = createRef<Line>();
    view.add(<Line ref={line} points={[[connDots[i].x, connDots[i].y], [connDots[i + 1].x, connDots[i + 1].y]]} stroke={GREEN} lineWidth={3} end={0} />);
    yield* line().end(1, 0.2, easeOutCubic);
  }

  const explain = createRef<Txt>();
  view.add(<Txt ref={explain} text={'Sleep moves memories\nfrom short → long term'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={44} fontWeight={800} y={80} textAlign={'center'} lineHeight={62} opacity={0} />);
  yield* fadeInUp(explain(), 20, 0.3);

  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'Study before bed,\nnot all-nighters! 🌙'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={250} textAlign={'center'} lineHeight={44} opacity={0} />);
  yield* fadeIn(tip(), 0.3);

  yield* waitFor(1.5);
});
