import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ArrowUpRight, Clock, Users } from 'lucide-react'
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

  const autoplay = useRef(
    Autoplay({
      delay: AUTOPLAY_MS,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
      stopOnFocusIn: false,
    }),
  )

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: count > 1,
      align: 'start',
      skipSnaps: false,
      duration: reduceMotion ? 0 : 28,
      watchDrag: count > 1,
    },
    count > 1 && !reduceMotion ? [autoplay.current] : [],
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  const gameIds = games.map((g) => g.id).join('|')
  useEffect(() => {
    emblaApi?.reInit()
    emblaApi?.scrollTo(0, true)
    setIndex(0)
  }, [emblaApi, gameIds])

  useEffect(() => {
    const plugin = autoplay.current
    if (!emblaApi || count <= 1 || reduceMotion) return
    if (paused) plugin.stop()
    else plugin.play()
  }, [emblaApi, paused, count, reduceMotion, index])

  function goTo(next: number) {
    emblaApi?.scrollTo(next)
  }

  if (!active) return null

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
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {games.map((game, i) => {
            const hasVideo = Boolean(
              game.videoType && (game.videoUrl || game.storagePath),
            )
            const isNear = Math.abs(i - index) <= 1 || (count > 2 && (i === 0 || i === count - 1))
            return (
              <article
                key={game.id}
                className="relative min-w-0 shrink-0 grow-0 basis-full"
                aria-hidden={i !== index}
              >
                <div className="absolute inset-0">
                  {hasVideo && isNear ? (
                    <GameMedia
                      game={game}
                      mode="preview"
                      className="opacity-70"
                    />
                  ) : (
                    <div className="h-full w-full bg-ink" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/25" />
                </div>

                <div className="relative z-[2] flex min-h-[68vh] flex-col justify-end gap-6 p-6 sm:p-8 md:min-h-[72vh] md:p-12">
                  <div className="max-w-2xl space-y-4">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/70">
                        Featured · Top liked
                      </p>
                      {count > 1 ? (
                        <p className="text-xs tabular-nums text-white/50">
                          {i + 1} / {count}
                        </p>
                      ) : null}
                    </div>
                    <p className="text-xs uppercase tracking-[0.16em] text-white/65">
                      {game.ageGroup} · {game.playFormat}
                    </p>
                    <h2 className="font-display text-4xl font-bold leading-[1.12] tracking-tight text-balance sm:text-5xl md:text-6xl">
                      {game.title}
                    </h2>
                    {game.description ? (
                      <p className="max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                        {game.description}
                      </p>
                    ) : null}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/75">
                      {game.playerCount ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Users className="h-4 w-4" />
                          {game.playerCount} players
                        </span>
                      ) : null}
                      {game.duration ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {game.duration}
                        </span>
                      ) : null}
                      <LikeButton
                        liked={isLiked(game.id)}
                        count={game.likeCount}
                        onToggle={() => onLike(game)}
                        className="text-white/80 hover:text-like"
                      />
                    </div>
                  </div>

                  <div>
                    <Button asChild variant="secondary" size="lg">
                      <Link to={`/games/${game.id}`}>
                        View game
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      {count > 1 ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] flex justify-end p-6 sm:p-8 md:p-12">
          <div
            className="pointer-events-auto flex items-center gap-2"
            role="tablist"
            aria-label="Featured slides"
          >
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
                  i === index
                    ? 'w-10 bg-white/25'
                    : 'w-2.5 bg-white/35 hover:bg-white/55',
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
        </div>
      ) : null}
    </section>
  )
}
