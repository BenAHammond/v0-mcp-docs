import type { CSSProperties } from "react"
import {
  CLOUD_PATHS,
  PERSPECTIVE_MULTIPLE,
  SEASON_CONFIG,
  PETAL_PATHS,
  PETAL_PALETTE,
  type CloudShapeOption,
  type CloudVariant,
  type ParticleSeason,
  type PetalVariant,
  type RotationRanges,
  type ShapeOption,
  type Range,
} from "./config"

/**
 * Particle shape renderers + factories for the seasonal background.
 *
 * A falling particle (leaf / snowflake / petal) shares one motion model — a
 * *mover* (fall + horizontal drift) carrying a *turner* (gyroscopic tumble +
 * in-plane rock), with the visual drawn twice P apart so the field tiles for the
 * parallax modulo wrap. Clouds drift horizontally and loop forever. Both are
 * rendered by `seasonal-effects.tsx`; this module only knows how to *make* and
 * *draw* one particle/cloud.
 */

const rand = (min: number, max: number) => min + Math.random() * (max - min)
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
const fmt = (n: number) => Number(n.toFixed(2))

/* ── Palettes ─────────────────────────────────────────────────────────── */

// Autumn foliage, lightest → darkest (kept from the original leaf effect).
const LEAF_PALETTE = [
  "#e0a84c", "#d9a441", "#daa520", "#c9962e", "#cd853f", "#cc6b3d", "#b8860b",
  "#d2691e", "#c9642e", "#b8502a", "#b87333", "#a65e2e", "#a63a2b", "#a0522d",
  "#8b4513", "#7b4a22",
]

// Snowflake strokes: icy blue-gray tones that stay visible on the pale cool
// winter background (pure white would wash out against a near-white sky).
const SNOW_PALETTE = ["#dbe8f4", "#cfdfee", "#c2d3e6", "#b5c8dd", "#a9bdd3"]

// Spring petal/centre palette now lives in config.ts (PETAL_PALETTE).

// The single leaf silhouette — a pointed tip over a rounded base — shared by the
// background renderer and the header switcher's autumn icon (see `icons.tsx`).
// A rounded (not pointed) base keeps it reading as a leaf rather than a flame.
// Kept as one path string so the two never drift apart.
export const LEAF_PATH =
  "M12 3 C8 6.5 6.5 10.5 6.5 14 C6.5 18 8.8 20.2 12 20.2 C15.2 20.2 17.5 18 17.5 14 C17.5 10.5 16 6.5 12 3 Z"

/* ── Types ────────────────────────────────────────────────────────────── */

/** Shared animation parameters for any falling particle. */
type ParticleMotion = {
  left: number // horizontal position, viewport %
  size: number // rendered size, px
  fallDuration: number // one top-to-bottom traversal, s
  fallDelay: number // negative = start mid-fall, s
  swayDuration: number // drift + rock cycle, s
  swayDelay: number // negative = start mid-cycle, s
  driftX: number // horizontal drift amplitude, px
  rockBase: number // resting rock orientation, deg
  rockAmp: number // rock rotation amplitude, deg
  tumbleX: number // X-axis gyroscopic rotation over one fall, deg
  tumbleY: number
  tumbleZ: number
  opacity: number
}

type LeafShape = {
  kind: "leaf"
  color: string
  foldSide: -1 | 0 | 1 // -1 left crease, 0 none, 1 right crease
  foldY: number // crease origin height along the midrib, viewBox units
}

type SnowflakeShape = {
  kind: "snowflake"
  color: string
  path: string // full 6-arm crystal as one <path> `d`
  centerDot: boolean
}

type PetalShape = {
  kind: "petal"
  variant: PetalVariant
  color: string
  path: string // one <path> `d` in the 24-box, flat fill, no stroke
}

export type Shape = LeafShape | SnowflakeShape | PetalShape

export type Particle = { id: number; near: boolean; motion: ParticleMotion; shape: Shape }

export type Cloud = {
  id: number
  near: boolean
  variant: CloudVariant
  top: number // vertical position, vh
  width: number // rendered width, px
  opacity: number
  duration: number // horizontal drift duration, s
  delay: number // negative = start partway across, s
  bobDuration: number // vertical bob cycle, s
  bobDistance: number // vertical bob amplitude, px
}

/* ── Factories ────────────────────────────────────────────────────────── */

/** Rotational symmetry of a shape, in degrees, per axis — see config.RotationRanges. */
function shapeSymmetry(shape: Shape): { x: number; y: number; z: number } {
  switch (shape.kind) {
    case "snowflake":
      // 6-fold around Z. X/Y are only 1-fold here: every flake gets a random
      // global rotation in [0°, 60°) in `makeSnowflakeShape`, so its mirror
      // axes are *not* aligned with the particle's fixed X/Y axes — a 180° flip
      // would land visibly different. Only a full turn is seamless on X/Y.
      return { x: 360, y: 360, z: 60 }
    case "leaf":
      return { x: 360, y: 360, z: 360 } // 1-fold — only a full turn looks seamless
    case "petal":
      return { x: 360, y: 360, z: 360 } // 1-fold — a petal has no rotational symmetry
  }
}

/**
 * Rotation over one fall loop, in degrees. `quanta` samples a whole-turn count
 * from the config range, then multiplies by the shape's symmetry so the loop
 * always lands on a visually identical orientation (requirement 8). Sign is
 * random so neighbours spin in both directions.
 */
function rotationFor(r: RotationRanges, shape: Shape): { x: number; y: number; z: number } {
  const s = shapeSymmetry(shape)
  const quanta = (range: Range) => Math.floor(rand(range[0], range[1] + 1))
  const signed = (n: number) => (Math.random() < 0.5 ? -n : n)
  return {
    x: signed(quanta(r.x) * s.x),
    y: signed(quanta(r.y) * s.y),
    z: signed(quanta(r.z) * s.z),
  }
}

/** Weighted pick over a season's shape options (weights need not sum to 1). */
function pickWeighted(options: ShapeOption[]): ShapeOption {
  const total = options.reduce((sum, o) => sum + o.weight, 0)
  let r = Math.random() * total
  for (const o of options) {
    r -= o.weight
    if (r < 0) return o
  }
  return options[options.length - 1]
}

/** Build the shape object for a config `ShapeOption`. */
function makeShape(option: ShapeOption): Shape {
  switch (option.kind) {
    case "snowflake":
      return makeSnowflakeShape()
    case "leaf":
      return makeLeafShape()
    case "petal":
      return makePetalShape(option.petalVariant ?? "notched")
  }
}

export function makeParticle(season: ParticleSeason, id: number): Particle {
  // `SEASON_CONFIG` is keyed by `Season`; indexing with a `ParticleSeason`
  // narrows to `ParticleConfig` (no cast — `makeParticle("summer")` won't type).
  const cfg = SEASON_CONFIG[season]
  const option = pickWeighted(cfg.shapes)
  const near = Math.random() < 0.45
  const m = cfg.motion
  const fallDuration = near ? rand(m.nearFall[0], m.nearFall[1]) : rand(m.farFall[0], m.farFall[1])
  const swayDuration = near ? rand(m.nearSway[0], m.nearSway[1]) : rand(m.farSway[0], m.farSway[1])
  const shape = makeShape(option)
  const rotation = rotationFor(option.rotation, shape)

  const motion: ParticleMotion = {
    left: rand(0, 100),
    size: near ? rand(option.nearSize[0], option.nearSize[1]) : rand(option.farSize[0], option.farSize[1]),
    fallDuration,
    // Every particle starts mid-fall (negative delay) so the sky is populated
    // from the first frame and the pool is steady-state — no spawn ramp.
    fallDelay: -rand(0, fallDuration),
    swayDuration,
    swayDelay: -rand(0, swayDuration),
    driftX: near ? rand(m.nearDrift[0], m.nearDrift[1]) : rand(m.farDrift[0], m.farDrift[1]),
    rockBase: rand(0, 360),
    rockAmp: rand(m.rockAmp[0], m.rockAmp[1]),
    tumbleX: rotation.x,
    tumbleY: rotation.y,
    tumbleZ: rotation.z,
    opacity: near ? rand(m.nearOpacity[0], m.nearOpacity[1]) : rand(m.farOpacity[0], m.farOpacity[1]),
  }

  return { id, near, motion, shape }
}

function makeLeafShape(): LeafShape {
  return {
    kind: "leaf",
    color: pick(LEAF_PALETTE),
    // Roughly half the leaves carry a subtle crease to one side.
    foldSide: Math.random() < 0.5 ? 0 : Math.random() < 0.5 ? -1 : 1,
    foldY: rand(7, 15),
  }
}

type SnowflakeBranch = { t: number; len: number; spread: number; sub: boolean }

/** Rotate (x, y) around (cx, cy) by `rad` radians. */
function rotatePt(cx: number, cy: number, x: number, y: number, rad: number): [number, number] {
  const dx = x - cx
  const dy = y - cy
  return [cx + dx * Math.cos(rad) - dy * Math.sin(rad), cy + dx * Math.sin(rad) + dy * Math.cos(rad)]
}

/**
 * Generate one unique snowflake. Every flake gets a random global rotation (the
 * six arms otherwise always point up/60°/…) and one of two crystal morphologies:
 *
 *   • stellar dendrite — six arms with 1–4 side-branch pairs, occasional fern
 *     sub-branches and a forked tip;
 *   • sectored plate — a hexagonal outline with radial spokes and, sometimes, a
 *     smaller inner hexagon.
 *
 * All geometry is folded into a single stroked path so each flake stays one
 * <path> node (cheap even at ~100 flakes).
 */
function makeSnowflakeShape(): SnowflakeShape {
  const color = pick(SNOW_PALETTE)
  // 6-fold symmetry means 0–60° already spans every distinct orientation.
  const rotation = (rand(0, 60) * Math.PI) / 180

  if (Math.random() < 0.3) {
    const radius = rand(6, 9.5)
    return {
      kind: "snowflake",
      color,
      path: platePath(radius, rotation, Math.random() < 0.5),
      centerDot: Math.random() < 0.3,
    }
  }

  const length = rand(6.5, 10.5)
  const branchCount = 1 + Math.floor(rand(0, 4)) // 1–4 pairs
  const branches: SnowflakeBranch[] = Array.from({ length: branchCount }, () => ({
    t: rand(0.3, 0.9),
    len: rand(1.4, 3.6),
    spread: rand(0.45, 1.0),
    sub: Math.random() < 0.35,
  })).sort((a, b) => a.t - b.t)

  return {
    kind: "snowflake",
    color,
    path: dendritePath(length, branches, Math.random() < 0.35, rotation),
    centerDot: Math.random() < 0.4,
  }
}

/** Build one arm's geometry in local coords, then rotate it into all six arms. */
function dendritePath(length: number, branches: SnowflakeBranch[], forkTip: boolean, rotation: number): string {
  // Local segments: arm pointing straight up from the 24-box centre (12,12).
  const local: [number, number, number, number][] = []
  local.push([12, 12, 12, 12 - length]) // main ray

  for (const b of branches) {
    const baseY = 12 - b.t * length
    for (const side of [-1, 1]) {
      const bx = 12 + side * b.len * Math.sin(b.spread)
      const by = baseY - b.len * Math.cos(b.spread)
      local.push([12, baseY, bx, by])
      if (b.sub) {
        // Shorter secondary branch off the end, angling further outward (fern-like).
        const subLen = b.len * 0.6
        const sx = bx + side * subLen * Math.sin(b.spread + 0.6)
        const sy = by - subLen * Math.cos(b.spread + 0.6)
        local.push([bx, by, sx, sy])
      }
    }
  }

  if (forkTip) {
    const forkLen = 1.7
    const spread = 0.55
    for (const side of [-1, 1]) {
      local.push([12, 12 - length, 12 + side * forkLen * Math.sin(spread), 12 - length - forkLen * Math.cos(spread)])
    }
  }

  const segs: string[] = []
  for (let k = 0; k < 6; k++) {
    const ang = rotation + (k * Math.PI) / 3
    for (const [x1, y1, x2, y2] of local) {
      const a = rotatePt(12, 12, x1, y1, ang)
      const b = rotatePt(12, 12, x2, y2, ang)
      segs.push(`M${fmt(a[0])} ${fmt(a[1])} L${fmt(b[0])} ${fmt(b[1])}`)
    }
  }
  return segs.join(" ")
}

/** Hexagonal plate: radial spokes + outline, optionally an inner hexagon. */
function platePath(radius: number, rotation: number, inner: boolean): string {
  const verts: [number, number][] = []
  const segs: string[] = []

  for (let k = 0; k < 6; k++) {
    const ang = rotation + (k * Math.PI) / 3
    const v = rotatePt(12, 12, 12, 12 - radius, ang)
    verts.push(v)
    segs.push(`M12 12 L${fmt(v[0])} ${fmt(v[1])}`) // spoke
  }
  for (let k = 0; k < 6; k++) {
    const a = verts[k]
    const b = verts[(k + 1) % 6]
    segs.push(`M${fmt(a[0])} ${fmt(a[1])} L${fmt(b[0])} ${fmt(b[1])}`) // edge
  }
  if (inner) {
    const r2 = radius * 0.55
    const hex: string[] = []
    for (let k = 0; k < 6; k++) {
      const ang = rotation + (k * Math.PI) / 3
      const p = rotatePt(12, 12, 12, 12 - r2, ang)
      hex.push(`${fmt(p[0])},${fmt(p[1])}`)
    }
    segs.push(`M${hex.join(" L")} Z`)
  }
  return segs.join(" ")
}

/**
 * A canonical, deterministic snowflake for the header switcher's winter icon —
 * a hexagonal plate built by the exact same geometry the background uses, but
 * with fixed parameters so the icon never changes between renders.
 */
export const SNOWFLAKE_ICON_PATH = platePath(8.5, 0, true)

function makePetalShape(variant: PetalVariant): PetalShape {
  return {
    kind: "petal",
    variant,
    color: pick(PETAL_PALETTE),
    path: PETAL_PATHS[variant],
  }
}

/** Weighted pick over the summer cloud silhouettes (weights live in config). */
function pickCloudOption(options: CloudShapeOption[]): CloudShapeOption {
  const total = options.reduce((sum, o) => sum + o.weight, 0)
  let r = Math.random() * total
  for (const o of options) {
    r -= o.weight
    if (r < 0) return o
  }
  return options[options.length - 1]
}

export function makeCloud(id: number): Cloud {
  const cfg = SEASON_CONFIG.summer
  const near = Math.random() < 0.5
  return {
    id,
    near,
    variant: pickCloudOption(cfg.clouds).variant,
    top: near ? rand(cfg.topNear[0], cfg.topNear[1]) : rand(cfg.topFar[0], cfg.topFar[1]),
    width: near ? rand(cfg.nearWidth[0], cfg.nearWidth[1]) : rand(cfg.farWidth[0], cfg.farWidth[1]),
    opacity: near ? rand(cfg.nearOpacity[0], cfg.nearOpacity[1]) : rand(cfg.farOpacity[0], cfg.farOpacity[1]),
    duration: near ? rand(cfg.nearDuration[0], cfg.nearDuration[1]) : rand(cfg.farDuration[0], cfg.farDuration[1]),
    delay: -rand(0, cfg.delayMax),
    bobDuration: rand(cfg.bobDuration[0], cfg.bobDuration[1]),
    bobDistance: near ? rand(cfg.nearBob[0], cfg.nearBob[1]) : rand(cfg.farBob[0], cfg.farBob[1]),
  }
}

/* ── Renderers ────────────────────────────────────────────────────────── */

function ShapeView({ shape, size, opacity }: { shape: Shape; size: number; opacity: number }) {
  switch (shape.kind) {
    case "leaf":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} opacity={opacity} aria-hidden="true">
          {/* Pointed-tip leaf over a rounded base. */}
          <path fill={shape.color} d={LEAF_PATH} />
          <g fill="none" stroke="rgba(0,0,0,0.22)" strokeLinecap="round">
            <path d="M12 3.2 L12 19.8" strokeWidth="1" />
            {shape.foldSide !== 0 && (
              <path
                d={`M12 ${shape.foldY} Q ${12 + shape.foldSide * 2.2} ${shape.foldY - 1.5} ${12 + shape.foldSide * 4.2} ${shape.foldY + 2}`}
                strokeWidth="0.8"
              />
            )}
          </g>
        </svg>
      )
    case "snowflake":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} opacity={opacity} aria-hidden="true">
          <g fill="none" stroke={shape.color} strokeWidth="1.4" strokeLinecap="round">
            <path d={shape.path} />
          </g>
          {shape.centerDot && <circle cx="12" cy="12" r="1.4" fill={shape.color} />}
        </svg>
      )
    case "petal":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size} opacity={opacity} aria-hidden="true">
          <path d={shape.path} fill={shape.color} />
        </svg>
      )
  }
}

export function ParticleView({ particle }: { particle: Particle }) {
  const m = particle.motion
  const mover = {
    left: `${m.left}%`,
    "--fall-duration": `${m.fallDuration}s`,
    "--fall-delay": `${m.fallDelay}s`,
    "--sway-duration": `${m.swayDuration}s`,
    "--sway-delay": `${m.swayDelay}s`,
    "--drift-x": `${m.driftX}px`,
  } as CSSProperties
  const turner = {
    "--rock-base": `${m.rockBase}deg`,
    "--rock-amp": `${m.rockAmp}deg`,
    "--tumble-x": `${m.tumbleX}deg`,
    "--tumble-y": `${m.tumbleY}deg`,
    "--tumble-z": `${m.tumbleZ}deg`,
    "--perspective": `${m.size * PERSPECTIVE_MULTIPLE}px`,
  } as CSSProperties
  const shape = <ShapeView shape={particle.shape} size={m.size} opacity={m.opacity} />

  return (
    <span className="particle-mover" style={mover}>
      <span className="particle-turner" style={turner}>
        {shape}
      </span>
      <span className="particle-turner particle-turner--copy" style={turner}>
        {shape}
      </span>
    </span>
  )
}

export function CloudView({ cloud }: { cloud: Cloud }) {
  const style = {
    top: `${cloud.top}vh`,
    "--cloud-width": `${cloud.width}px`,
    "--cloud-duration": `${cloud.duration}s`,
    "--cloud-delay": `${cloud.delay}s`,
  } as CSSProperties
  const bob = {
    "--cloud-bob-duration": `${cloud.bobDuration}s`,
    "--cloud-bob-distance": `${cloud.bobDistance}px`,
  } as CSSProperties
  const path = CLOUD_PATHS[cloud.variant]
  const body = (
    <span className="cloud__bob" style={bob}>
      <svg
        viewBox="0 0 120 60"
        width={cloud.width}
        height={Math.round(cloud.width * (60 / 120))}
        opacity={cloud.opacity}
        aria-hidden="true"
      >
        <path fill="#ffffff" d={path} />
      </svg>
    </span>
  )

  return (
    <span className="cloud" style={style}>
      <span className="cloud--wrap">{body}</span>
      <span className="cloud--wrap cloud--wrap--copy">{body}</span>
    </span>
  )
}
