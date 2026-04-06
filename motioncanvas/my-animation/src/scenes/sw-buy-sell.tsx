import {Rect, Txt, makeScene2D, Node, Line} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, easeInOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, TERMINAL_BG, TERMINAL_BORDER, CODE_FONT, TITLE_FONT, ORANGE, PURPLE} from '../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  const badge = createRef<Rect>();
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const difficulty = createRef<Rect>();

  view.add(<Rect ref={badge} x={0} y={-750} width={300} height={100} radius={50} fill={ACCENT_COLOR} opacity={0} scale={0}><Txt text={'#1'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={56} fontWeight={800} /></Rect>);
  view.add(<Txt ref={title} text={'Buy & Sell Stock'} fill={GREEN} fontFamily={CODE_FONT} fontSize={72} fontWeight={800} y={-580} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Max Profit'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={44} y={-490} opacity={0} />);
  view.add(<Rect ref={difficulty} x={0} y={-430} width={140} height={44} radius={22} fill={GREEN} opacity={0} scale={0}><Txt text={'Easy'} fill={'#fff'} fontFamily={CODE_FONT} fontSize={24} fontWeight={700} /></Rect>);

  // Price chart visualization
  const prices = [7, 1, 5, 3, 6, 4];
  const barW = 70;
  const gap = 18;
  const baseY = 0;
  const scale = 28;
  const startX = -((prices.length - 1) * (barW + gap)) / 2;
  const bars = createRefArray<Rect>();
  const labels = createRefArray<Txt>();

  for (let i = 0; i < prices.length; i++) {
    const h = prices[i] * scale;
    view.add(
      <Rect ref={bars} x={startX + i * (barW + gap)} y={baseY - h / 2} width={barW} height={h} radius={6} fill={'#30363d'} opacity={0} scale={0} />
    );
    view.add(
      <Txt ref={labels} text={`${prices[i]}`} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={24} x={startX + i * (barW + gap)} y={baseY + 20} opacity={0} />
    );
  }

  // Buy/Sell pointers
  const buyPtr = createRef<Node>();
  const sellPtr = createRef<Node>();
  view.add(<Node ref={buyPtr} x={startX} y={baseY + 55} opacity={0}><Txt text={'buy'} fill={GREEN} fontFamily={CODE_FONT} fontSize={26} fontWeight={800} /></Node>);
  view.add(<Node ref={sellPtr} x={startX + 1 * (barW + gap)} y={baseY + 55} opacity={0}><Txt text={'sell'} fill={ORANGE} fontFamily={CODE_FONT} fontSize={26} fontWeight={800} /></Node>);

  // Profit line
  const profitLine = createRef<Line>();
  view.add(<Line ref={profitLine} points={[[0, 0], [0, 0]]} stroke={GREEN} lineWidth={3} lineDash={[8, 6]} opacity={0} />);

  const statusTxt = createRef<Txt>();
  view.add(<Txt ref={statusTxt} text={''} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={32} fontWeight={800} y={baseY + 100} opacity={0} />);

  // Code block
  const codeBox = createRef<Rect>();
  const codeLines = createRefArray<Txt>();
  view.add(
    <Rect ref={codeBox} width={900} height={340} y={400} radius={16} fill={TERMINAL_BG} stroke={TERMINAL_BORDER} lineWidth={2} opacity={0} scale={0.8} clip>
      <Rect width={900} height={44} y={-148} fill={'#21262d'}><Txt text={'Python'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={18} /></Rect>
      <Txt ref={codeLines} text={''} fill={PURPLE} fontFamily={CODE_FONT} fontSize={22} x={-410} y={-90} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} x={-410} y={-55} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} x={-410} y={-20} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={GREEN} fontFamily={CODE_FONT} fontSize={22} x={-410} y={15} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} x={-410} y={50} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} x={-410} y={85} offsetX={-1} opacity={0} />
      <Txt ref={codeLines} text={''} fill={TEXT_COLOR} fontFamily={CODE_FONT} fontSize={22} x={-410} y={120} offsetX={-1} opacity={0} />
    </Rect>
  );

  // === ANIMATION ===
  yield* all(badge().opacity(1, 0.3), badge().scale(1, 0.5, easeOutCubic));
  yield* all(title().opacity(1, 0.4), title().y(-580, 0.5, easeOutCubic));
  yield* subtitle().opacity(1, 0.4);
  yield* all(difficulty().opacity(1, 0.3), difficulty().scale(1, 0.4, easeOutCubic));
  yield* waitFor(0.2);

  for (let i = 0; i < prices.length; i++) {
    yield* all(bars[i].opacity(1, 0.08), bars[i].scale(1, 0.15, easeOutCubic), labels[i].opacity(1, 0.1));
  }
  yield* all(buyPtr().opacity(1, 0.3), sellPtr().opacity(1, 0.3));
  yield* statusTxt().opacity(1, 0.2);

  // buy=7, sell=1 → profit=-6, new min → move buy
  yield* statusTxt().text('7→1: loss! Move buy to min', 0.3);
  yield* bars[0].fill(RED, 0.2);
  yield* waitFor(0.3);
  yield* all(buyPtr().x(startX + 1 * (barW + gap), 0.3, easeInOutCubic), sellPtr().x(startX + 2 * (barW + gap), 0.3, easeInOutCubic));
  yield* bars[1].fill(GREEN, 0.2);

  // buy=1, sell=5 → profit=4
  yield* statusTxt().text('1→5: profit = 4', 0.3);
  yield* bars[2].fill(ACCENT_COLOR, 0.2);
  yield* waitFor(0.3);
  yield* sellPtr().x(startX + 4 * (barW + gap), 0.4, easeInOutCubic);

  // buy=1, sell=6 → profit=5 ★
  yield* statusTxt().text('1→6: profit = 5 ★ best!', 0.3);
  yield* statusTxt().fill(GREEN, 0.3);
  yield* bars[4].fill(GREEN, 0.2);
  yield* waitFor(0.5);

  // Show code
  yield* all(codeBox().opacity(1, 0.4), codeBox().scale(1, 0.5, easeOutCubic));
  yield* all(codeLines[0].opacity(1, 0.15), codeLines[0].text('def maxProfit(prices):', 0.3));
  yield* all(codeLines[1].opacity(1, 0.15), codeLines[1].text('    min_price = float("inf")', 0.3));
  yield* all(codeLines[2].opacity(1, 0.15), codeLines[2].text('    max_profit = 0', 0.3));
  yield* all(codeLines[3].opacity(1, 0.15), codeLines[3].text('    for price in prices:', 0.3));
  yield* all(codeLines[4].opacity(1, 0.15), codeLines[4].text('        min_price = min(min_price, price)', 0.3));
  yield* all(codeLines[5].opacity(1, 0.15), codeLines[5].text('        profit = price - min_price', 0.3));
  yield* all(codeLines[6].opacity(1, 0.15), codeLines[6].text('        max_profit = max(max_profit, profit)', 0.3));

  yield* waitFor(2);
});
