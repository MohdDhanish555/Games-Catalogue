import { Play } from 'lucide-react'
import { extractYouTubeId } from '@/lib/video/parseVideoUrl'
import { cn } from '@/lib/utils'

interface YouTubeThumbnailProps {
  url: string
  title: string
  className?: string
}

export function YouTubeThumbnail({
  url,
  title,
  className,
}: YouTubeThumbnailProps) {
  const id = extractYouTubeId(url)
  const src = id
    ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
    : undefined

  return (
    <div className={cn('relative h-full w-full bg-video', className)}>
      {src ? (
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm text-white/70">
          YouTube
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink/20">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm transition-transform duration-200 group-hover:scale-105">
          <Play className="h-5 w-5 fill-ink" aria-hidden />
          <span className="sr-only">Play {title}</span>
        </span>
      </div>
    </div>
  )
}
