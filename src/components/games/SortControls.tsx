import type { SortOption } from '@/types/game'
import { cn } from '@/lib/utils'

interface SortControlsProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

export function SortControls({ value, onChange }: SortControlsProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-md border border-line bg-surface p-1">
      {(
        [
          { id: 'recent', label: 'Recently added' },
          { id: 'liked', label: 'Most liked' },
        ] as const
      ).map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={cn(
            'rounded-sm px-3 py-1.5 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
            value === option.id
              ? 'bg-ink text-paper'
              : 'text-muted hover:text-ink',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
