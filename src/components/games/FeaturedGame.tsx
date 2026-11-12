import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight, Clock, Users } from 'lucide-react'
import type { Game } from '@/types/game'
import { GameMedia } from '@/components/video/GameMedia'
import { LikeButton } from '@/components/likes/LikeButton'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const AUTOPLAY_MS = 5500

interface FeaturedShowcaseProps {
  games: Game[]
  isLiked: (id: string) => boolean
  onLike: (game: Game) => Promise<void> | void
}

export function FeaturedGame({ games, isLiked, onLike }: FeaturedShowcaseProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  const count = games.length
  const active = games[Math.min(index, Math.max(count - 1, 0))]

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const gameIds = games.map((g) => g.id).join('|')
  useEffect(() => {
    setIndex(0)
  }, [gameIds])

  useEffect(() => {
    if (count <= 1 || paused || reduceMotion) return
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % count)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [count, paused, reduceMotion, index])

  if (!active) return null

  function goTo(next: number) {
    setIndex((next + count) % count)
  }

  return (
    <section
      className="relative overflow-hidden rounded-lg bg-video text-white"
      aria-roledescription="carousel"
      aria-label="Top liked games"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setPaused(false)
        }
      }}
    >
      <div className="absolute inset-0">
        {games.map((game, i) => {
          const hasVideo = Boolean(
            game.videoType && (game.videoUrl || game.storagePath),
          )
          const isActive = i === index
          return (
            <div
              key={game.id}
              className={cn(
                'absolute inset-0 transition-all duration-700 ease-out',
                isActive
                  ? 'z-[1] opacity-100 scale-100'
                  : 'z-0 opacity-0 scale-[1.03] pointer-events-none',
                reduceMotion && 'transition-none',
              )}
              aria-hidden={!isActive}
            >
              {hasVideo && isActive ? (
                <GameMedia game={game} mode="preview" className="opacity-70" />
              ) : hasVideo ? (
                <div className="h-full w-full bg-ink" />
              ) : (
                <div className="h-full w-full bg-ink" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/25" />
            </div>
          )
        })}
      </div>

      <div className="relative z-[2] flex min-h-[68vh] flex-col justify-end gap-6 p-6 sm:p-8 md:min-h-[72vh] md:p-12">
        <div key={active.id} className="max-w-2xl space-y-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/70">
              Featured · Top liked
            </p>
            {count > 1 ? (
              <p className="text-xs tabular-nums text-white/50">
                {index + 1} / {count}
              </p>
            ) : null}
          </div>
          <p className="text-xs uppercase tracking-[0.16em] text-white/65">
            {active.ageGroup} · {active.playFormat}
          </p>
          <h2 className="font-display text-4xl font-bold leading-[1.12] tracking-tight text-balance sm:text-5xl md:text-6xl">
            {active.title}
          </h2>
          {active.description ? (
            <p className="max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              {active.description}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/75">
            {active.playerCount ? (
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {active.playerCount} players
              </span>
            ) : null}
            {active.duration ? (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {active.duration}
              </span>
            ) : null}
            <LikeButton
              liked={isLiked(active.id)}
              count={active.likeCount}
              onToggle={() => onLike(active)}
              className="text-white/80 hover:text-like"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button asChild variant="secondary" size="lg">
            <Link to={`/games/${active.id}`}>
              View game
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>

          {count > 1 ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2" role="tablist" aria-label="Featured slides">
                {games.map((game, i) => (
                  <button
                    key={game.id}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Show ${game.title}`}
                    onClick={() => goTo(i)}
                    className={cn(
                      'relative h-1.5 overflow-hidden rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
                      i === index ? 'w-10 bg-white/25' : 'w-2.5 bg-white/35 hover:bg-white/55',
                    )}
                  >
                    {i === index && !reduceMotion && !paused ? (
                      <span
                        key={`${game.id}-${index}`}
                        className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-white"
                        style={{
                          animation: `featured-progress ${AUTOPLAY_MS}ms linear forwards`,
                        }}
                      />
                    ) : i === index ? (
                      <span className="absolute inset-0 rounded-full bg-white" />
                    ) : null}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Previous featured game"
                  onClick={() => goTo(index - 1)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next featured game"
                  onClick={() => goTo(index + 1)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
