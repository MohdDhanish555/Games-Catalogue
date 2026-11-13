import { cn } from '@/lib/utils'

interface YouTubeEmbedProps {
  videoId: string
  title: string
  className?: string
  autoplay?: boolean
  muted?: boolean
}

export function YouTubeEmbed({
  videoId,
  title,
  className,
  autoplay = false,
  muted = false,
}: YouTubeEmbedProps) {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
  })
  if (autoplay) params.set('autoplay', '1')
  if (muted || autoplay) params.set('mute', '1')

  return (
    <iframe
      title={title}
      src={`https://www.youtube.com/embed/${videoId}?${params.toString()}`}
      className={cn('h-full w-full', className)}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      loading="lazy"
    />
  )
}
