import {Rect, Txt, Line, Circle, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack, easeOutCubic} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../../styles';
import {fadeInUp, fadeIn} from '../../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const era = createRef<Txt>();
  view.add(<Txt ref={era} text={'2010s — 2020s'} fill={RED} fontFamily={TITLE_FONT} fontSize={72} fontWeight={900} y={-820} letterSpacing={6} opacity={0} />);
  yield* fadeInUp(era(), 30, 0.4);

  const subtitle = createRef<Txt>();
  view.add(<Txt ref={subtitle} text={'The Modern Age 🚀'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={32} y={-740} opacity={0} />);
  yield* fadeIn(subtitle(), 0.3);

  const timeline = createRef<Line>();
  view.add(<Line ref={timeline} points={[[-350, -650], [350, -650]]} stroke={'#30363d'} lineWidth={3} end={0} />);
  yield* timeline().end(1, 0.5, easeOutCubic);

  const langs = [
    {name: 'Kotlin', year: '2011', emoji: '🤖', color: PURPLE, desc: 'Modern Java replacement\nOfficial Android language since 2019'},
    {name: 'Swift', year: '2014', emoji: '🍎', color: ORANGE, desc: 'Replaced Objective-C for Apple\niOS, macOS, watchOS, tvOS'},
    {name: 'TypeScript', year: '2012', emoji: '🔷', color: ACCENT_COLOR, desc: 'JavaScript with types\nNow used by 78% of JS devs'},
    {name: 'Rust', year: '2015', emoji: '🦀', color: RED, desc: 'Memory safety without GC\nMost loved language 7 years in a row'},
    {name: 'Zig', year: '2016', emoji: '⚡', color: GREEN, desc: 'Better C without the baggage\nUsed in Bun runtime, rising fast'},
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
