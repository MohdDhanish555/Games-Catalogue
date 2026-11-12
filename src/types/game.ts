export const AGE_GROUPS = [
  'All ages',
  'Kids',
  'Under 15',
  'Adults',
  'Seniors',
] as const

export type AgeGroup = (typeof AGE_GROUPS)[number]

export const PLAY_FORMATS = ['Individual', 'Group'] as const

export type PlayFormat = (typeof PLAY_FORMATS)[number]

export const VIDEO_TYPES = [
  'youtube',
  'instagram',
  'direct',
  'upload',
] as const

export type VideoType = (typeof VIDEO_TYPES)[number]

export type SortOption = 'recent' | 'liked'

export const BROWSE_MODES = ['all', 'age', 'format'] as const

export type BrowseMode = (typeof BROWSE_MODES)[number]

export interface Game {
  id: string
  title: string
  description: string
  videoType: VideoType | null
  videoUrl: string | null
  storagePath: string | null
  ageGroup: AgeGroup
  playFormat: PlayFormat
  playerCount: string
  duration: string
  materials: string
  instructionsEn: string
  instructionsKn: string
  visitorId: string | null
  likeCount: number
  createdAt: string
  updatedAt: string
}

export interface GameInput {
  title: string
  description: string
  videoType: VideoType | null
  videoUrl: string | null
  storagePath: string | null
  ageGroup: AgeGroup
  playFormat: PlayFormat
  playerCount: string
  duration: string
  materials: string
  instructionsEn: string
  instructionsKn: string
  visitorId: string
}

export interface GameFilters {
  search: string
  browseMode: BrowseMode
  ageGroup: AgeGroup
  playFormat: PlayFormat
  sort: SortOption
}
