import {
  AGE_GROUPS,
  PLAY_FORMATS,
  type AgeGroup,
  type BrowseMode,
  type PlayFormat,
} from '@/types/game'
import { cn } from '@/lib/utils'

interface CatalogueBrowseFiltersProps {
  browseMode: BrowseMode
  ageGroup: AgeGroup
  playFormat: PlayFormat
  onBrowseModeChange: (mode: BrowseMode) => void
  onAgeGroupChange: (ageGroup: AgeGroup) => void
  onPlayFormatChange: (playFormat: PlayFormat) => void
}

const MAIN_TABS: Array<{ id: BrowseMode; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'age', label: 'Age based' },
  { id: 'format', label: 'Format' },
]

export function CatalogueBrowseFilters({
  browseMode,
  ageGroup,
  playFormat,
  onBrowseModeChange,
  onAgeGroupChange,
  onPlayFormatChange,
}: CatalogueBrowseFiltersProps) {
  return (
    <div className="space-y-4">
      <div
        className="flex w-full gap-2"
        role="tablist"
        aria-label="Browse catalogue"
      >
        {MAIN_TABS.map((tab) => {
          const active = browseMode === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onBrowseModeChange(tab.id)}
              className={cn(
                'flex-1 rounded-md px-2 py-2 text-center text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:flex-none sm:px-4',
                active
                  ? 'bg-ink text-paper'
                  : 'bg-transparent text-muted hover:bg-ink/5 hover:text-ink',
              )}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {browseMode === 'age' ? (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
            Age group
          </p>
          <ChipRow
            ariaLabel="Filter by age group"
            options={[...AGE_GROUPS]}
            value={ageGroup}
            onChange={onAgeGroupChange}
          />
        </div>
      ) : null}

      {browseMode === 'format' ? (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
            Play format
          </p>
          <ChipRow
            ariaLabel="Filter by play format"
            options={[...PLAY_FORMATS]}
            value={playFormat}
            onChange={onPlayFormatChange}
          />
        </div>
      ) : null}
    </div>
  )
}

function ChipRow<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: T[]
  value: T
  onChange: (value: T) => void
  ariaLabel: string
}) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label={ariaLabel}
    >
      {options.map((option) => {
        const active = value === option
        return (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option)}
            className={cn(
              'shrink-0 rounded-md px-3 py-1.5 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
              active
                ? 'bg-ink text-paper'
                : 'border border-line bg-surface text-muted hover:text-ink',
            )}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}
