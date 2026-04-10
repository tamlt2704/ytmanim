import {Rect, Txt, Circle, Line, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn, pulse} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const title = createRef<Txt>();
  view.add(
    <Txt ref={title}
      text={'🪐 Solar System'}
      fill={ORANGE} fontFamily={TITLE_FONT}
      fontSize={68} fontWeight={900}
      y={-800} opacity={0}
    />,
  );
  yield* fadeInUp(title(), 30, 0.4);

  const sizeLabel = createRef<Txt>();
  view.add(<Txt ref={sizeLabel} text={'~9 billion km across'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={32} y={-720} opacity={0} />);
  yield* fadeIn(sizeLabel(), 0.2);

  const sciLabel = createRef<Txt>();
  view.add(<Txt ref={sciLabel} text={'10¹³ meters'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={40} fontWeight={800} y={-660} opacity={0} />);
  yield* fadeIn(sciLabel(), 0.2);

  // Sun dominance visual
  const sunY = -440;
  const sun = createRef<Circle>();
  view.add(<Circle ref={sun} x={-250} y={sunY} size={200} fill={ORANGE + '30'} stroke={ORANGE} lineWidth={3} opacity={0} scale={0} />);
  yield* all(sun().opacity(1, 0.3), sun().scale(1, 0.4, easeOutBack));
  view.add(<Txt text={'☀️'} fontSize={60} x={-250} y={sunY} />);

  // Tiny Earth next to it
  const earthDot = createRef<Circle>();
  view.add(<Circle ref={earthDot} x={-120} y={sunY} size={6} fill={ACCENT_COLOR} opacity={0} />);
  yield* earthDot().opacity(1, 0.2);
  view.add(<Txt text={'← Earth'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={18} fontWeight={700} x={-50} y={sunY} opacity={0.8} />);

  const sunFact = createRef<Txt>();
  view.add(<Txt ref={sunFact} text={'The Sun holds 99.86%\nof all mass in our solar system'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={28} fontWeight={700} x={130} y={sunY} textAlign={'center'} lineHeight={38} opacity={0} />);
  yield* fadeIn(sunFact(), 0.3);

  yield* waitFor(0.8);

  // Light travel times
  const lightTitle = createRef<Txt>();
  view.add(<Txt ref={lightTitle} text={'⚡ How long light takes to reach...'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={30} fontWeight={700} y={-290} opacity={0} />);
  yield* fadeIn(lightTitle(), 0.2);

  const lightTimes = [
    {dest: '🌙 Moon', time: '1.3 seconds', barW: 20, color: '#8b949e'},
    {dest: '☀️ Sun', time: '8.3 minutes', barW: 80, color: ORANGE},
    {dest: '🪐 Jupiter', time: '43 minutes', barW: 180, color: ORANGE + 'aa'},
    {dest: '🧊 Pluto', time: '5.5 hours', barW: 350, color: PURPLE},
    {dest: '⭐ Nearest star', time: '4.2 years', barW: 480, color: RED},
  ];

  for (let i = 0; i < lightTimes.length; i++) {
    const l = lightTimes[i];
    const y = -230 + i * 85;

    // Label
    view.add(<Txt text={l.dest} fill={l.color} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} x={-280} y={y - 12} />);

    // Bar
    const bar = createRef<Rect>();
    view.add(<Rect ref={bar} x={-280} y={y + 16} width={0} height={20} radius={6} fill={l.color} offset={[-1, 0]} />);
    yield* bar().width(l.barW, 0.3, easeOutCubic);

    // Time
    view.add(<Txt text={l.time} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} fontWeight={700} x={-280 + l.barW + 15} y={y + 16} />);

    yield* waitFor(0.3);
  }

  yield* waitFor(0.5);

  // Mind-blower
  const blow = createRef<Rect>();
  view.add(
    <Rect ref={blow}
      width={560} height={100} radius={18}
      fill={RED + '15'} stroke={RED} lineWidth={3}
      y={430} opacity={0} scale={0}
    >
      <Txt text={'Voyager 1 has been traveling\n46 years and is barely past Pluto'} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={26} fontWeight={700} textAlign={'center'} lineHeight={36} />
    </Rect>,
  );
  yield* all(blow().opacity(1, 0.2), blow().scale(1, 0.3, easeOutBack));
  yield* pulse(blow() as any, 1.05, 0.3);

  yield* waitFor(2);
});
