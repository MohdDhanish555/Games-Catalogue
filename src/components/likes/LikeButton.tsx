import { useState, type MouseEvent } from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LikeButtonProps {
  liked: boolean
  count: number
  onToggle: () => Promise<void> | void
  className?: string
  size?: 'sm' | 'md'
}

export function LikeButton({
  liked,
  count,
  onToggle,
  className,
  size = 'md',
}: LikeButtonProps) {
  const [animating, setAnimating] = useState(false)
  const [pending, setPending] = useState(false)

  async function handleClick(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (pending) return
    setPending(true)
    setAnimating(true)
    try {
      await onToggle()
    } finally {
      setPending(false)
      window.setTimeout(() => setAnimating(false), 280)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-pressed={liked}
      aria-label={liked ? 'Unlike game' : 'Like game'}
      className={cn(
        'group inline-flex items-center gap-1.5 rounded-md text-muted transition-colors duration-200 hover:text-like focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:opacity-60',
        liked && 'text-like',
        size === 'sm' ? 'text-xs' : 'text-sm',
        className,
      )}
    >
      <Heart
        className={cn(
          'transition-transform duration-200',
          size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4',
          liked && 'fill-like text-like',
          animating && 'scale-125',
        )}
      />
      <span className="tabular-nums">{count}</span>
    </button>
  )
}
