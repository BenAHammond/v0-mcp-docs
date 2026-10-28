/**
 * Season icons for the header switcher.
 *
 * Each icon is drawn from the same shape data the background uses (the leaf
 * path, the snowflake geometry, the petal paths, the cloud puff layout) so the
 * switcher never introduces a second, divergent representation of a shape. All
 * icons take the current text colour via `fill`/`stroke` `currentColor`, so
 * they inherit the foreground colour wherever they are placed.
 *
 * Sizes are set by the caller through `className` (width/height); every icon
 * has its own intrinsic viewBox.
 */

import { CLOUD_PATHS, PETAL_PATHS } from "./config"
import { LEAF_PATH, SNOWFLAKE_ICON_PATH } from "./shapes"

type IconProps = { className?: string }

/** Autumn — the leaf: pointed tip, rounded base, a short stem, tilted up-right. */
export function LeafIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <g transform="rotate(40 12 12)">
        <path d={LEAF_PATH} />
        <path
          d="M12 20.2 L12 22.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}

/** Winter — a canonical six-arm snowflake (hexagonal plate). */
export function SnowflakeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d={SNOWFLAKE_ICON_PATH} />
      </g>
    </svg>
  )
}

/** Spring — the whole-flower sakura: five notched petals around the centre. */
export function PetalIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <g>
        {[0, 72, 144, 216, 288].map((a) => (
          <path
            key={a}
            d={PETAL_PATHS.notched}
            transform={`rotate(${a} 12 12) translate(6 1) scale(0.5)`}
          />
        ))}
      </g>
    </svg>
  )
}

/** Summer — the classic cloud, the same single path as the drifting background. */
export function CloudIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 120 60" className={className} fill="currentColor" aria-hidden="true">
      <path d={CLOUD_PATHS.classic} />
    </svg>
  )
}

/** Effects off — a circle struck through with a diagonal slash. */
export function OffIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <line x1="5.6" y1="5.6" x2="18.4" y2="18.4" strokeLinecap="round" />
    </svg>
  )
}
