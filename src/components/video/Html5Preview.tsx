import { useInViewVideo } from '@/hooks/useInViewVideo'
import { cn } from '@/lib/utils'

interface Html5PreviewProps {
  src: string
  poster?: string
  className?: string
  controls?: boolean
  /** Catalogue-style muted looping preview when in view. */
  autoPreview?: boolean
  /** Detail-style muted autoplay once (works with controls). */
  autoPlayMuted?: boolean
}

export function Html5Preview({
  src,
  poster,
  className,
  controls = false,
  autoPreview = false,
  autoPlayMuted = false,
}: Html5PreviewProps) {
  const shouldAutoplay = autoPreview || autoPlayMuted
  const { ref } = useInViewVideo(shouldAutoplay)

  return (
    <video
      ref={ref}
      className={cn('h-full w-full object-cover', className)}
      src={src}
      poster={poster}
      muted={shouldAutoplay}
      loop={autoPreview}
      playsInline
      preload={shouldAutoplay ? 'auto' : 'none'}
      controls={controls}
    />
  )
}
