import {Rect, Txt, Line, Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const era = createRef<Txt>();
  view.add(<Txt ref={era} text={'1990s'} fill={GREEN} fontFamily={TITLE_FONT} fontSize={90} fontWeight={900} y={-820} letterSpacing={8} opacity={0} />);
  yield* fadeInUp(era(), 30, 0.4);

  const subtitle = createRef<Txt>();
  view.add(<Txt ref={subtitle} text={'The Internet Boom 🌐'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={32} y={-740} opacity={0} />);
  yield* fadeIn(subtitle(), 0.3);

  const timeline = createRef<Line>();
  view.add(<Line ref={timeline} points={[[-350, -650], [350, -650]]} stroke={'#30363d'} lineWidth={3} end={0} />);
  yield* timeline().end(1, 0.5, easeOutCubic);

  const langs = [
    {name: 'Python', year: '1991', emoji: '🐍', color: '#3572A5', desc: 'Readability first\nNow #1 for AI, data science, everything'},
    {name: 'Java', year: '1995', emoji: '☕', color: ORANGE, desc: '"Write once, run anywhere"\n3 billion devices run Java'},
    {name: 'JavaScript', year: '1995', emoji: '🌐', color: '#f1e05a', desc: 'Built in 10 days\nNow runs the entire web'},
    {name: 'PHP', year: '1995', emoji: '🐘', color: PURPLE, desc: '78% of all websites\nWordPress, Facebook started here'},
    {name: 'Ruby', year: '1995', emoji: '💎', color: RED, desc: '"Optimized for developer happiness"\nRails changed web development'},
  ];

  for (let i = 0; i < langs.length; i++) {
    const lang = langs[i];
    const y = -530 + i * 190;

    const dot = createRef<Circle>();
    const xPos = -350 + ((i + 1) / (langs.length + 1)) * 700;
    view.add(<Circle ref={dot} x={xPos} y={-650} size={18} fill={lang.color} opacity={0} scale={0} />);
    yield* all(dot().opacity(1, 0.2), dot().scale(1, 0.3, easeOutBack));

    const card = createRef<Rect>();
    view.add(
      <Rect ref={card} width={460} height={150} radius={20} fill={lang.color + '12'} stroke={lang.color} lineWidth={3} y={y} opacity={0} scale={0}>
        <Txt text={lang.emoji} fontSize={44} x={-180} y={-15} />
        <Txt text={lang.name} fill={lang.color} fontFamily={TITLE_FONT} fontSize={36} fontWeight={900} x={10} y={-35} />
        <Txt text={lang.year} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} fontWeight={800} x={180} y={-35} />
        <Txt text={lang.desc} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={18} x={10} y={25} textAlign={'center'} lineHeight={26} />
      </Rect>,
    );
    yield* all(card().opacity(1, 0.3), card().scale(1, 0.4, easeOutBack));
    yield* waitFor(2);
  }

  yield* waitFor(1);
});
