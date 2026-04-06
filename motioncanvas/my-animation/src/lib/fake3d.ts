/**
 * Fake 3D utilities for Motion Canvas using 2D primitives.
 *
 * Usage:
 *   import {addCube, addSphere, addCylinder, rotateCube3D} from '../lib/fake3d';
 *   const cube = addCube(view, {x: 0, y: 0, size: 150});
 *   yield* showCreate(cube.group);
 *   yield* rotateCube3D(cube, 360, 2);
 */

import {all, waitFor} from '@motion-canvas/core';
import {
  easeInOutCubic,
  easeOutCubic,
  easeInCubic,
  linear,
} from '@motion-canvas/core';
import {Node, Rect, Txt, Line, Circle} from '@motion-canvas/2d';
import type {View2D} from '@motion-canvas/2d';

// ─── Isometric Projection ────────────────────────────────

const ISO_X = 0.866; // cos(30°)
const ISO_Y = 0.5;   // sin(30°)

/** Convert 3D coords to 2D isometric. */
export function isoProject(x3d: number, y3d: number, z3d: number): [number, number] {
  const x2d = (x3d - z3d) * ISO_X;
  const y2d = -y3d + (x3d + z3d) * ISO_Y;
  return [x2d, y2d];
}

// ─── Cube ────────────────────────────────────────────────

export interface CubeConfig {
  x?: number;
  y?: number;
  size?: number;
  topColor?: string;
  leftColor?: string;
  rightColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
}

export interface CubeRefs {
  group: Node;
  top: Line;
  left: Line;
  right: Line;
}

/** Add an isometric cube. */
export function addCube(view: View2D, config: CubeConfig = {}): CubeRefs {
  const {
    x = 0, y = 0, size = 150,
    topColor = '#58a6ff',
    leftColor = '#1f6feb',
    rightColor = '#388bfd',
    strokeColor = '#0d1117',
    strokeWidth = 2,
  } = config;

  const s = size / 2;
  const group = new Node({x, y, opacity: 0, scale: 0});
  view.add(group);

  // 8 corners in iso
  const ftl = isoProject(-s, s, -s);
  const ftr = isoProject(s, s, -s);
  const fbl = isoProject(-s, -s, -s);
  const fbr = isoProject(s, -s, -s);
  const btl = isoProject(-s, s, s);
  const btr = isoProject(s, s, s);
  const bbl = isoProject(-s, -s, s);
  const bbr = isoProject(s, -s, s);

  // Top face
  const top = new Line({
    points: [ftl, ftr, btr, btl],
    closed: true,
    fill: topColor,
    stroke: strokeColor,
    lineWidth: strokeWidth,
  });
  group.add(top);

  // Left face
  const left = new Line({
    points: [ftl, btl, bbl, fbl],
    closed: true,
    fill: leftColor,
    stroke: strokeColor,
    lineWidth: strokeWidth,
  });
  group.add(left);

  // Right face
  const right = new Line({
    points: [ftr, fbr, bbr, btr],
    closed: true,
    fill: rightColor,
    stroke: strokeColor,
    lineWidth: strokeWidth,
  });
  group.add(right);

  return {group, top, left, right};
}

/** Fake 3D rotation by scaling/skewing the cube group. */
export function* rotateCube3D(cube: CubeRefs, degrees = 360, duration = 2) {
  // Simulate rotation with scale oscillation
  const steps = 60;
  const stepDur = duration / steps;
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * degrees * (Math.PI / 180);
    const sx = Math.cos(angle);
    const skew = Math.sin(angle) * 0.3;
    cube.group.scale([Math.abs(sx) * 0.8 + 0.2, 1]);
    cube.group.rotation(Math.sin(angle) * 15);
    yield* waitFor(stepDur);
  }
  cube.group.scale(1);
  cube.group.rotation(0);
}

/** Animate cube appearing. */
export function* showCube(cube: CubeRefs, duration = 0.6) {
  yield* all(
    cube.group.opacity(1, duration * 0.5),
    cube.group.scale(1, duration, easeOutCubic),
  );
}

/** Animate cube disappearing. */
export function* hideCube(cube: CubeRefs, duration = 0.4) {
  yield* all(
    cube.group.opacity(0, duration),
    cube.group.scale(0, duration, easeInCubic),
  );
}

// ─── Sphere ──────────────────────────────────────────────

export interface SphereConfig {
  x?: number;
  y?: number;
  radius?: number;
  color?: string;
  highlightColor?: string;
  shadowColor?: string;
  rings?: number;
}

export interface SphereRefs {
  group: Node;
  body: Circle;
  highlight: Circle;
  rings: Circle[];
}

/** Add a fake 3D sphere with highlight and latitude rings. */
export function addSphere(view: View2D, config: SphereConfig = {}): SphereRefs {
  const {
    x = 0, y = 0, radius = 80,
    color = '#58a6ff',
    highlightColor = '#ffffff',
    shadowColor = '#1f6feb',
    rings = 3,
  } = config;

  const group = new Node({x, y, opacity: 0, scale: 0});
  view.add(group);

  // Shadow underneath
  const shadow = new Circle({
    size: radius * 1.6,
    y: radius * 0.8,
    fill: '#000000',
    opacity: 0.15,
    scale: [1, 0.3],
  });
  group.add(shadow);

  // Main body
  const body = new Circle({
    size: radius * 2,
    fill: color,
  });
  group.add(body);

  // Gradient overlay (darker bottom)
  const gradientOverlay = new Circle({
    size: radius * 2,
    fill: shadowColor,
    opacity: 0.4,
    y: radius * 0.3,
    scale: [1, 0.7],
  });
  group.add(gradientOverlay);

  // Highlight (specular)
  const highlight = new Circle({
    size: radius * 0.6,
    x: -radius * 0.25,
    y: -radius * 0.3,
    fill: highlightColor,
    opacity: 0.35,
  });
  group.add(highlight);

  // Latitude rings (ellipses)
  const ringRefs: Circle[] = [];
  for (let i = 1; i <= rings; i++) {
    const yOff = -radius + (i * 2 * radius) / (rings + 1);
    const ringWidth = Math.sqrt(radius * radius - yOff * yOff) * 2;
    const ring = new Circle({
      size: ringWidth,
      y: yOff,
      stroke: highlightColor,
      lineWidth: 1.5,
      opacity: 0.2,
      scale: [1, 0.25],
    });
    group.add(ring);
    ringRefs.push(ring);
  }

  return {group, body, highlight, rings: ringRefs};
}

/** Animate sphere appearing. */
export function* showSphere(sphere: SphereRefs, duration = 0.6) {
  yield* all(
    sphere.group.opacity(1, duration * 0.5),
    sphere.group.scale(1, duration, easeOutCubic),
  );
}

/** Fake spin by oscillating highlight position. */
export function* spinSphere(sphere: SphereRefs, duration = 2) {
  const steps = 60;
  const stepDur = duration / steps;
  const r = sphere.body.size() / 2;
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    sphere.highlight.x(Math.cos(angle) * r * 0.3);
    sphere.highlight.y(-r * 0.3 + Math.sin(angle) * r * 0.1);
    yield* waitFor(stepDur);
  }
}

// ─── Cylinder ────────────────────────────────────────────

export interface CylinderConfig {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  color?: string;
  topColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
}

export interface CylinderRefs {
  group: Node;
  body: Rect;
  topEllipse: Circle;
  bottomEllipse: Circle;
}

/** Add a fake 3D cylinder. */
export function addCylinder(view: View2D, config: CylinderConfig = {}): CylinderRefs {
  const {
    x = 0, y = 0,
    width = 120, height = 200,
    color = '#3fb950',
    topColor = '#56d364',
    strokeColor = '#0d1117',
    strokeWidth = 2,
  } = config;

  const ellipseH = width * 0.3;
  const group = new Node({x, y, opacity: 0, scale: 0});
  view.add(group);

  // Bottom ellipse
  const bottomEllipse = new Circle({
    size: width,
    y: height / 2,
    scale: [1, ellipseH / width],
    fill: color,
    stroke: strokeColor,
    lineWidth: strokeWidth,
  });
  group.add(bottomEllipse);

  // Body (rect connecting top and bottom)
  const body = new Rect({
    width,
    height,
    fill: color,
    stroke: strokeColor,
    lineWidth: 0,
  });
  group.add(body);

  // Side edges
  const leftEdge = new Line({
    points: [[-width / 2, -height / 2], [-width / 2, height / 2]],
    stroke: strokeColor,
    lineWidth: strokeWidth,
  });
  group.add(leftEdge);

  const rightEdge = new Line({
    points: [[width / 2, -height / 2], [width / 2, height / 2]],
    stroke: strokeColor,
    lineWidth: strokeWidth,
  });
  group.add(rightEdge);

  // Top ellipse
  const topEllipse = new Circle({
    size: width,
    y: -height / 2,
    scale: [1, ellipseH / width],
    fill: topColor,
    stroke: strokeColor,
    lineWidth: strokeWidth,
  });
  group.add(topEllipse);

  return {group, body, topEllipse, bottomEllipse};
}

/** Animate cylinder appearing. */
export function* showCylinder(cyl: CylinderRefs, duration = 0.6) {
  yield* all(
    cyl.group.opacity(1, duration * 0.5),
    cyl.group.scale(1, duration, easeOutCubic),
  );
}

/** Animate cylinder growing from zero height. */
export function* growCylinder(cyl: CylinderRefs, duration = 0.8) {
  cyl.group.opacity(1);
  cyl.group.scale([1, 0]);
  yield* cyl.group.scale(1, duration, easeOutCubic);
}

// ─── Cone ────────────────────────────────────────────────

export interface ConeRefs {
  group: Node;
  body: Line;
  base: Circle;
}

/** Add a fake 3D cone. */
export function addCone(view: View2D, config: {
  x?: number; y?: number;
  width?: number; height?: number;
  color?: string; baseColor?: string;
  strokeColor?: string; strokeWidth?: number;
} = {}): ConeRefs {
  const {
    x = 0, y = 0,
    width = 120, height = 180,
    color = '#d29922',
    baseColor = '#b07d19',
    strokeColor = '#0d1117',
    strokeWidth = 2,
  } = config;

  const group = new Node({x, y, opacity: 0, scale: 0});
  view.add(group);

  // Triangular body
  const body = new Line({
    points: [
      [0, -height / 2],
      [width / 2, height / 2],
      [-width / 2, height / 2],
    ],
    closed: true,
    fill: color,
    stroke: strokeColor,
    lineWidth: strokeWidth,
  });
  group.add(body);

  // Base ellipse
  const base = new Circle({
    size: width,
    y: height / 2,
    scale: [1, 0.3],
    fill: baseColor,
    stroke: strokeColor,
    lineWidth: strokeWidth,
  });
  group.add(base);

  return {group, body, base};
}

// ─── Torus (donut) ───────────────────────────────────────

export interface TorusRefs {
  group: Node;
  rings: Circle[];
}

/** Add a fake 3D torus (donut shape). */
export function addTorus(view: View2D, config: {
  x?: number; y?: number;
  outerRadius?: number; tubeRadius?: number;
  color?: string; highlightColor?: string;
  segments?: number;
} = {}): TorusRefs {
  const {
    x = 0, y = 0,
    outerRadius = 100, tubeRadius = 35,
    color = '#bc8cff',
    highlightColor = '#d4b5ff',
    segments = 24,
  } = config;

  const group = new Node({x, y, opacity: 0, scale: 0});
  view.add(group);

  const rings: Circle[] = [];

  // Draw torus as overlapping circles along the ring path
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const cx = Math.cos(angle) * outerRadius;
    const cy = Math.sin(angle) * outerRadius * 0.4; // flatten for perspective
    const depth = Math.sin(angle); // -1 to 1, back to front

    // Skip back half (hidden)
    const isBack = depth < -0.1;

    const c = new Circle({
      x: cx,
      y: cy,
      size: tubeRadius * 2,
      fill: isBack ? color : highlightColor,
      opacity: isBack ? 0.3 : 0.7 + depth * 0.3,
      scale: [1, 0.6],
    });
    group.add(c);
    rings.push(c);
  }

  // Overlay front half again for depth
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const depth = Math.sin(angle);
    if (depth > 0.1) {
      const cx = Math.cos(angle) * outerRadius;
      const cy = Math.sin(angle) * outerRadius * 0.4;
      const c = new Circle({
        x: cx, y: cy,
        size: tubeRadius * 2,
        fill: highlightColor,
        opacity: 0.4 + depth * 0.4,
        scale: [1, 0.6],
      });
      group.add(c);
      rings.push(c);
    }
  }

  return {group, rings};
}

// ─── 3D Box with Label ───────────────────────────────────

/** Add a labeled isometric box (like a server/container). */
export function addLabeledCube(
  view: View2D,
  label: string,
  config: CubeConfig & {labelColor?: string; fontSize?: number} = {},
): CubeRefs & {label: Txt} {
  const cube = addCube(view, config);
  const {
    labelColor = '#ffffff',
    fontSize = 24,
  } = config as any;

  const txt = new Txt({
    text: label,
    fill: labelColor,
    fontFamily: 'JetBrains Mono, monospace',
    fontSize,
    fontWeight: 700,
    y: -10,
  });
  cube.group.add(txt);

  return {...cube, label: txt};
}

// ─── Platform / Floor ────────────────────────────────────

/** Add an isometric floor/platform. */
export function addPlatform(view: View2D, config: {
  x?: number; y?: number;
  width?: number; depth?: number;
  color?: string; strokeColor?: string;
} = {}): {group: Node; surface: Line} {
  const {
    x = 0, y = 0,
    width = 400, depth = 200,
    color = '#161b22',
    strokeColor = '#30363d',
  } = config;

  const w = width / 2;
  const d = depth / 2;
  const group = new Node({x, y, opacity: 0});
  view.add(group);

  // Isometric diamond
  const tl = isoProject(-w, 0, -d);
  const tr = isoProject(w, 0, -d);
  const br = isoProject(w, 0, d);
  const bl = isoProject(-w, 0, d);

  const surface = new Line({
    points: [tl, tr, br, bl],
    closed: true,
    fill: color,
    stroke: strokeColor,
    lineWidth: 2,
  });
  group.add(surface);

  return {group, surface};
}

// ─── Animate Helpers ─────────────────────────────────────

/** Show any fake3d object (has .group). */
export function* show3D(obj: {group: Node}, duration = 0.6) {
  yield* all(
    obj.group.opacity(1, duration * 0.5),
    obj.group.scale(1, duration, easeOutCubic),
  );
}

/** Hide any fake3d object. */
export function* hide3D(obj: {group: Node}, duration = 0.4) {
  yield* all(
    obj.group.opacity(0, duration),
    obj.group.scale(0, duration, easeInCubic),
  );
}

/** Float up and down (idle animation). */
export function* float3D(obj: {group: Node}, amplitude = 15, duration = 2) {
  const startY = obj.group.y();
  yield* obj.group.y(startY - amplitude, duration / 2, easeInOutCubic);
  yield* obj.group.y(startY + amplitude, duration / 2, easeInOutCubic);
  yield* obj.group.y(startY, duration / 4, easeInOutCubic);
}

/** Spin (rotate) any 3D object. */
export function* spin3D(obj: {group: Node}, degrees = 360, duration = 1) {
  yield* obj.group.rotation(obj.group.rotation() + degrees, duration, linear);
}
