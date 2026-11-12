import { ExternalLink, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ExternalFallbackProps {
  url: string
  provider?: 'instagram' | 'unknown'
  title?: string
  className?: string
}

export function ExternalFallback({
  url,
  provider = 'instagram',
  title,
  className,
}: ExternalFallbackProps) {
  return (
    <div
      className={cn(
        'flex h-full w-full flex-col items-center justify-center gap-3 bg-video px-6 text-center text-white',
        className,
      )}
    >
      {provider === 'instagram' ? (
        <Share2 className="h-8 w-8 text-white/80" aria-hidden />
      ) : null}
      <p className="max-w-xs text-sm text-white/80">
        {title
          ? `Watch “${title}” on Instagram — embeds are limited.`
          : 'This video opens best in Instagram.'}
      </p>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        Open on Instagram
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  )
}
