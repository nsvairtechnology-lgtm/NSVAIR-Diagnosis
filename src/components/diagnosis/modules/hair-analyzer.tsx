'use client'

import { CameraModule } from './camera-module'

export function HairAnalyzer() {
  return (
    <CameraModule
      moduleId="hair"
      moduleName="Hair & Scalp"
      apiPath="/api/diagnose/hair"
      title="Hair & Scalp Analysis"
      instructions="Part your hair to expose the scalp, or photograph the thinning area (hairline/crown). Good lighting essential."
      facingMode="environment"
      aspectRatio="square"
      accentColor="text-yellow-600"
      accentBorder="border-yellow-200"
      accentBg="bg-yellow-50/50 dark:bg-yellow-950/20"
      analyzingText="AI is analyzing your hair & scalp…"
      analyzingSubtext="Checking density, scalp condition, and hair-loss patterns"
    />
  )
}
