import type { AgeGroup, PlayFormat, VideoType } from '@/types/game'

export interface GameRow {
  id: string
  title: string
  description: string
  video_type: VideoType | null
  video_url: string | null
  storage_path: string | null
  age_group: AgeGroup
  play_format: PlayFormat
  player_count: string
  duration: string
  materials: string
  instructions_en: string
  instructions_kn: string
  visitor_id: string | null
  created_at: string
  updated_at: string
  like_count?: number
}

export interface GameLikeRow {
  id: string
  game_id: string
  visitor_id: string
  created_at: string
}
