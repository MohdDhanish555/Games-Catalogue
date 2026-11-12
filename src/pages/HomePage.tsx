import { ArrowDownWideNarrow } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Header } from '@/components/layout/Header'
import { CatalogueSkeleton } from '@/components/games/CatalogueSkeleton'
import { CatalogueBrowseFilters } from '@/components/games/CatalogueBrowseFilters'
import { FeaturedGame } from '@/components/games/FeaturedGame'
import { GameCatalogue } from '@/components/games/GameCatalogue'
import { useGames } from '@/hooks/useGames'
import { useLikesContext } from '@/context/LikesContext'
import { cn } from '@/lib/utils'
import type { Game } from '@/types/game'

export function HomePage() {
  const {
    filtered,
    featured,
    loading,
    error,
    filters,
    setSearch,
    setBrowseMode,
    setAgeGroup,
    setPlayFormat,
    setSort,
    updateGameLocal,
  } = useGames()
  const { isLiked, toggle } = useLikesContext()

  async function handleLike(game: Game) {
    const result = await toggle(game.id, game.likeCount)
    if (result) {
      updateGameLocal(game.id, { likeCount: result.likeCount })
    }
  }

  const filtersClear =
    filters.browseMode === 'all' && !filters.search.trim()

  const catalogueHeading =
    filters.browseMode === 'age'
      ? filters.ageGroup
      : filters.browseMode === 'format'
        ? filters.playFormat
        : 'All games'

  const featuredLive = featured.map(
    (game) => filtered.find((g) => g.id === game.id) ?? game,
  )

  return (
    <AppShell
      header={
        <Header
          search={filters.search}
          onSearchChange={setSearch}
          showSearch
        />
      }
    >
      <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-8 pb-12 sm:px-6 sm:pb-14 lg:px-8 lg:py-12 lg:pb-16">
        {loading ? <CatalogueSkeleton /> : null}

        {!loading && error ? (
          <div className="rounded-lg border border-line bg-surface px-6 py-10 text-center">
            <p className="font-display text-2xl text-ink">Couldn’t load games</p>
            <p className="mt-2 text-sm text-muted">{error}</p>
          </div>
        ) : null}

        {!loading && !error ? (
          <>
            {featuredLive.length > 0 && filtersClear ? (
              <FeaturedGame
                games={featuredLive}
                isLiked={isLiked}
                onLike={handleLike}
              />
            ) : (
              <section className="space-y-3 pt-2">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
                  Catalogue
                </p>
                <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  Find something to play tonight
                </h2>
              </section>
            )}

            <section className="space-y-6">
              <CatalogueBrowseFilters
                browseMode={filters.browseMode}
                ageGroup={filters.ageGroup}
                playFormat={filters.playFormat}
                onBrowseModeChange={setBrowseMode}
                onAgeGroupChange={setAgeGroup}
                onPlayFormatChange={setPlayFormat}
              />

              <div className="flex items-end justify-between gap-4 border-b border-line pb-3">
                <h2 className="font-display text-2xl font-semibold leading-snug tracking-tight">
                  {catalogueHeading}
                </h2>
                <div className="flex items-center gap-3">
                  <p className="text-sm text-muted">
                    {filtered.length}{' '}
                    {filtered.length === 1 ? 'game' : 'games'}
                  </p>
                  <button
                    type="button"
                    aria-pressed={filters.sort === 'liked'}
                    aria-label={
                      filters.sort === 'liked'
                        ? 'Sorted by most liked. Click to sort by recently added'
                        : 'Sort by most liked'
                    }
                    title={
                      filters.sort === 'liked'
                        ? 'Most liked'
                        : 'Sort by most liked'
                    }
                    onClick={() =>
                      setSort(filters.sort === 'liked' ? 'recent' : 'liked')
                    }
                    className={cn(
                      'inline-flex size-9 items-center justify-center rounded-md border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                      filters.sort === 'liked'
                        ? 'border-ink bg-ink text-paper'
                        : 'border-line bg-surface text-muted hover:text-ink',
                    )}
                  >
                    <ArrowDownWideNarrow className="size-4" aria-hidden />
                  </button>
                </div>
              </div>

              <GameCatalogue
                games={filtered}
                isLiked={isLiked}
                onLike={handleLike}
              />
            </section>
          </>
        ) : null}
      </div>
    </AppShell>
  )
}
