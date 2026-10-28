import type { Season } from "./seasons"

/**
 * Per-season configuration and viewport tunables for the seasonal background.
 *
 * Every season is described by a single `SeasonConfig` — a discriminated union
 * of a particle season (falling leaves / snowflakes / sakura) and a cloud season
 * (drifting summer clouds). A particle season holds a *weighted list* of shape
 * options; each option carries its own size and rotation ranges plus a weight
 * that `makeParticle` uses to pick one. Nothing here knows how to draw a shape —
 * `shapes.tsx` maps a shape kind to a renderer, and `makeParticle` accepts only
 * particle seasons.
 *
 * Spring's five sakura petals are defined here as data: the petal path variants,
 * the shared palette and the equal weights. `shapes.tsx` and the `ShapeView`
 * switch are the only places that branch on shape kind.
 *
 * The viewport tunables at the bottom are shared by `seasonal-effects.tsx`
 * (which computes pool sizes and parallax) and `theme.css` (which reads the
 * same travel distance via `--fall-travel`). They live here so there is exactly
 * one source of truth.
 */

export type Range = [number, number]

export type ParticleSeason = Exclude<Season, "summer">

/* ── Spring petal geometry & palette (data, not rendering) ────────────── */

/** The five petal silhouette variants. */
export type PetalVariant = "notched" | "rounded" | "slim" | "lopsided" | "wide"

/**
 * Petal path variants — each a single `<path>` `d` in a `0 0 24 24` viewBox,
 * flat fill, no stroke, pointing up from the (12,12) centre. Each falls as a
 * lone petal.
 */
export const PETAL_PATHS: Record<PetalVariant, string> = {
  notched:
    "M12 22 C7 17 4.5 12 5.5 7.5 C6.2 4.3 9 2.2 10.6 3 C11.4 3.4 11.8 4.6 12 6 C12.2 4.6 12.6 3.4 13.4 3 C15 2.2 17.8 4.3 18.5 7.5 C19.5 12 17 17 12 22 Z",
  rounded:
    "M12 22 C7.5 17.5 5 12.5 5.5 8 C6 4.5 8.8 2.5 12 2.5 C15.2 2.5 18 4.5 18.5 8 C19 12.5 16.5 17.5 12 22 Z",
  slim:
    "M9 22 C7 16 8 8 14 2.5 C17.5 6 17.5 12 15 16.5 C13.5 19 11.5 21 9 22 Z",
  lopsided:
    "M11 22 C6.5 17 4 12 5 7.5 C5.8 4 8.8 2 10.4 3.2 C11.2 3.8 11.6 5.2 11.8 6.8 C12.4 5.4 13.4 4.4 14.6 4.2 C17 3.8 19 6.5 18.8 9.8 C18.5 14 15.5 18.5 11 22 Z",
  wide:
    "M12 21.5 C6.5 18 3.5 13 4.5 8.5 C5.3 5 8.5 3 11 4 C11.5 4.2 11.8 4.6 12 5 C12.2 4.6 12.5 4.2 13 4 C15.5 3 18.7 5 19.5 8.5 C20.5 13 17.5 18 12 21.5 Z",
}

/** Spring palette — petals pick one of these uniformly. */
export const PETAL_PALETTE = ["#F7C1D0", "#F4A6BD", "#EE8AAE", "#E9779F", "#FBD9E2"]

/* ── Particle seasons ─────────────────────────────────────────────────── */

export type ParticleShapeKind = "snowflake" | "leaf" | "petal"

/** Motion ranges shared by every shape in a season (everything except size). */
export type SharedMotionRanges = {
  nearFall: Range // one fall traversal, s
  farFall: Range
  nearSway: Range // drift + rock cycle, s
  farSway: Range
  rockAmp: Range // in-plane rock amplitude, deg
  nearDrift: Range // horizontal drift amplitude, px
  farDrift: Range
  nearOpacity: Range
  farOpacity: Range
}

/**
 * Rotation ranges, expressed as *whole-turn counts* (not degrees). The actual
 * rotation is `count × shapeSymmetry(shape)` so that one loop always ends at a
 * visually identical orientation (a whole multiple of the shape's rotational
 * symmetry on each axis) — the key to a seamless infinite loop.
 */
export type RotationRanges = {
  x: Range
  y: Range
  z: Range
}

/**
 * One shape a particle season can emit, with its weight and its own size and
 * rotation ranges. `makeParticle` picks an option by weight, builds its shape,
 * then derives size + rotation from the chosen option's ranges (and the shared
 * motion ranges from the season). `petalVariant` is set only when `kind` is
 * `"petal"`.
 */
export type ShapeOption = {
  kind: ParticleShapeKind
  petalVariant?: PetalVariant
  weight: number
  nearSize: Range // rendered size, px
  farSize: Range
  rotation: RotationRanges
}

export type ParticleConfig = {
  kind: "particle"
  density: number // particles per reference area (see poolSize)
  shapes: ShapeOption[]
  motion: SharedMotionRanges
}

/* ── Cloud season ─────────────────────────────────────────────────────── */

/** Distinct cloud silhouettes, all drawn in the shared `0 0 120 60` viewBox. */
export type CloudVariant = "classic" | "long" | "puff" | "tall"

/**
 * Each cloud is a single filled `<path>` (no overlapping puffs). The `d` strings
 * live here — one source of truth shared by the background renderer and the
 * header switcher's summer icon.
 */
export const CLOUD_PATHS: Record<CloudVariant, string> = {
  classic:
    "M20 44 A13 13 0 0 1 22 22 A20 20 0 0 1 58 14 A16 16 0 0 1 88 24 A12 12 0 0 1 96 44 A34 34 0 0 1 58 50 A34 34 0 0 1 20 44 Z",
  long:
    "M14 44 A11 11 0 0 1 18 27 A15 15 0 0 1 44 20 A18 18 0 0 1 76 16 A14 14 0 0 1 100 28 A10 10 0 0 1 106 44 A26 26 0 0 1 78 49 A32 32 0 0 1 44 50 A28 28 0 0 1 14 44 Z",
  puff:
    "M30 42 A12 12 0 0 1 34 25 A19 19 0 0 1 70 22 A14 14 0 0 1 84 42 A34 34 0 0 1 30 42 Z",
  tall:
    "M16 46 A11 11 0 0 1 20 31 A13 13 0 0 1 40 20 A17 17 0 0 1 70 12 A13 13 0 0 1 90 26 A12 12 0 0 1 102 46 A36 36 0 0 1 62 52 A40 40 0 0 1 16 46 Z",
}

/** One cloud silhouette option: a variant, its path, and its pick weight. */
export type CloudShapeOption = {
  variant: CloudVariant
  path: string
  weight: number
}

export type CloudConfig = {
  kind: "cloud"
  density: number // clouds per reference area
  clouds: CloudShapeOption[] // equal-weight silhouettes (see summer)
  nearWidth: Range
  farWidth: Range
  nearDuration: Range // horizontal drift traversal, s
  farDuration: Range
  nearOpacity: Range
  farOpacity: Range
  topNear: Range // vertical position, vh
  topFar: Range
  delayMax: number // negative delay magnitude (start partway across)
  bobDuration: Range
  nearBob: Range // vertical bob amplitude, px
  farBob: Range
}

export type SeasonConfig = ParticleConfig | CloudConfig

/* ── The config table ─────────────────────────────────────────────────── */

/**
 * Keyed by `Season`. `satisfies` keeps the per-key literal types so indexing
 * with a `ParticleSeason` narrows to `ParticleConfig` (no cast) and indexing
 * with `"summer"` narrows to `CloudConfig` — `makeParticle("summer")` fails to
 * compile.
 */
export const SEASON_CONFIG = {
  winter: {
    kind: "particle",
    density: 200,
    shapes: [
      {
        kind: "snowflake",
        weight: 1,
        nearSize: [10, 20], farSize: [4, 9],
        rotation: { x: [2, 5], y: [2, 5], z: [6, 15] },
      },
    ],
    motion: {
      nearFall: [14, 22], farFall: [20, 32],
      nearSway: [3, 6], farSway: [5, 9],
      rockAmp: [10, 24], nearDrift: [8, 22], farDrift: [5, 14],
      nearOpacity: [0.7, 0.95], farOpacity: [0.4, 0.62],
    },
  },
  spring: {
    kind: "particle",
    density: 35,
    shapes: [
      // Five petal silhouettes, equal weight (1 each).
      { kind: "petal", petalVariant: "notched", weight: 1, nearSize: [12, 20], farSize: [6, 10], rotation: { x: [1, 2], y: [1, 2], z: [1, 2] } },
      { kind: "petal", petalVariant: "rounded", weight: 1, nearSize: [12, 20], farSize: [6, 10], rotation: { x: [1, 2], y: [1, 2], z: [1, 2] } },
      { kind: "petal", petalVariant: "slim", weight: 1, nearSize: [12, 20], farSize: [6, 10], rotation: { x: [1, 2], y: [1, 2], z: [1, 2] } },
      { kind: "petal", petalVariant: "lopsided", weight: 1, nearSize: [12, 20], farSize: [6, 10], rotation: { x: [1, 2], y: [1, 2], z: [1, 2] } },
      { kind: "petal", petalVariant: "wide", weight: 1, nearSize: [12, 20], farSize: [6, 10], rotation: { x: [1, 2], y: [1, 2], z: [1, 2] } },
    ],
    motion: {
      nearFall: [10, 16], farFall: [14, 22],
      nearSway: [3, 5], farSway: [5, 8],
      rockAmp: [12, 30], nearDrift: [14, 36], farDrift: [8, 22],
      nearOpacity: [0.85, 1], farOpacity: [0.55, 0.75],
    },
  },
  summer: {
    kind: "cloud",
    density: 30,
    // Four silhouettes, equal weight (1 each) → uniform 25% each.
    clouds: [
      { variant: "classic", path: CLOUD_PATHS.classic, weight: 1 },
      { variant: "long", path: CLOUD_PATHS.long, weight: 1 },
      { variant: "puff", path: CLOUD_PATHS.puff, weight: 1 },
      { variant: "tall", path: CLOUD_PATHS.tall, weight: 1 },
    ],
    nearWidth: [140, 240], farWidth: [80, 150],
    nearDuration: [90, 120], farDuration: [110, 140],
    nearOpacity: [0.9, 1], farOpacity: [0.55, 0.8],
    // Spread over the full fall-travel period (124vh) so clouds fill the
    // viewport at every scroll offset. The old [2,26]/[2,18] ranges confined
    // every cloud to the top band of the viewport, which is why the sky
    // looked empty except for a cluster up top.
    topNear: [0, 124], topFar: [0, 124],
    delayMax: 140,
    bobDuration: [5, 9],
    nearBob: [4, 8], farBob: [2, 5],
  },
  autumn: {
    kind: "particle",
    density: 35,
    shapes: [
      {
        kind: "leaf",
        weight: 1,
        nearSize: [16, 26], farSize: [8, 13],
        rotation: { x: [1, 2], y: [1, 2], z: [1, 2] },
      },
    ],
    motion: {
      nearFall: [8, 14], farFall: [16, 24],
      nearSway: [3, 5], farSway: [5, 8],
      rockAmp: [14, 34], nearDrift: [16, 40], farDrift: [8, 24],
      nearOpacity: [0.6, 0.85], farOpacity: [0.35, 0.55],
    },
  },
} satisfies Record<Season, SeasonConfig>

/* ── Viewport tunables ────────────────────────────────────────────────── */

/** Reference viewport area (1440×900 px²) — density is defined against it. */
export const REFERENCE_AREA = 1440 * 900

/** Hard cap on area-scaled density: no season scales past 1.5× its base. */
export const CEILING = 1.5

/** Fall travel distance, in vh — one fall loop covers exactly this. */
export const FALL_TRAVEL_VH = 124

/** Parallax rates per layer (fraction of scrollY). */
export const PARALLAX = { far: 0.15, near: 0.3 }

/** Tumble perspective is this multiple of the particle's rendered size. */
export const PERSPECTIVE_MULTIPLE = 10

/** Low-RAM threshold (`navigator.deviceMemory`, Chrome only) that halves density. */
export const DEVICE_MEMORY_CAP = 2
export const DEVICE_MEMORY_FACTOR = 0.5

/**
 * Pool size for a season at a given viewport area: `density × (area / reference)`,
 * capped at `CEILING`× and halved on low-RAM devices. Clouds use the same formula
 * (their density is just smaller), so one function serves every season.
 * @param cfg - The season config, used only for its `density`.
 * @param area - The current viewport area in px².
 * @param deviceMemory - `navigator.deviceMemory` (Chrome only); undefined elsewhere.
 * @returns The number of particles/clouds to spawn (at least 1).
 */
export function poolSize(cfg: { density: number }, area: number, deviceMemory?: number): number {
  let n = cfg.density * (area / REFERENCE_AREA)
  n = Math.min(n, cfg.density * CEILING)
  if (deviceMemory !== undefined && deviceMemory <= DEVICE_MEMORY_CAP) n *= DEVICE_MEMORY_FACTOR
  return Math.max(1, Math.round(n))
}
