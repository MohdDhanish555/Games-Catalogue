import { Link } from 'react-router-dom'
import { Clock, Users } from 'lucide-react'
import type { Game } from '@/types/game'
import { GameMedia } from '@/components/video/GameMedia'
import { LikeButton } from '@/components/likes/LikeButton'
import { cn } from '@/lib/utils'

interface GameCardProps {
  game: Game
  liked: boolean
  onLike: () => Promise<void> | void
  variant?: 'standard' | 'compact' | 'wide'
}

export function GameCard({
  game,
  liked,
  onLike,
  variant = 'standard',
}: GameCardProps) {
  const hasVideo = Boolean(game.videoType && (game.videoUrl || game.storagePath))

  return (
    <article
      className={cn(
        'group flex flex-col overflow-hidden',
        variant === 'wide' && 'md:col-span-2',
      )}
    >
      <Link
        to={`/games/${game.id}`}
        className={cn(
          'relative block overflow-hidden rounded-lg bg-video focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
          variant === 'compact' ? 'aspect-[4/3]' : 'aspect-video',
          variant === 'wide' && 'md:aspect-[21/9]',
        )}
      >
        <div className="h-full w-full transition-transform duration-300 group-hover:scale-[1.02]">
          {hasVideo ? (
            <GameMedia game={game} mode="preview" />
          ) : (
            <div className="flex h-full w-full flex-col justify-end bg-ink p-4 text-white">
              <p className="text-xs uppercase tracking-[0.14em] text-white/60">
                {game.ageGroup} · {game.playFormat}
              </p>
              <p className="mt-2 font-display text-xl font-semibold leading-snug">
                {game.title}
              </p>
            </div>
          )}
        </div>
      </Link>

      <div
        className={cn(
          'flex flex-1 flex-col gap-2 pt-3',
          variant === 'wide' && 'md:flex-row md:items-end md:justify-between',
        )}
      >
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs uppercase tracking-[0.14em] text-muted">
            <span>{game.ageGroup}</span>
            <span aria-hidden>·</span>
            <span>{game.playFormat}</span>
          </div>
          <h3 className="font-display text-xl font-semibold leading-snug tracking-tight text-ink md:text-2xl">
            <Link
              to={`/games/${game.id}`}
              className="transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {game.title}
            </Link>
          </h3>
          {variant !== 'compact' && game.description ? (
            <p className="line-clamp-2 text-sm leading-relaxed text-muted">
              {game.description}
            </p>
          ) : null}
        </div>

        <div
          className={cn(
            'flex flex-wrap items-center gap-4 text-xs text-muted',
            variant === 'wide' && 'md:shrink-0',
          )}
        >
          {game.playerCount ? (
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {game.playerCount}
            </span>
          ) : null}
          {game.duration ? (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {game.duration}
            </span>
          ) : null}
          <LikeButton liked={liked} count={game.likeCount} onToggle={onLike} size="sm" />
        </div>
      </div>
    </article>
  )
}
