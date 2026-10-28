/**
 * Season detection for the seasonal background effects.
 *
 * The active season drives both the floating particles (leaves / snowflakes /
 * flowers / clouds) and the page's CSS palette (see `theme.css`'s
 * `[data-season=…]` overrides).
 *
 * `resolveSeason` is the single source of truth for "what is the season right
 * now". It returns three things: the palette season, whether effects run, and
 * the explicit `?season=` choice (if any). The pre-paint script, the
 * `SeasonalEffects` component and the header switcher all call it — there is no
 * second copy of the resolution logic.
 *
 * Detection must run before the first paint, so `SEASON_SCRIPT` inlines the
 * same resolution into a `<body>` script (body scripts are emitted into the
 * static HTML; head scripts are not). It stamps two attributes on `<html>`:
 * `data-season` (the palette season, never "off") and `data-effects`
 * ("on" | "off"). The client component reads those attributes instead of
 * re-detecting.
 */

export type Season = "winter" | "spring" | "summer" | "autumn"

/**
 * An explicit `?season=` choice. `"off"` is not a season — it means "no
 * particles and no clouds, but the palette still follows the calendar".
 */
export type SeasonChoice = Season | "off"

/**
 * Meteorological season for a zero-based month (0 = January).
 *   winter — Dec, Jan, Feb  (11, 0, 1)
 *   spring — Mar, Apr, May  (2, 3, 4)
 *   summer — Jun, Jul, Aug  (5, 6, 7)
 *   autumn — Sep, Oct, Nov  (8, 9, 10)
 * @param month - Zero-based month (0 = January).
 * @returns The calendar season for that month.
 */
export function seasonForMonth(month: number): Season {
  if (month === 11 || month <= 1) return "winter"
  if (month <= 4) return "spring"
  if (month <= 7) return "summer"
  return "autumn"
}

/**
 * Parse a `?season=` value into an explicit choice. `fall` is accepted as an
 * alias for `autumn`; `off` is accepted as "effects off". Case- and
 * whitespace-insensitive; anything else is `null`.
 * @param value - The raw `?season=` query value, or null when absent.
 * @returns The explicit choice, or null when invalid.
 */
export function parseChoice(value: string | null): SeasonChoice | null {
  if (!value) return null
  const v = value.trim().toLowerCase()
  if (v === "off") return "off"
  if (v === "fall") return "autumn"
  if (v === "winter" || v === "spring" || v === "summer" || v === "autumn") return v
  return null
}

/**
 * Parse a `?season=` value as a season only (no `off`). `fall` → `autumn`.
 * @param value - The raw `?season=` query value, or null when absent.
 * @returns The season, or null when the value is `off` or invalid.
 */
export function parseSeason(value: string | null): Season | null {
  const choice = parseChoice(value)
  return choice === "off" ? null : choice
}

/** The three facts any consumer needs about the current season. */
export type ResolvedSeason = {
  /** The season whose palette applies — always a real season, never "off". */
  palette: Season
  /** Whether the floating particles/clouds should run. */
  effects: boolean
  /** The explicit `?season=` choice, or `null` when auto (the calendar). */
  explicit: SeasonChoice | null
}

/**
 * Resolve the active season from a query string and a zero-based month.
 *
 *   • no parameter, or an invalid value → automatic (the calendar's season),
 *     effects on, `explicit` null;
 *   • a valid season (or `fall`) → that season, effects on, `explicit` set;
 *   • `off` → palette follows the calendar, effects off, `explicit` "off".
 * @param search - The `window.location.search` string to read `?season=` from.
 * @param month - Zero-based month (0 = January) for the calendar fallback.
 * @returns The resolved palette, effects flag, and explicit choice.
 */
export function resolveSeason(search: string, month: number): ResolvedSeason {
  const choice = parseChoice(new URLSearchParams(search).get("season"))
  const calendar = seasonForMonth(month)
  if (choice === null) return { palette: calendar, effects: true, explicit: null }
  if (choice === "off") return { palette: calendar, effects: false, explicit: "off" }
  return { palette: choice, effects: true, explicit: choice }
}

/**
 * Resolve the palette season alone (the override wins, else the calendar).
 * @param search - The `window.location.search` string to read `?season=` from.
 * @param month - Zero-based month (0 = January) for the calendar fallback.
 * @returns The palette season.
 */
export function detectSeason(search: string, month: number): Season {
  return resolveSeason(search, month).palette
}

/**
 * Pre-paint `<body>` script. Inlines the same resolution as `resolveSeason` and
 * stamps it on `<html>` before the first paint. It is a hand-written literal
 * string rather than `${fn.toString()}`: the production minifier renames the
 * module functions (and their cross-references), so a `.toString()`-assembled
 * script would reference identifiers that no longer exist (e.g. `m is not
 * defined`). A test in `seasons.test.ts` asserts this string's logic matches
 * `resolveSeason` so the two copies cannot drift.
 */
export const SEASON_SCRIPT = `(function(){
  var seasonForMonth = function (month) {
    if (month === 11 || month <= 1) return "winter";
    if (month <= 4) return "spring";
    if (month <= 7) return "summer";
    return "autumn";
  };
  var parseChoice = function (value) {
    if (!value) return null;
    var v = value.trim().toLowerCase();
    if (v === "off") return "off";
    if (v === "fall") return "autumn";
    if (v === "winter" || v === "spring" || v === "summer" || v === "autumn") return v;
    return null;
  };
  var choice = parseChoice(new URLSearchParams(location.search).get("season"));
  var calendar = seasonForMonth(new Date().getMonth());
  var palette = calendar;
  var effects = true;
  if (choice === "off") { effects = false; }
  else if (choice !== null) { palette = choice; }
  document.documentElement.setAttribute("data-season", palette);
  document.documentElement.setAttribute("data-effects", effects ? "on" : "off");
})();`
