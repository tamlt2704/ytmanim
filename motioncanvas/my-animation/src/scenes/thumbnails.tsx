import {Rect, Txt, Circle, makeScene2D, Node} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutCubic, createRefArray} from '@motion-canvas/core';
import {BG_COLOR, TEXT_COLOR, ACCENT_COLOR, GREEN, RED, CODE_FONT, TITLE_FONT, ORANGE, PURPLE, CYAN} from '../styles';

export default makeScene2D(function* (view) {
  view.fill(BG_COLOR);

  // Thumbnail layout - designed to be screenshot at specific frames
  // Each "page" is a thumbnail for one short

  const bg = createRef<Rect>();
  const mainTitle = createRef<Txt>();
  const commandTxt = createRef<Txt>();
  const emoji = createRef<Txt>();
  const badge = createRef<Rect>();
  const glowCircle = createRef<Circle>();
  const subtitleTxt = createRef<Txt>();
  const cornerAccent1 = createRef<Rect>();
  const cornerAccent2 = createRef<Rect>();

  // Gradient-like background with overlapping shapes
  view.add(<Rect ref={bg} width={1080} height={1920} fill={BG_COLOR} />);

  // Glow effect behind main text
  view.add(<Circle ref={glowCircle} size={600} fill={ACCENT_COLOR} opacity={0} y={-100} />);

  // Corner accents
  view.add(<Rect ref={cornerAccent1} width={300} height={300} x={-390} y={-810} rotation={45} fill={GREEN} opacity={0} />);
  view.add(<Rect ref={cornerAccent2} width={200} height={200} x={390} y={810} rotation={45} fill={PURPLE} opacity={0} />);

  // "GIT" big text
  view.add(
    <Txt
      ref={mainTitle}
      text={'GIT'}
      fill={TEXT_COLOR}
      fontFamily={TITLE_FONT}
      fontSize={250}
      fontWeight={900}
      y={-300}
      opacity={0}
      letterSpacing={20}
    />
  );

  // Command name
  view.add(
    <Txt
      ref={commandTxt}
      text={'init'}
      fill={GREEN}
      fontFamily={CODE_FONT}
      fontSize={160}
      fontWeight={900}
      y={-50}
      opacity={0}
    />
  );

  // Big emoji
  view.add(<Txt ref={emoji} text={'🚀'} fontSize={200} y={250} opacity={0} />);

  // Subtitle
  view.add(
    <Txt
      ref={subtitleTxt}
      text={'Every Dev NEEDS This!'}
      fill={ORANGE}
      fontFamily={TITLE_FONT}
      fontSize={52}
      y={500}
      opacity={0}
      textAlign={'center'}
    />
  );

  // Episode badge
  view.add(
    <Rect ref={badge} x={350} y={-800} width={180} height={180} radius={90} fill={RED} opacity={0} scale={0}>
      <Txt text={'#1'} fill={'#fff'} fontFamily={TITLE_FONT} fontSize={70} fontWeight={900} />
    </Rect>
  );

  // === THUMBNAIL 1: git init ===
  yield* all(
    glowCircle().opacity(0.08, 0.3),
    cornerAccent1().opacity(0.15, 0.3),
    cornerAccent2().opacity(0.15, 0.3),
    mainTitle().opacity(1, 0.3),
    commandTxt().opacity(1, 0.3),
    emoji().opacity(1, 0.3),
    subtitleTxt().opacity(1, 0.3),
    badge().opacity(1, 0.3),
    badge().scale(1, 0.3, easeOutCubic),
  );

  // Hold for screenshot - THUMBNAIL 1
  yield* waitFor(2);

  // === THUMBNAIL 2: git clone ===
  yield* all(
    commandTxt().text('clone', 0.3),
    commandTxt().fill(PURPLE, 0.3),
    emoji().text('📦', 0.3),
    glowCircle().fill(PURPLE, 0.3),
    subtitleTxt().text('Copy ANY Repo Instantly!', 0.3),
  );
  badge().findFirst<Txt>(node => node instanceof Txt)
  // Update badge text manually
  yield* waitFor(2);

  // === THUMBNAIL 3: git add & commit ===
  yield* all(
    commandTxt().text('commit', 0.3),
    commandTxt().fill(ORANGE, 0.3),
    emoji().text('💾', 0.3),
    glowCircle().fill(ORANGE, 0.3),
    subtitleTxt().text('Save Your Code RIGHT!', 0.3),
  );
  yield* waitFor(2);

  // === THUMBNAIL 4: git push & pull ===
  yield* all(
    commandTxt().text('push', 0.3),
    commandTxt().fill(ACCENT_COLOR, 0.3),
    emoji().text('☁️', 0.3),
    glowCircle().fill(ACCENT_COLOR, 0.3),
    subtitleTxt().text('Sync Like a PRO!', 0.3),
  );
  yield* waitFor(2);

  // === THUMBNAIL 5: git branch ===
  yield* all(
    commandTxt().text('branch', 0.3),
    commandTxt().fill(CYAN, 0.3),
    emoji().text('🌿', 0.3),
    glowCircle().fill(CYAN, 0.3),
    subtitleTxt().text('Work Without FEAR!', 0.3),
  );
  yield* waitFor(2);

  // === THUMBNAIL 6: git merge ===
  yield* all(
    commandTxt().text('merge', 0.3),
    commandTxt().fill(RED, 0.3),
    emoji().text('🔀', 0.3),
    glowCircle().fill(RED, 0.3),
    subtitleTxt().text('Combine Code EASILY!', 0.3),
  );
  yield* waitFor(2);

  // === THUMBNAIL 7: git status & log ===
  yield* all(
    commandTxt().text('status', 0.3),
    commandTxt().fill(GREEN, 0.3),
    emoji().text('📋', 0.3),
    glowCircle().fill(GREEN, 0.3),
    subtitleTxt().text("Know What's CHANGED!", 0.3),
  );
  yield* waitFor(2);

  // === THUMBNAIL 8: git stash ===
  yield* all(
    commandTxt().text('stash', 0.3),
    commandTxt().fill(ORANGE, 0.3),
    emoji().text('🗃️', 0.3),
    glowCircle().fill(ORANGE, 0.3),
    subtitleTxt().text('Secret Dev TRICK!', 0.3),
  );
  yield* waitFor(2);
});
