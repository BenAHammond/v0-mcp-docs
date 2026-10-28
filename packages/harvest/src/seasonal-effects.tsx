"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { parseSeason, resolveSeason, seasonForMonth, type Season } from "./seasons"
import { FALL_TRAVEL_VH, PARALLAX, SEASON_CONFIG, poolSize } from "./config"
import {
  makeParticle,
  makeCloud,
  ParticleView,
  CloudView,
  type Particle,
  type Cloud,
} from "./shapes"

/**
 * Seasonal background, rendered as a parallax layer behind the content.
 *
 * The season is resolved *before first paint* by an inline `<body>` script (see
 * `seasons.ts` → `SEASON_SCRIPT`), which stamps `data-season` on `<html>`. This
 * component re-stamps those attributes after every client-side navigation —
 * React re-renders `<html>` when the locale changes and strips attributes it
 * doesn't own — and rebuilds its pool from the resolved season.
 *
 * Each season renders a **fixed pool** of particles/clouds, created once on
 * mount and looping forever (the summer clouds' lifecycle, now shared by the
 * falling particles). There is no spawn timer, no per-particle removal, and no
 * re-seed on tab visibility — a looping CSS animation can't "drain" when a
 * background tab throttles timers, because it never finishes. The pool is sized
 * from the season's density × viewport area, capped at 1.5×, halved on low-RAM
 * devices, and rebuilt (debounced) on resize.
 *
 * Two fixed layers (far + near) fall/drift at different sizes/speeds and
 * parallax at different rates. The parallax writes `-((rate × scrollY) mod P)`
 * where P is the fall travel distance, so the background tiles seamlessly as you
 * scroll; each particle renders its visual twice, P apart, to make that modulo
 * wrap invisible. Motion is pure CSS animation (compositor thread).
 */

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)"

/** Positive modulo: `mod(a, n)` ∈ [0, n). */
const mod = (a: number, n: number) => ((a % n) + n) % n

function deviceMemory(): number | undefined {
  if (typeof navigator === "undefined") return undefined
  return (navigator as Navigator & { deviceMemory?: number }).deviceMemory
}

/** Read the season the inline `<head>` script already resolved. */
function readSeason(): Season {
  return parseSeason(document.documentElement.getAttribute("data-season"))
    ?? seasonForMonth(new Date().getMonth())
}

/** Read whether effects run — the script stamps `data-effects="off"` to disable them. */
function readEffects(): boolean {
  return document.documentElement.getAttribute("data-effects") !== "off"
}

/** Add/remove entries from a pool array so its length matches `count`. */
function resizePool<T>(prev: T[], count: number, make: (id: number) => T): T[] {
  if (prev.length === count) return prev
  if (prev.length < count) {
    const add = count - prev.length
    return [...prev, ...Array.from({ length: add }, (_, i) => make(prev.length + i))]
  }
  return prev.slice(0, count)
}

export default function SeasonalEffects() {
  const [season, setSeason] = useState<Season>(() =>
    typeof window === "undefined" ? "autumn" : readSeason(),
  )
  const [effects, setEffects] = useState<boolean>(() =>
    typeof window === "undefined" ? true : readEffects(),
  )
  const [particles, setParticles] = useState<Particle[]>([])
  const [clouds, setClouds] = useState<Cloud[]>([])
  const farRef = useRef<HTMLDivElement>(null)
  const nearRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Keep `<html data-season/data-effects>` in sync with the URL. The pre-paint
  // script stamps them on load, but a client-side navigation re-renders `<html>`
  // (e.g. a locale change rewrites `lang`) and strips attributes React doesn't
  // own, so we re-resolve from the live URL and re-stamp on every navigation:
  //   • `seasonchange` — the header switcher's raw `history.replaceState`, which
  //     fires no native event;
  //   • `popstate` — browser back/forward;
  //   • `pathname` in the dep array — Next.js `router.push`/`replace` (the
  //     locale switcher, `<Link>` navigation).
  useEffect(() => {
    const sync = () => {
      const r = resolveSeason(window.location.search, new Date().getMonth())
      document.documentElement.setAttribute("data-season", r.palette)
      document.documentElement.setAttribute("data-effects", r.effects ? "on" : "off")
      setSeason(r.palette)
      setEffects(r.effects)
    }
    sync()
    window.addEventListener("seasonchange", sync)
    window.addEventListener("popstate", sync)
    return () => {
      window.removeEventListener("seasonchange", sync)
      window.removeEventListener("popstate", sync)
    }
  }, [pathname])

  // Build the fixed pool on mount, and rebuild it whenever the season, the
  // effects toggle, or the reduced-motion preference flips.
  useEffect(() => {
    const mq = window.matchMedia(REDUCED_MOTION)
    const build = () => {
      if (mq.matches || !effects) {
        setParticles([])
        setClouds([])
        return
      }
      const cfg = SEASON_CONFIG[season]
      const count = poolSize(cfg, window.innerWidth * window.innerHeight, deviceMemory())
      if (season === "summer") {
        setClouds(Array.from({ length: count }, (_, i) => makeCloud(i)))
        setParticles([])
      } else {
        setParticles(Array.from({ length: count }, (_, i) => makeParticle(season, i)))
        setClouds([])
      }
    }
    build()
    mq.addEventListener("change", build)
    return () => mq.removeEventListener("change", build)
  }, [season, effects])

  // Recompute the pool size on resize (debounced) so the density tracks the
  // viewport area — add or remove to match, without disturbing existing items.
  useEffect(() => {
    const cfg = SEASON_CONFIG[season]
    let timer: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        if (window.matchMedia(REDUCED_MOTION).matches || !effects) return
        const count = poolSize(cfg, window.innerWidth * window.innerHeight, deviceMemory())
        if (season === "summer") {
          setClouds((prev) => resizePool(prev, count, makeCloud))
        } else {
          setParticles((prev) => resizePool(prev, count, (i) => makeParticle(season, i)))
        }
      }, 200)
    }
    window.addEventListener("resize", onResize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", onResize)
    }
  }, [season, effects])

  // Parallax drift: shift each layer by `-((rate × scrollY) mod P)` where P is
  // the fall travel distance. Written directly (no rAF) so it can't be throttled.
  useEffect(() => {
    const far = farRef.current
    const near = nearRef.current
    if (!far || !near) return

    const apply = () => {
      const y = window.scrollY
      const p = (FALL_TRAVEL_VH / 100) * window.innerHeight
      far.style.transform = `translate3d(0, ${-mod(PARALLAX.far * y, p)}px, 0)`
      near.style.transform = `translate3d(0, ${-mod(PARALLAX.near * y, p)}px, 0)`
    }
    apply()
    window.addEventListener("scroll", apply, { passive: true })
    return () => window.removeEventListener("scroll", apply)
  }, [])

  const farParticles = particles.filter((p) => !p.near)
  const nearParticles = particles.filter((p) => p.near)
  const farClouds = clouds.filter((c) => !c.near)
  const nearClouds = clouds.filter((c) => c.near)

  const layerStyle = {
    "--fall-travel": `${FALL_TRAVEL_VH}vh`,
  } as React.CSSProperties

  return (
    <>
      <div ref={farRef} aria-hidden="true" className="seasonal-layer" style={layerStyle}>
        {farParticles.map((p) => (
          <ParticleView key={p.id} particle={p} />
        ))}
        {farClouds.map((c) => (
          <CloudView key={c.id} cloud={c} />
        ))}
      </div>
      <div ref={nearRef} aria-hidden="true" className="seasonal-layer" style={layerStyle}>
        {nearParticles.map((p) => (
          <ParticleView key={p.id} particle={p} />
        ))}
        {nearClouds.map((c) => (
          <CloudView key={c.id} cloud={c} />
        ))}
      </div>
    </>
  )
}
