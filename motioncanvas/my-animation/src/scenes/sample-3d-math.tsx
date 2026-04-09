import {Rect, Txt, makeScene2D, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, ORANGE, PURPLE, CODE_FONT, TITLE_FONT} from '../styles';
import {addCube, showCube, rotateCube3D, addPlatform, show3D, float3D} from '../lib/fake3d';
import {fadeIn, fadeInUp, popIn, typeText, showCreate, fadeOut, pulse} from '../lib/animations';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  // Title
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  view.add(<Txt ref={title} text={'2³ = ?'} fill={ACCENT_COLOR} fontFamily={CODE_FONT} fontSize={120} fontWeight={800} y={-700} opacity={0} />);
  view.add(<Txt ref={subtitle} text={'Visualize with Cubes'} fill={TEXT_COLOR} fontFamily={TITLE_FONT} fontSize={44} y={-600} opacity={0} />);

  yield* fadeInUp(title(), 40, 0.5);
  yield* fadeIn(subtitle(), 0.4);
  yield* waitFor(0.5);

  // Step 1: Show "2 × 2 = 4" as a 2×2 layer
  const step1 = createRef<Txt>();
  view.add(<Txt ref={step1} text={''} fill={ORANGE} fontFamily={CODE_FONT} fontSize={40} fontWeight={700} y={-480} opacity={0} />);
  yield* step1().opacity(1, 0.2);
  yield* typeText(step1(), 'Step 1: 2 × 2 = 4 (one layer)', 0.04);
  yield* waitFor(0.3);

  // Build 2×2 bottom layer
  const cubeSize = 100;
  const gap = 110;
  const baseY = -180;
  const layer1: ReturnType<typeof addCube>[] = [];

  const positions = [
    [-gap / 2, baseY, -gap / 2],
    [gap / 2, baseY, -gap / 2],
    [-gap / 2, baseY, gap / 2],
    [gap / 2, baseY, gap / 2],
  ];

  const colors = [
    {topColor: '#58a6ff', leftColor: '#1f6feb', rightColor: '#388bfd'},
    {topColor: '#3fb950', leftColor: '#238636', rightColor: '#2ea043'},
    {topColor: '#d29922', leftColor: '#9e6a03', rightColor: '#bb8009'},
    {topColor: '#bc8cff', leftColor: '#8957e5', rightColor: '#a371f7'},
  ];

  for (let i = 0; i < 4; i++) {
    const cube = addCube(view, {
      x: positions[i][0],
      y: positions[i][1] + positions[i][2] * 0.5,
      size: cubeSize,
      ...colors[i],
    });
    layer1.push(cube);
    yield* showCube(cube, 0.4);
    yield* waitFor(0.1);
  }

  // Count label
  const count1 = createRef<Txt>();
  view.add(<Txt ref={count1} text={'= 4 cubes'} fill={GREEN} fontFamily={CODE_FONT} fontSize={36} fontWeight={700} y={baseY + 140} opacity={0} />);
  yield* popIn(count1() as any, 0.4);
  yield* waitFor(0.5);

  // Step 2: "× 2 = 8" — add second layer on top
  const step2 = createRef<Txt>();
  view.add(<Txt ref={step2} text={''} fill={ORANGE} fontFamily={CODE_FONT} fontSize={40} fontWeight={700} y={-480} opacity={0} />);
  yield* fadeOut(step1(), 0.3);
  yield* step2().opacity(1, 0.2);
  yield* typeText(step2(), 'Step 2: 4 × 2 = 8 (stack!)', 0.04);
  yield* waitFor(0.3);

  // Second layer (shifted up)
  const layerOffset = -100;
  const layer2Colors = [
    {topColor: '#f85149', leftColor: '#da3633', rightColor: '#f85149'},
    {topColor: '#39d353', leftColor: '#26a641', rightColor: '#2ea043'},
    {topColor: '#58a6ff', leftColor: '#1f6feb', rightColor: '#388bfd'},
    {topColor: '#d29922', leftColor: '#9e6a03', rightColor: '#bb8009'},
  ];

  const layer2: ReturnType<typeof addCube>[] = [];
  for (let i = 0; i < 4; i++) {
    const cube = addCube(view, {
      x: positions[i][0],
      y: positions[i][1] + positions[i][2] * 0.5 + layerOffset,
      size: cubeSize,
      ...layer2Colors[i],
    });
    layer2.push(cube);
    yield* showCube(cube, 0.35);
    yield* waitFor(0.08);
  }

  // Update count
  yield* count1().text('= 8 cubes!', 0.3);
  yield* pulse(count1() as any, 1.3, 0.4);
  yield* waitFor(0.5);

  // Step 3: Reveal answer
  yield* fadeOut(step2(), 0.3);
  yield* fadeOut(count1(), 0.3);

  const answer = createRef<Txt>();
  view.add(<Txt ref={answer} text={'2³ = 8'} fill={GREEN} fontFamily={CODE_FONT} fontSize={100} fontWeight={800} y={250} opacity={0} />);

  const explanation = createRef<Txt>();
  view.add(<Txt ref={explanation} text={'2 × 2 × 2 = 8'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={40} y={340} opacity={0} />);

  yield* fadeInUp(answer(), 30, 0.5);
  yield* fadeIn(explanation(), 0.4);
  yield* waitFor(0.3);

  // Animate title to show answer
  yield* title().text('2³ = 8 ✅', 0.4);
  yield* title().fill(GREEN, 0.3);

  // Float the whole cube structure
  yield* waitFor(0.3);
  for (const cube of [...layer1, ...layer2]) {
    float3D(cube, 8, 3); // fire and forget — runs in background
  }

  // Bottom tip
  const tip = createRef<Txt>();
  view.add(<Txt ref={tip} text={'Exponents = repeated multiplication\nVisualize as stacking cubes! 🧊'} fill={'#8b949e'} fontFamily={CODE_FONT} fontSize={28} y={550} textAlign={'center'} lineHeight={46} opacity={0} />);
  yield* fadeIn(tip(), 0.5);

  yield* waitFor(3);
});
