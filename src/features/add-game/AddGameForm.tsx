import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link2, Upload, Ban } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AGE_GROUPS, PLAY_FORMATS, type Game } from '@/types/game'
import { createGame, updateGame, usingRemoteData } from '@/lib/gamesApi'
import { uploadGameVideo } from '@/lib/supabase/storage'
import { parseVideoUrl } from '@/lib/video/parseVideoUrl'
import { useVisitorId } from '@/hooks/useVisitorId'
import { cn } from '@/lib/utils'
import {
  gameToFormValues,
  initialAddGameValues,
  resolveVideoFields,
  validateAddGameForm,
  type AddGameFormErrors,
  type AddGameFormValues,
  type VideoMode,
} from './validation'

interface AddGameFormProps {
  mode?: 'create' | 'edit'
  initialGame?: Game
}

export function AddGameForm({
  mode = 'create',
  initialGame,
}: AddGameFormProps) {
  const navigate = useNavigate()
  const visitorId = useVisitorId()
  const isEdit = mode === 'edit' && Boolean(initialGame)

  const [values, setValues] = useState<AddGameFormValues>(() =>
    initialGame ? gameToFormValues(initialGame) : initialAddGameValues,
  )
  const [errors, setErrors] = useState<AddGameFormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [formError, setFormError] = useState<string | null>(null)

  const hasExistingUpload =
    initialGame?.videoType === 'upload' &&
    Boolean(initialGame.videoUrl || initialGame.storagePath)

  const urlPreview = useMemo(() => {
    if (values.videoMode !== 'url' || !values.videoUrl.trim()) return null
    return parseVideoUrl(values.videoUrl)
  }, [values.videoMode, values.videoUrl])

  function update<K extends keyof AddGameFormValues>(
    key: K,
    value: AddGameFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  function setMode(nextMode: VideoMode) {
    setValues((prev) => ({
      ...prev,
      videoMode: nextMode,
      videoUrl:
        nextMode === 'url'
          ? prev.videoUrl ||
            (initialGame?.videoType !== 'upload'
              ? (initialGame?.videoUrl ?? '')
              : '')
          : '',
      file: nextMode === 'upload' ? prev.file : null,
    }))
    setUploadProgress(0)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)
    const nextErrors = validateAddGameForm(values, {
      allowExistingUpload:
        isEdit && hasExistingUpload && values.videoMode === 'upload',
    })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      let { videoType, videoUrl, storagePath } = resolveVideoFields(values)

      if (values.videoMode === 'upload' && values.file) {
        if (!usingRemoteData()) {
          videoType = 'upload'
          videoUrl = URL.createObjectURL(values.file)
          storagePath = values.file.name
          setUploadProgress(100)
        } else {
          const uploaded = await uploadGameVideo(
            values.file,
            visitorId || 'anonymous',
            setUploadProgress,
          )
          videoType = 'upload'
          videoUrl = uploaded.publicUrl
          storagePath = uploaded.path
        }
      } else if (
        values.videoMode === 'upload' &&
        !values.file &&
        hasExistingUpload &&
        initialGame
      ) {
        videoType = 'upload'
        videoUrl = initialGame.videoUrl
        storagePath = initialGame.storagePath
      }

      const payload = {
        title: values.title.trim(),
        description: values.description.trim(),
        ageGroup: values.ageGroup as (typeof AGE_GROUPS)[number],
        playFormat: values.playFormat as (typeof PLAY_FORMATS)[number],
        playerCount: values.playerCount.trim(),
        duration: values.duration.trim(),
        materials: values.materials.trim(),
        instructionsEn: values.instructionsEn.trim(),
        instructionsKn: values.instructionsKn.trim(),
        videoType,
        videoUrl,
        storagePath,
        visitorId: isEdit
          ? initialGame?.visitorId || visitorId || 'anonymous'
          : visitorId || 'anonymous',
      }

      const game =
        isEdit && initialGame
          ? await updateGame(initialGame.id, payload, initialGame.likeCount)
          : await createGame(payload)

      navigate(`/games/${game.id}`)
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : 'Something went wrong saving the game.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const cancelTo = isEdit && initialGame ? `/games/${initialGame.id}` : '/'

  return (
    <form onSubmit={handleSubmit} className="space-y-10" noValidate>
      <section className="space-y-5">
        <div>
          <h2 className="font-display text-2xl font-semibold">The game</h2>
          <p className="mt-1 text-sm text-muted">
            Title, who it’s for, and what you need — the essentials first.
          </p>
        </div>

        <Field label="Title" htmlFor="title" error={errors.title}>
          <Input
            id="title"
            value={values.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="e.g. Living Room Olympics"
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Age group" htmlFor="ageGroup" error={errors.ageGroup}>
            <Select
              value={values.ageGroup || undefined}
              onValueChange={(value) =>
                update('ageGroup', value as AddGameFormValues['ageGroup'])
              }
            >
              <SelectTrigger id="ageGroup">
                <SelectValue placeholder="Select age group" />
              </SelectTrigger>
              <SelectContent>
                {AGE_GROUPS.map((ageGroup) => (
                  <SelectItem key={ageGroup} value={ageGroup}>
                    {ageGroup}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field
            label="Play format"
            htmlFor="playFormat"
            error={errors.playFormat}
          >
            <Select
              value={values.playFormat || undefined}
              onValueChange={(value) =>
                update('playFormat', value as AddGameFormValues['playFormat'])
              }
            >
              <SelectTrigger id="playFormat">
                <SelectValue placeholder="Individual or Group" />
              </SelectTrigger>
              <SelectContent>
                {PLAY_FORMATS.map((format) => (
                  <SelectItem key={format} value={format}>
                    {format}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field label="Materials" htmlFor="materials" error={errors.materials}>
          <Input
            id="materials"
            value={values.materials}
            onChange={(e) => update('materials', e.target.value)}
            placeholder="e.g. Cards, timer, pillows — or None"
          />
        </Field>

        <Field
          label="Description (optional)"
          htmlFor="description"
          error={errors.description}
        >
          <Textarea
            id="description"
            value={values.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="What makes this one worth playing?"
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Players (optional)"
            htmlFor="playerCount"
            error={errors.playerCount}
          >
            <Input
              id="playerCount"
              value={values.playerCount}
              onChange={(e) => update('playerCount', e.target.value)}
              placeholder="e.g. 2–6"
            />
          </Field>

          <Field
            label="Duration (optional)"
            htmlFor="duration"
            error={errors.duration}
          >
            <Input
              id="duration"
              value={values.duration}
              onChange={(e) => update('duration', e.target.value)}
              placeholder="e.g. 20–30 min"
            />
          </Field>
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="font-display text-2xl font-semibold">How to play</h2>
          <p className="mt-1 text-sm text-muted">
            English and Kannada rules are optional — add either, both, or leave
            blank for now.
          </p>
        </div>

        <Field
          label="Rules — English (optional)"
          htmlFor="instructionsEn"
          error={errors.instructionsEn}
        >
          <Textarea
            id="instructionsEn"
            value={values.instructionsEn}
            onChange={(e) => update('instructionsEn', e.target.value)}
            placeholder="Clear steps so someone else can run the game."
            className="min-h-[140px]"
          />
        </Field>

        <Field
          label="Rules — Kannada (optional)"
          htmlFor="instructionsKn"
          error={errors.instructionsKn}
        >
          <Textarea
            id="instructionsKn"
            value={values.instructionsKn}
            onChange={(e) => update('instructionsKn', e.target.value)}
            placeholder="ಆಟದ ನಿಯಮಗಳನ್ನು ಕನ್ನಡದಲ್ಲಿ ಬರೆಯಿರಿ"
            className="min-h-[140px]"
            lang="kn"
          />
        </Field>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="font-display text-2xl font-semibold">Video</h2>
          <p className="mt-1 text-sm text-muted">
            Optional. Add a link or upload when you have a preview clip.
          </p>
        </div>

        <div className="inline-flex flex-wrap rounded-md border border-line bg-surface p-1">
          <ModeButton
            active={values.videoMode === 'none'}
            onClick={() => setMode('none')}
            icon={<Ban className="h-4 w-4" />}
            label="None"
          />
          <ModeButton
            active={values.videoMode === 'url'}
            onClick={() => setMode('url')}
            icon={<Link2 className="h-4 w-4" />}
            label="Video URL"
          />
          <ModeButton
            active={values.videoMode === 'upload'}
            onClick={() => setMode('upload')}
            icon={<Upload className="h-4 w-4" />}
            label="Upload file"
          />
        </div>

        {values.videoMode === 'url' ? (
          <div className="space-y-3">
            <Field
              label="Video URL"
              htmlFor="videoUrl"
              error={errors.videoUrl}
            >
              <Input
                id="videoUrl"
                value={values.videoUrl}
                onChange={(e) => update('videoUrl', e.target.value)}
                placeholder="YouTube, Instagram Reel, or direct .mp4 link"
              />
            </Field>
            {urlPreview?.supported ? (
              <p className="text-sm text-accent">
                Detected: {urlPreview.type}
                {urlPreview.message ? ` — ${urlPreview.message}` : ''}
              </p>
            ) : null}
            {urlPreview && !urlPreview.supported && values.videoUrl.trim() ? (
              <p className="text-sm text-like">{urlPreview.message}</p>
            ) : null}
          </div>
        ) : null}

        {values.videoMode === 'upload' ? (
          <div className="space-y-3">
            <Field label="Video file" htmlFor="file" error={errors.file}>
              <Input
                id="file"
                type="file"
                accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
                onChange={(e) => update('file', e.target.files?.[0] ?? null)}
              />
            </Field>
            <p className="text-xs text-muted">
              MP4, WebM, or MOV up to 80MB.
              {hasExistingUpload && !values.file
                ? ' Leave empty to keep the current video.'
                : null}
              {!usingRemoteData()
                ? ' Uploads stay local until Supabase is configured.'
                : null}
            </p>
            {values.file ? (
              <p className="text-sm text-ink">
                Selected: {values.file.name} (
                {(values.file.size / (1024 * 1024)).toFixed(1)} MB)
              </p>
            ) : hasExistingUpload ? (
              <p className="text-sm text-muted">Current uploaded video will be kept.</p>
            ) : null}
            {submitting && values.file ? (
              <div className="space-y-2">
                <Progress value={uploadProgress} />
                <p className="text-xs text-muted">
                  Uploading… {Math.round(uploadProgress)}%
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      {formError ? (
        <p className="rounded-md border border-like/30 bg-like/5 px-4 py-3 text-sm text-like">
          {formError}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(cancelTo)}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting
            ? 'Saving…'
            : isEdit
              ? 'Save changes'
              : 'Add to catalogue'}
        </Button>
      </div>
    </form>
  )
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? <p className="text-sm text-like">{error}</p> : null}
    </div>
  )
}

function ModeButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        active ? 'bg-ink text-paper' : 'text-muted hover:text-ink',
      )}
    >
      {icon}
      {label}
    </button>
  )
}
