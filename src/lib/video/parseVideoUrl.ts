import type { VideoType } from '@/types/game'

export interface ParsedVideoUrl {
  type: VideoType
  url: string
  youtubeId?: string
  embedUrl?: string
  thumbnailUrl?: string
  supported: boolean
  message?: string
}

const YOUTUBE_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
]

const INSTAGRAM_PATTERN =
  /(?:instagram\.com|instagr\.am)\/(?:reel|p|tv)\/([A-Za-z0-9_-]+)/i

const DIRECT_VIDEO_EXTENSIONS = /\.(mp4|webm|ogg|mov)(\?.*)?$/i

export function extractYouTubeId(url: string): string | null {
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = url.match(pattern)
    if (match?.[1]) return match[1]
  }
  return null
}

export function parseVideoUrl(raw: string): ParsedVideoUrl {
  const trimmed = raw.trim()

  if (!trimmed) {
    return {
      type: 'direct',
      url: '',
      supported: false,
      message: 'Enter a video URL.',
    }
  }

  let parsed: URL
  try {
    parsed = new URL(trimmed)
  } catch {
    return {
      type: 'direct',
      url: trimmed,
      supported: false,
      message: 'That does not look like a valid URL.',
    }
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return {
      type: 'direct',
      url: trimmed,
      supported: false,
      message: 'Only http and https URLs are supported.',
    }
  }

  const youtubeId = extractYouTubeId(trimmed)
  if (youtubeId) {
    return {
      type: 'youtube',
      url: trimmed,
      youtubeId,
      embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
      supported: true,
    }
  }

  if (INSTAGRAM_PATTERN.test(trimmed)) {
    return {
      type: 'instagram',
      url: trimmed,
      supported: true,
      message:
        'Instagram previews are limited. Family members can open the reel in Instagram.',
    }
  }

  if (DIRECT_VIDEO_EXTENSIONS.test(parsed.pathname)) {
    return {
      type: 'direct',
      url: trimmed,
      supported: true,
    }
  }

  return {
    type: 'direct',
    url: trimmed,
    supported: false,
    message:
      'Unsupported URL. Use a YouTube link, Instagram Reel, or a direct video file URL (.mp4, .webm, .mov).',
  }
}

export function getPlaybackSrc(game: {
  videoType: VideoType | null
  videoUrl: string | null
  storagePath: string | null
}): string | null {
  if (game.videoType === 'upload') {
    return game.videoUrl ?? game.storagePath
  }
  return game.videoUrl
}

export const MAX_UPLOAD_BYTES = 80 * 1024 * 1024
export const ACCEPTED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
] as const

export function validateVideoFile(file: File): string | null {
  if (
    !ACCEPTED_VIDEO_TYPES.includes(
      file.type as (typeof ACCEPTED_VIDEO_TYPES)[number],
    ) &&
    !/\.(mp4|webm|mov)$/i.test(file.name)
  ) {
    return 'Please upload an MP4, WebM, or MOV video.'
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return 'Video must be 80MB or smaller.'
  }
  return null
}
