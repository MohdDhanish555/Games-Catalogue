import { Link, NavLink } from 'react-router-dom'
import { Heart, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface HeaderProps {
  search?: string
  onSearchChange?: (value: string) => void
  showSearch?: boolean
}

export function Header({
  search = '',
  onSearchChange,
  showSearch = true,
}: HeaderProps) {
  return (
    <header className="border-b border-line/80 bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <Link to="/" className="group min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
            Shared collection
          </p>
          <h1 className="font-display text-3xl font-bold leading-[1.12] tracking-tight text-ink transition-colors group-hover:text-accent sm:text-4xl md:text-5xl">
            Family Games
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs tracking-[0.08em] text-muted sm:text-[0.8125rem]">
            <span>Ibrahim</span>
            <Heart
              className="h-3 w-3 fill-like text-like"
              aria-hidden
            />
            <span>Alimamma</span>
            <span className="font-medium uppercase tracking-[0.16em] text-ink/55">
              Family Collection
            </span>
          </p>
        </Link>

        {showSearch && onSearchChange ? (
          <div className="flex max-w-md items-center gap-2">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <Input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search games by title"
                className={cn('pl-9 bg-surface/80')}
                aria-label="Search games"
              />
            </div>
            <Button
              asChild
              variant="outline"
              size="default"
              className="h-10 shrink-0 px-3 text-muted hover:text-ink sm:px-4"
            >
              <NavLink to="/add" aria-label="Add game" title="Add game">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add game</span>
              </NavLink>
            </Button>
          </div>
        ) : null}
      </div>
    </header>
  )
}
