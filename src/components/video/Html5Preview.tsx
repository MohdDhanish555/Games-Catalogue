import { useInViewVideo } from '@/hooks/useInViewVideo'
import { cn } from '@/lib/utils'

interface Html5PreviewProps {
  src: string
  poster?: string
  className?: string
  controls?: boolean
  autoPreview?: boolean
}

export function Html5Preview({
  src,
  poster,
  className,
  controls = false,
  autoPreview = true,
}: Html5PreviewProps) {
  const { ref } = useInViewVideo(autoPreview && !controls)

  return (
    <video
      ref={ref}
      className={cn('h-full w-full object-cover', className)}
      src={src}
      poster={poster}
      muted={autoPreview && !controls}
      loop={autoPreview && !controls}
      playsInline
      preload="none"
      controls={controls}
    />
  )
}
