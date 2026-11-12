import type { Game } from '@/types/game'
import { GameCard } from './GameCard'

interface GameCatalogueProps {
  games: Game[]
  isLiked: (id: string) => boolean
  onLike: (game: Game) => Promise<void> | void
}

function variantForIndex(index: number): 'standard' | 'compact' | 'wide' {
  if (index === 0) return 'wide'
  if (index % 5 === 3) return 'compact'
  return 'standard'
}

export function GameCatalogue({ games, isLiked, onLike }: GameCatalogueProps) {
  if (games.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-line px-6 py-16 text-center">
        <p className="font-display text-2xl text-ink">No games match</p>
        <p className="mt-2 text-sm text-muted">
          Try another search, age, or format — or add the first one for the family.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-10">
      {games.map((game, index) => (
        <GameCard
          key={game.id}
          game={game}
          liked={isLiked(game.id)}
          onLike={() => onLike(game)}
          variant={variantForIndex(index)}
        />
      ))}
    </div>
  )
}
