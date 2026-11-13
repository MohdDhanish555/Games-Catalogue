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

function normalizeRuleLines(
  value: unknown,
): string[] {
  if (value == null) return []
  if (typeof value === 'string') {
    return value
      .split(/\n+/)
      .map((line) => line.replace(/^[-•*]\s*/, '').trim())
      .filter(Boolean)
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).replace(/^[-•*]\s*/, '').trim())
      .filter(Boolean)
  }
  return []
}

function toHyphenBlock(lines: string[]): string {
  return lines.map((line) => `- ${line}`).join('\n')
}

/** Parse pasted game JSON into form field patches (video stays separate). */
export function parseGameImportJson(
  raw: string,
): { ok: true; patch: Partial<AddGameFormValues> } | { ok: false; error: string } {
  const trimmed = raw.trim()
  if (!trimmed) return { ok: false, error: 'Paste a JSON object first.' }

  let data: unknown
  try {
    data = JSON.parse(trimmed)
  } catch {
    return { ok: false, error: 'Invalid JSON — check commas and quotes.' }
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { ok: false, error: 'JSON must be a single object.' }
  }

  const obj = data as Record<string, unknown>
  const patch: Partial<AddGameFormValues> = {}

  if (typeof obj.title === 'string') patch.title = obj.title.trim()
  if (typeof obj.description === 'string') {
    patch.description = obj.description.trim()
  }
  if (typeof obj.materials === 'string') patch.materials = obj.materials.trim()
  if (typeof obj.playerCount === 'string') {
    patch.playerCount = obj.playerCount.trim()
  }
  if (typeof obj.duration === 'string') patch.duration = obj.duration.trim()

  if (typeof obj.ageGroup === 'string') {
    const age = obj.ageGroup.trim()
    if (!AGE_GROUPS.includes(age as AgeGroup)) {
      return {
        ok: false,
        error: `ageGroup must be one of: ${AGE_GROUPS.join(', ')}.`,
      }
    }
    patch.ageGroup = age as AgeGroup
  }

  if (typeof obj.playFormat === 'string') {
    const format = obj.playFormat.trim()
    if (!PLAY_FORMATS.includes(format as PlayFormat)) {
      return {
        ok: false,
        error: `playFormat must be one of: ${PLAY_FORMATS.join(', ')}.`,
      }
    }
    patch.playFormat = format as PlayFormat
  }

  const en = normalizeRuleLines(obj.instructionsEn)
  const kn = normalizeRuleLines(obj.instructionsKn)
  const safety = normalizeRuleLines(obj.safety)
  const enWithSafety = [...en, ...safety]

  if (enWithSafety.length > 0) patch.instructionsEn = toHyphenBlock(enWithSafety)
  if (kn.length > 0) patch.instructionsKn = toHyphenBlock(kn)

  if (Object.keys(patch).length === 0) {
    return { ok: false, error: 'JSON had no recognized game fields.' }
  }

  return { ok: true, patch }
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
