import type { Game } from '@/types/game'
import { extractYouTubeId, getPlaybackSrc } from '@/lib/video/parseVideoUrl'
import { ExternalFallback } from './ExternalFallback'
import { Html5Preview } from './Html5Preview'
import { YouTubeEmbed } from './YouTubeEmbed'
import { YouTubeThumbnail } from './YouTubeThumbnail'
import { cn } from '@/lib/utils'

interface GameMediaProps {
  game: Game
  mode?: 'preview' | 'detail'
  className?: string
}

export function GameMedia({
  game,
  mode = 'preview',
  className,
}: GameMediaProps) {
  const src = getPlaybackSrc(game)
  const isDetail = mode === 'detail'

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-video',
        isDetail ? 'aspect-video w-full rounded-lg' : 'h-full w-full',
        className,
      )}
    >
      {game.videoType === 'youtube' && game.videoUrl ? (
        isDetail && extractYouTubeId(game.videoUrl) ? (
          <YouTubeEmbed
            videoId={extractYouTubeId(game.videoUrl)!}
            title={game.title}
          />
        ) : (
          <YouTubeThumbnail url={game.videoUrl} title={game.title} />
        )
      ) : null}

      {game.videoType === 'instagram' && game.videoUrl ? (
        <ExternalFallback url={game.videoUrl} title={game.title} />
      ) : null}

      {(game.videoType === 'direct' || game.videoType === 'upload') && src ? (
        <Html5Preview
          src={src}
          controls={isDetail}
          autoPreview={!isDetail}
        />
      ) : null}

      {!game.videoType ||
      (!src && game.videoType !== 'instagram' && game.videoType !== 'youtube') ? (
        <div className="flex h-full min-h-40 items-center justify-center text-sm text-white/60">
          No video available
        </div>
      ) : null}
    </div>
  )
}
