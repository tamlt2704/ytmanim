import {Rect, Txt, Circle, Line, makeScene2D} from '@motion-canvas/2d';
import {waitFor} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, PURPLE, ORANGE, CODE_FONT, TITLE_FONT} from '../../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  view.add(<Circle size={600} fill={PURPLE} opacity={0.08} y={-200} />);
  view.add(<Rect width={300} height={300} x={-390} y={-810} rotation={45} fill={ORANGE} opacity={0.15} />);
  view.add(<Rect width={200} height={200} x={390} y={810} rotation={45} fill={GREEN} opacity={0.15} />);

  // Timeline line
  view.add(<Line points={[[0, -500], [0, 350]]} stroke={'#30363d'} lineWidth={4} />);

  // Year dots
  const years = ['1957', '1972', '1991', '2009', '2025'];
  for (let i = 0; i < years.length; i++) {
    const y = -500 + i * 210;
    view.add(<Circle x={0} y={y} size={16} fill={ACCENT_COLOR} />);
    view.add(<Txt text={years[i]} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={22} x={60} y={y} />);
  }

  view.add(<Txt text={'EVOLUTION'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={120} fontWeight={900} y={-120} letterSpacing={10} />);
  view.add(<Txt text={'of Programming'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={70} fontWeight={900} y={10} letterSpacing={6} />);
  view.add(<Txt text={'LANGUAGES'} fill={ORANGE} fontFamily={TITLE_FONT} fontSize={100} fontWeight={900} y={120} letterSpacing={10} />);
  view.add(<Txt text={'1950 → 2025'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={36} y={280} />);
  view.add(
    <Rect x={350} y={-800} width={180} height={180} radius={90} fill={RED}>
      <Txt text={'3m'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={900} />
    </Rect>,
  );
  view.add(<Txt text={'💻'} fontSize={120} y={420} />);

  yield* waitFor(3);
});
