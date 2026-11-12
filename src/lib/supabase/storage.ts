import { getSupabase } from './client'

const BUCKET = 'game-videos'

export async function uploadGameVideo(
  file: File,
  visitorId: string,
  onProgress?: (percent: number) => void,
): Promise<{ path: string; publicUrl: string }> {
  const supabase = getSupabase()
  const ext = file.name.split('.').pop()?.toLowerCase() || 'mp4'
  const path = `${visitorId}/${crypto.randomUUID()}.${ext}`

  // supabase-js does not expose granular XHR progress for storage.upload;
  // simulate staged progress for UX while the request is in flight.
  onProgress?.(10)

  const progressTimer = window.setInterval(() => {
    onProgress?.(Math.min(85, Math.random() * 20 + 40))
  }, 400)

  try {
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'video/mp4',
    })
    if (error) throw error
  } finally {
    window.clearInterval(progressTimer)
  }

  onProgress?.(95)

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  onProgress?.(100)

  return { path, publicUrl: data.publicUrl }
}
