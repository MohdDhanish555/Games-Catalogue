import { ArrowLeft } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { AddGameForm } from '@/features/add-game/AddGameForm'
import { useCatalogueBack } from '@/hooks/useCatalogueBack'

export function AddGamePage() {
  const goToCatalogue = useCatalogueBack()

  return (
    <AppShell header={<Header showSearch={false} />}>
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <Button
          type="button"
          variant="ghost"
          className="mb-6 -ml-2"
          onClick={goToCatalogue}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to catalogue
        </Button>

        <div className="mb-10 space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
            Contribute
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Add a family game
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted">
            Share something worth gathering for — age group, Individual or
            Group, materials, and rules in English or Kannada.
          </p>
        </div>

        <div className="rounded-lg border border-line bg-surface p-5 sm:p-8">
          <AddGameForm />
        </div>
      </div>
    </AppShell>
  )
}
