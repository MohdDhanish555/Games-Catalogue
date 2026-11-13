import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AddGameForm } from '@/features/add-game/AddGameForm'
import { useCatalogueBack } from '@/hooks/useCatalogueBack'
import { useGame } from '@/hooks/useGame'
import { useVisitorId } from '@/hooks/useVisitorId'

export function EditGamePage() {
  const { id } = useParams()
  const { game, loading, error } = useGame(id)
  const visitorId = useVisitorId()
  const goToCatalogue = useCatalogueBack()

  const canEdit =
    Boolean(game && visitorId && game.visitorId && game.visitorId === visitorId)

  return (
    <AppShell header={<Header showSearch={false} />}>
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <Button asChild variant="ghost" className="mb-6 -ml-2">
          <Link to={id ? `/games/${id}` : '/'}>
            <ArrowLeft className="h-4 w-4" />
            Back to game
          </Link>
        </Button>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : null}

        {!loading && (error || !game) ? (
          <div className="rounded-lg border border-line bg-surface px-6 py-16 text-center">
            <p className="font-display text-2xl text-ink">Game not found</p>
            <Button type="button" className="mt-6" onClick={goToCatalogue}>
              Return home
            </Button>
          </div>
        ) : null}

        {!loading && game && !canEdit ? (
          <Navigate to={`/games/${game.id}`} replace />
        ) : null}

        {!loading && game && canEdit ? (
          <>
            <div className="mb-10 space-y-3">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
                Edit
              </p>
              <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                Edit {game.title}
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-muted">
                Update details, rules, or video — only you can edit games you
                added on this device.
              </p>
            </div>

            <div className="rounded-lg border border-line bg-surface p-5 sm:p-8">
              <AddGameForm mode="edit" initialGame={game} />
            </div>
          </>
        ) : null}
      </div>
    </AppShell>
  )
}
