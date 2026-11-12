import type { AgeGroup, PlayFormat, VideoType } from '@/types/game'
import { AGE_GROUPS, PLAY_FORMATS } from '@/types/game'
import { parseVideoUrl, validateVideoFile } from '@/lib/video/parseVideoUrl'

export type VideoMode = 'none' | 'url' | 'upload'

export interface AddGameFormValues {
  title: string
  description: string
  ageGroup: AgeGroup | ''
  playFormat: PlayFormat | ''
  playerCount: string
  duration: string
  materials: string
  instructionsEn: string
  instructionsKn: string
  videoMode: VideoMode
  videoUrl: string
  file: File | null
}

export type AddGameFormErrors = Partial<
  Record<keyof AddGameFormValues | 'video', string>
>

export const initialAddGameValues: AddGameFormValues = {
  title: '',
  description: '',
  ageGroup: '',
  playFormat: '',
  playerCount: '',
  duration: '',
  materials: '',
  instructionsEn: '',
  instructionsKn: '',
  videoMode: 'none',
  videoUrl: '',
  file: null,
}

export function validateAddGameForm(
  values: AddGameFormValues,
  options?: { allowExistingUpload?: boolean },
): AddGameFormErrors {
  const errors: AddGameFormErrors = {}

  if (!values.title.trim()) errors.title = 'Title is required.'
  if (!values.ageGroup || !AGE_GROUPS.includes(values.ageGroup)) {
    errors.ageGroup = 'Choose an age group.'
  }
  if (!values.playFormat || !PLAY_FORMATS.includes(values.playFormat)) {
    errors.playFormat = 'Choose Individual or Group.'
  }
  if (!values.materials.trim()) errors.materials = 'Materials are required.'

  if (values.videoMode === 'url' && values.videoUrl.trim()) {
    const parsed = parseVideoUrl(values.videoUrl)
    if (!parsed.supported) {
      errors.videoUrl = parsed.message ?? 'Unsupported video URL.'
    }
  }

  if (values.videoMode === 'upload' && values.file) {
    const fileError = validateVideoFile(values.file)
    if (fileError) errors.file = fileError
  }

  if (
    values.videoMode === 'upload' &&
    !values.file &&
    !options?.allowExistingUpload
  ) {
    errors.file = 'Choose a video file, or switch video to None.'
  }

  return errors
}

export function gameToFormValues(game: {
  title: string
  description: string
  ageGroup: AgeGroup | ''
  playFormat: PlayFormat | ''
  playerCount: string
  duration: string
  materials: string
  instructionsEn: string
  instructionsKn: string
  videoType: VideoType | null
  videoUrl: string | null
}): AddGameFormValues {
  let videoMode: VideoMode = 'none'
  if (game.videoType === 'upload') videoMode = 'upload'
  else if (game.videoType && game.videoUrl) videoMode = 'url'

  return {
    title: game.title,
    description: game.description,
    ageGroup: game.ageGroup,
    playFormat: game.playFormat,
    playerCount: game.playerCount,
    duration: game.duration,
    materials: game.materials,
    instructionsEn: game.instructionsEn,
    instructionsKn: game.instructionsKn,
    videoMode,
    videoUrl:
      videoMode === 'url' && game.videoUrl ? game.videoUrl : '',
    file: null,
  }
}

export function resolveVideoFields(values: AddGameFormValues): {
  videoType: VideoType | null
  videoUrl: string | null
  storagePath: string | null
} {
  if (values.videoMode === 'none') {
    return { videoType: null, videoUrl: null, storagePath: null }
  }

  if (values.videoMode === 'url') {
    if (!values.videoUrl.trim()) {
      return { videoType: null, videoUrl: null, storagePath: null }
    }
    const parsed = parseVideoUrl(values.videoUrl)
    if (!parsed.supported) {
      return { videoType: null, videoUrl: null, storagePath: null }
    }
    return {
      videoType: parsed.type,
      videoUrl: parsed.url,
      storagePath: null,
    }
  }

  return { videoType: null, videoUrl: null, storagePath: null }
}
