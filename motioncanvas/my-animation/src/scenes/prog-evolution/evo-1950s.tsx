import {Rect, Txt, Line, Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const era = createRef<Txt>();
  view.add(<Txt ref={era} text={'1950s — 1960s'} fill={ORANGE} fontFamily={TITLE_FONT} fontSize={72} fontWeight={900} y={-820} letterSpacing={6} opacity={0} />);
  yield* fadeInUp(era(), 30, 0.4);

  const subtitle = createRef<Txt>();
  view.add(<Txt ref={subtitle} text={'The Pioneers 🏛️'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={32} y={-740} opacity={0} />);
  yield* fadeIn(subtitle(), 0.3);

  // Timeline line
  const timeline = createRef<Line>();
  view.add(<Line ref={timeline} points={[[-350, -650], [350, -650]]} stroke={'#30363d'} lineWidth={3} end={0} />);
  yield* timeline().end(1, 0.5, easeOutCubic);

  const langs = [
    {name: 'Fortran', year: '1957', emoji: '🔬', color: PURPLE, desc: 'First high-level language\nScientific computing'},
    {name: 'LISP', year: '1958', emoji: '🧠', color: GREEN, desc: 'AI & functional programming\nStill influences languages today'},
    {name: 'COBOL', year: '1959', emoji: '🏦', color: ACCENT_COLOR, desc: 'Business & banking\nStill runs 95% of ATM transactions'},
    {name: 'BASIC', year: '1964', emoji: '📚', color: ORANGE, desc: 'Made coding accessible\nDesigned for beginners'},
  ];

  for (let i = 0; i < langs.length; i++) {
    const lang = langs[i];
    const y = -530 + i * 230;

    // Year dot on timeline
    const dot = createRef<Circle>();
    const xPos = -350 + ((i + 1) / (langs.length + 1)) * 700;
    view.add(<Circle ref={dot} x={xPos} y={-650} size={18} fill={lang.color} opacity={0} scale={0} />);
    yield* all(dot().opacity(1, 0.2), dot().scale(1, 0.3, easeOutBack));

    // Language card
    const card = createRef<Rect>();
    view.add(
      <Rect ref={card} width={460} height={170} radius={20} fill={lang.color + '12'} stroke={lang.color} lineWidth={3} y={y} opacity={0} scale={0}>
        <Txt text={lang.emoji} fontSize={50} x={-180} y={-20} />
        <Txt text={lang.name} fill={lang.color} fontFamily={TITLE_FONT} fontSize={42} fontWeight={900} x={20} y={-40} />
        <Txt text={lang.year} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={24} fontWeight={800} x={170} y={-40} />
        <Txt text={lang.desc} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={20} x={20} y={30} textAlign={'center'} lineHeight={28} />
      </Rect>,
    );
    yield* all(card().opacity(1, 0.3), card().scale(1, 0.4, easeOutBack));
    yield* waitFor(2);
  }

  yield* waitFor(1);
});
