import {Rect, Txt, Circle, makeScene2D} from '@motion-canvas/2d';
import {waitFor} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, PURPLE, ORANGE, CODE_FONT, TITLE_FONT} from '../../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  view.add(<Circle size={600} fill={ACCENT_COLOR} opacity={0.08} y={-200} />);
  view.add(<Rect width={300} height={300} x={-390} y={-810} rotation={45} fill={GREEN} opacity={0.15} />);
  view.add(<Rect width={200} height={200} x={390} y={810} rotation={45} fill={PURPLE} opacity={0.15} />);

  // Bar chart silhouette
  const heights = [120, 200, 80, 280, 160, 240, 100];
  const colors = [RED, ORANGE, GREEN, ACCENT_COLOR, PURPLE, GREEN, ORANGE];
  for (let i = 0; i < heights.length; i++) {
    view.add(
      <Rect x={-180 + i * 60} y={-350 + (280 - heights[i]) / 2} width={48} height={heights[i]} radius={8} fill={colors[i]} />,
    );
  }

  view.add(<Txt text={'SORTING'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={140} fontWeight={900} y={-50} letterSpacing={12} />);
  view.add(<Txt text={'ALGORITHMS'} fill={ACCENT_COLOR} fontFamily={TITLE_FONT} fontSize={100} fontWeight={900} y={90} letterSpacing={8} />);
  view.add(<Txt text={'Visualized &\nCompared'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={38} y={270} textAlign={'center'} lineHeight={56} />);
  view.add(
    <Rect x={350} y={-800} width={180} height={180} radius={90} fill={RED}>
      <Txt text={'2m'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={900} />
    </Rect>,
  );
  view.add(<Txt text={'⚡'} fontSize={120} y={440} />);

  yield* waitFor(2);
});
