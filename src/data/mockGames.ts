import type { Game } from '@/types/game'

const now = Date.now()
const day = 24 * 60 * 60 * 1000

export const MOCK_GAMES: Game[] = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    title: 'Charades Relay',
    description:
      'Classic charades with a twist — teams race the clock while everyone else guesses in whispered huddles.',
    videoType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    storagePath: null,
    ageGroup: 'All ages',
    playFormat: 'Group',
    playerCount: '4–12',
    duration: '20–40 min',
    materials: 'Timer, slips of paper, a bowl',
    instructionsEn:
      'Split into two teams. One player acts a prompt without speaking. Team mates guess before the timer ends. First team to ten points wins. Keep prompts family-friendly and age-appropriate.',
    instructionsKn:
      'ಎರಡು ತಂಡಗಳನ್ನಾಗಿ ವಿಭಜಿಸಿ. ಒಬ್ಬ ಆಟಗಾರ ಮಾತನಾಡದೆ ಸೂಚನೆಯನ್ನು ಅಭಿನಯಿಸುತ್ತಾನೆ. ತಂಡದವರು ಸಮಯ ಮುಗಿಯುವ ಮೊದಲು ಉತ್ತರ ಹೇಳಬೇಕು. ಹತ್ತು ಅಂಕಗಳನ್ನು ಮೊದಲು ಪಡೆದ ತಂಡ ಗೆಲ್ಲುತ್ತದೆ.',
    visitorId: 'seed',
    likeCount: 18,
    createdAt: new Date(now - 1 * day).toISOString(),
    updatedAt: new Date(now - 1 * day).toISOString(),
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    title: 'Living Room Olympics',
    description:
      'A circuit of silly indoor events: sock skating, pillow shot-put, and couch long jump.',
    videoType: 'direct',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    storagePath: null,
    ageGroup: 'Under 15',
    playFormat: 'Group',
    playerCount: '3–8',
    duration: '30–45 min',
    materials: 'Socks, pillows, painter’s tape for lanes',
    instructionsEn:
      'Mark three stations. Rotate in pairs. Award points for style and completion, not just speed. Crown an overall champion at the end.',
    instructionsKn: '',
    visitorId: 'seed',
    likeCount: 24,
    createdAt: new Date(now - 2 * day).toISOString(),
    updatedAt: new Date(now - 2 * day).toISOString(),
  },
  {
    id: '33333333-3333-4333-8333-333333333333',
    title: 'Story Stack',
    description:
      'Build a collaborative story one sentence at a time — then act out the ending.',
    videoType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=YE7VzlLtp-4',
    storagePath: null,
    ageGroup: 'All ages',
    playFormat: 'Group',
    playerCount: '3–10',
    duration: '15–25 min',
    materials: 'None',
    instructionsEn:
      'Sit in a circle. Each person adds one sentence. After two full rounds, the group improvises a one-minute finale based on the story.',
    instructionsKn: '',
    visitorId: 'seed',
    likeCount: 11,
    createdAt: new Date(now - 3 * day).toISOString(),
    updatedAt: new Date(now - 3 * day).toISOString(),
  },
  {
    id: '44444444-4444-4444-8444-444444444444',
    title: 'Backyard Treasure Hunt',
    description:
      'Clue-based outdoor hunt that works for mixed ages — toddlers get picture clues, older kids get riddles.',
    videoType: 'direct',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    storagePath: null,
    ageGroup: 'Kids',
    playFormat: 'Group',
    playerCount: '2–8',
    duration: '25–40 min',
    materials: 'Printed clues, a small prize or treat',
    instructionsEn:
      'Hide 6–8 clues outdoors. Pair younger players with older ones. The final clue leads to a shared prize everyone enjoys together.',
    instructionsKn:
      'ಹೊರಗೆ ೬–೮ ಸುಳಿವುಗಳನ್ನು ಅಡಗಿಸಿ. ಚಿಕ್ಕವರನ್ನು ದೊಡ್ಡವರೊಂದಿಗೆ ಜೋಡಿ ಮಾಡಿ. ಕೊನೆಯ ಸುಳಿವು ಎಲ್ಲರೂ ಹಂಚಿಕೊಳ್ಳುವ ಬಹುಮಾನಕ್ಕೆ ಕರೆದೊಯ್ಯುತ್ತದೆ.',
    visitorId: 'seed',
    likeCount: 15,
    createdAt: new Date(now - 4 * day).toISOString(),
    updatedAt: new Date(now - 4 * day).toISOString(),
  },
  {
    id: '55555555-5555-4555-8555-555555555555',
    title: 'Memory Match Marathon',
    description:
      'Giant memory with handmade cards — photos of family moments make it personal.',
    videoType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    storagePath: null,
    ageGroup: 'Kids',
    playFormat: 'Group',
    playerCount: '2–6',
    duration: '15–30 min',
    materials: 'Index cards or printed photo pairs',
    instructionsEn:
      'Lay cards face down. Take turns flipping two. Matches stay up. Optional: winner starts a new round with a house rule of their choice.',
    instructionsKn: '',
    visitorId: 'seed',
    likeCount: 9,
    createdAt: new Date(now - 5 * day).toISOString(),
    updatedAt: new Date(now - 5 * day).toISOString(),
  },
  {
    id: '66666666-6666-4666-8666-666666666666',
    title: 'Kitchen Table Spades',
    description:
      'A gentle introduction to partnership card play — perfect after dinner.',
    videoType: 'instagram',
    videoUrl: 'https://www.instagram.com/reel/C9placeholder/',
    storagePath: null,
    ageGroup: 'Adults',
    playFormat: 'Group',
    playerCount: '4',
    duration: '30–60 min',
    materials: 'Standard deck of cards',
    instructionsEn:
      'Teach bidding with open hands for the first round. Keep scoring light. Rotate partners every two hands so nobody sits out the fun.',
    instructionsKn: '',
    visitorId: 'seed',
    likeCount: 7,
    createdAt: new Date(now - 6 * day).toISOString(),
    updatedAt: new Date(now - 6 * day).toISOString(),
  },
  {
    id: '77777777-7777-4777-8777-777777777777',
    title: 'Blanket Fort Cinema',
    description:
      'Build a fort, pick a short film, and invent intermission games between scenes.',
    videoType: 'direct',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    storagePath: null,
    ageGroup: 'All ages',
    playFormat: 'Group',
    playerCount: '2–6',
    duration: '45–90 min',
    materials: 'Blankets, cushions, string lights, a device to play video',
    instructionsEn:
      'Construct the fort together. Agree on two intermission challenges before pressing play. Lights out only after snacks are set.',
    instructionsKn: '',
    visitorId: 'seed',
    likeCount: 21,
    createdAt: new Date(now - 0.5 * day).toISOString(),
    updatedAt: new Date(now - 0.5 * day).toISOString(),
  },
  {
    id: '88888888-8888-4888-8888-888888888888',
    title: 'Quiet Crossword Hour',
    description:
      'A calm solo or side-by-side puzzle session — great for seniors and anyone who wants a slower pace.',
    videoType: null,
    videoUrl: null,
    storagePath: null,
    ageGroup: 'Seniors',
    playFormat: 'Individual',
    playerCount: '1–2',
    duration: '20–45 min',
    materials: 'Crossword book or app, pencils',
    instructionsEn:
      'Pick a puzzle at a comfortable difficulty. Set a gentle timer if you like, or go untimed. Compare answers together at the end if playing side by side.',
    instructionsKn: '',
    visitorId: 'seed',
    likeCount: 13,
    createdAt: new Date(now - 7 * day).toISOString(),
    updatedAt: new Date(now - 7 * day).toISOString(),
  },
]

const LIKES_KEY = 'family-games-mock-likes'
const GAMES_KEY = 'family-games-mock-extra-v2'

type LikeMap = Record<string, string[]>

function readLikes(): LikeMap {
  try {
    const raw = localStorage.getItem(LIKES_KEY)
    return raw ? (JSON.parse(raw) as LikeMap) : {}
  } catch {
    return {}
  }
}

function writeLikes(map: LikeMap) {
  localStorage.setItem(LIKES_KEY, JSON.stringify(map))
}

function readExtraGames(): Game[] {
  try {
    const raw = localStorage.getItem(GAMES_KEY)
    return raw ? (JSON.parse(raw) as Game[]) : []
  } catch {
    return []
  }
}

function writeExtraGames(games: Game[]) {
  localStorage.setItem(GAMES_KEY, JSON.stringify(games))
}

function withLikeCounts(games: Game[]): Game[] {
  const likes = readLikes()
  return games.map((game) => {
    const visitorLikes = likes[game.id] ?? []
    const seedBonus = MOCK_GAMES.find((g) => g.id === game.id)?.likeCount ?? 0
    const extra = visitorLikes.length
    const likeCount =
      game.visitorId === 'seed' || MOCK_GAMES.some((g) => g.id === game.id)
        ? seedBonus + extra
        : extra
    return { ...game, likeCount }
  })
}

export function getAllMockGames(): Game[] {
  const extras = readExtraGames()
  const extraIds = new Set(extras.map((game) => game.id))
  const seeds = MOCK_GAMES.filter((game) => !extraIds.has(game.id))
  return withLikeCounts([...extras, ...seeds])
}

export function getMockGameById(id: string): Game | null {
  return getAllMockGames().find((g) => g.id === id) ?? null
}

export function addMockGame(
  input: Omit<Game, 'id' | 'likeCount' | 'createdAt' | 'updatedAt'>,
): Game {
  const nowIso = new Date().toISOString()
  const game: Game = {
    ...input,
    id: crypto.randomUUID(),
    likeCount: 0,
    createdAt: nowIso,
    updatedAt: nowIso,
  }
  const extras = readExtraGames()
  writeExtraGames([game, ...extras])
  return game
}

export function updateMockGame(
  id: string,
  input: Omit<Game, 'id' | 'likeCount' | 'createdAt' | 'updatedAt'>,
): Game | null {
  const existing = getMockGameById(id)
  if (!existing) return null
  const updated: Game = {
    ...existing,
    ...input,
    id,
    likeCount: existing.likeCount,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  }
  const extras = readExtraGames().filter((game) => game.id !== id)
  writeExtraGames([updated, ...extras])
  return getMockGameById(id)
}

export function visitorHasLikedMock(gameId: string, visitorId: string): boolean {
  const likes = readLikes()
  return (likes[gameId] ?? []).includes(visitorId)
}

export function getLikedGameIdsMock(visitorId: string): string[] {
  const likes = readLikes()
  return Object.entries(likes)
    .filter(([, visitors]) => visitors.includes(visitorId))
    .map(([gameId]) => gameId)
}

export function toggleMockLike(
  gameId: string,
  visitorId: string,
): { liked: boolean; likeCount: number } {
  const likes = readLikes()
  const current = new Set(likes[gameId] ?? [])
  let liked: boolean
  if (current.has(visitorId)) {
    current.delete(visitorId)
    liked = false
  } else {
    current.add(visitorId)
    liked = true
  }
  likes[gameId] = [...current]
  writeLikes(likes)
  const game = getMockGameById(gameId)
  return { liked, likeCount: game?.likeCount ?? current.size }
}
