import type { Game, GameInput } from '@/types/game'
import type { GameRow } from './types'

export function mapGameRow(row: GameRow): Game {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    videoType: row.video_type,
    videoUrl: row.video_url,
    storagePath: row.storage_path,
    ageGroup: row.age_group,
    playFormat: row.play_format,
    playerCount: row.player_count ?? '',
    duration: row.duration ?? '',
    materials: row.materials,
    instructionsEn: row.instructions_en ?? '',
    instructionsKn: row.instructions_kn ?? '',
    visitorId: row.visitor_id,
    likeCount: row.like_count ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function toGameInsert(input: GameInput) {
  return {
    title: input.title,
    description: input.description,
    video_type: input.videoType,
    video_url: input.videoUrl,
    storage_path: input.storagePath,
    age_group: input.ageGroup,
    play_format: input.playFormat,
    player_count: input.playerCount,
    duration: input.duration,
    materials: input.materials,
    instructions_en: input.instructionsEn,
    instructions_kn: input.instructionsKn,
    visitor_id: input.visitorId,
  }
}
