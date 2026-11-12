import { useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Clock, Package, Pencil, Users } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Header } from '@/components/layout/Header'
import { GameMedia } from '@/components/video/GameMedia'
import { LikeButton } from '@/components/likes/LikeButton'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useGame } from '@/hooks/useGame'
import { useLikesContext } from '@/context/LikesContext'
import { useVisitorId } from '@/hooks/useVisitorId'
import { cn } from '@/lib/utils'

type RulesLang = 'en' | 'kn'

export function GameDetailPage() {
  const { id } = useParams()
  const { game, loading, error, updateLocal } = useGame(id)
  const { isLiked, toggle } = useLikesContext()
  const visitorId = useVisitorId()
  const [rulesLang, setRulesLang] = useState<RulesLang>('en')

  async function handleLike() {
    if (!game) return
    const result = await toggle(game.id, game.likeCount)
    if (result) updateLocal({ likeCount: result.likeCount })
  }

  const canEdit = Boolean(
    game && visitorId && game.visitorId && game.visitorId === visitorId,
  )

  const hasVideo = Boolean(
    game?.videoType && (game.videoUrl || game.storagePath),
  )
  const hasEn = Boolean(game?.instructionsEn.trim())
  const hasKn = Boolean(game?.instructionsKn.trim())
  const showKnRules =
    (rulesLang === 'kn' && hasKn) || (rulesLang === 'en' && !hasEn && hasKn)
  const activeRules = showKnRules
    ? game?.instructionsKn
    : game?.instructionsEn

  return (
    <AppShell header={<Header showSearch={false} />}>
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <Button asChild variant="ghost" className="mb-6 -ml-2">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Back to catalogue
          </Link>
        </Button>

        {loading ? (
          <div className="space-y-6">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : null}

        {!loading && (error || !game) ? (
          <div className="rounded-lg border border-line bg-surface px-6 py-16 text-center">
            <p className="font-display text-2xl text-ink">Game not found</p>
            <p className="mt-2 text-sm text-muted">
              {error ?? 'It may have been removed from the catalogue.'}
            </p>
            <Button asChild className="mt-6">
              <Link to="/">Return home</Link>
            </Button>
          </div>
        ) : null}

        {!loading && game ? (
          <article className="space-y-10">
            {hasVideo ? <GameMedia game={game} mode="detail" /> : null}

            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.8fr)]">
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
                    {game.ageGroup} · {game.playFormat}
                  </p>
                  <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                    {game.title}
                  </h1>
                  {game.description ? (
                    <p className="max-w-2xl text-lg leading-relaxed text-muted">
                      {game.description}
                    </p>
                  ) : null}
                  <div className="flex flex-wrap items-center gap-3">
                    <LikeButton
                      liked={isLiked(game.id)}
                      count={game.likeCount}
                      onToggle={handleLike}
                    />
                    {canEdit ? (
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/games/${game.id}/edit`}>
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Link>
                      </Button>
                    ) : null}
                  </div>
                </div>

                <section className="space-y-4 border-t border-line pt-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <h2 className="font-display text-2xl font-semibold">
                      How to play
                    </h2>
                    {hasEn || hasKn ? (
                      <div
                        className="flex w-full rounded-md border border-line bg-surface p-1 sm:w-auto sm:inline-flex"
                        role="tablist"
                        aria-label="Rules language"
                      >
                        <LangTab
                          active={rulesLang === 'en'}
                          disabled={!hasEn}
                          onClick={() => setRulesLang('en')}
                          label="English"
                        />
                        <LangTab
                          active={rulesLang === 'kn'}
                          disabled={!hasKn}
                          onClick={() => setRulesLang('kn')}
                          label="ಕನ್ನಡ"
                          kannada
                        />
                      </div>
                    ) : null}
                  </div>

                  {hasEn || hasKn ? (
                    <p
                      lang={showKnRules ? 'kn' : 'en'}
                      className={cn(
                        'whitespace-pre-wrap text-base leading-relaxed text-ink/90',
                        showKnRules &&
                          'font-kannada text-[1.05rem] leading-[1.75]',
                      )}
                    >
                      {activeRules}
                    </p>
                  ) : (
                    <p className="text-sm text-muted">
                      Rules have not been added for this game yet.
                    </p>
                  )}
                </section>
              </div>

              <aside className="space-y-6 lg:pt-2">
                <div className="space-y-4 rounded-lg border border-line bg-surface p-5">
                  <MetaRow label="Age group" value={game.ageGroup} />
                  <MetaRow label="Format" value={game.playFormat} />
                  {game.playerCount ? (
                    <MetaRow
                      icon={<Users className="h-4 w-4" />}
                      label="Players"
                      value={game.playerCount}
                    />
                  ) : null}
                  {game.duration ? (
                    <MetaRow
                      icon={<Clock className="h-4 w-4" />}
                      label="Duration"
                      value={game.duration}
                    />
                  ) : null}
                  <MetaRow
                    icon={<Package className="h-4 w-4" />}
                    label="Materials"
                    value={game.materials || 'None listed'}
                  />
                </div>
              </aside>
            </div>
          </article>
        ) : null}
      </div>
    </AppShell>
  )
}

function LangTab({
  active,
  disabled,
  onClick,
  label,
  kannada = false,
}: {
  active: boolean
  disabled: boolean
  onClick: () => void
  label: string
  kannada?: boolean
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      lang={kannada ? 'kn' : undefined}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex-1 rounded-sm px-3 py-2.5 text-center text-sm font-medium leading-none transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:px-4 sm:py-1.5',
        kannada && 'font-kannada',
        active
          ? 'bg-ink text-paper'
          : 'bg-transparent text-ink/70 hover:bg-ink/5 hover:text-ink',
      )}
    >
      {label}
    </button>
  )
}

function MetaRow({
  icon,
  label,
  value,
}: {
  icon?: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex gap-3">
      {icon ? <div className="mt-0.5 text-muted">{icon}</div> : null}
      <div>
        <p className="text-xs uppercase tracking-[0.14em] text-muted">{label}</p>
        <p className="mt-1 text-sm leading-relaxed text-ink">{value}</p>
      </div>
    </div>
  )
}
