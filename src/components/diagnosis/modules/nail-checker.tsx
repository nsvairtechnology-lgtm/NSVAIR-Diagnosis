'use client'

import { CameraModule } from './camera-module'

export function NailChecker() {
  return (
    <CameraModule
      moduleId="nail"
      moduleName="Nail Health"
      apiPath="/api/diagnose/nail"
      title="Nail Health Check"
      instructions="Place your hand flat with fingers spread, nails facing the camera. Ensure good, natural lighting."
      facingMode="environment"
      aspectRatio="square"
      accentColor="text-fuchsia-600"
      accentBorder="border-fuchsia-200"
      accentBg="bg-fuchsia-50/50 dark:bg-fuchsia-950/20"
      analyzingText="AI is analyzing your nails…"
      analyzingSubtext="Detecting color, ridges, clubbing, and deficiency signs"
    />
  )
}
