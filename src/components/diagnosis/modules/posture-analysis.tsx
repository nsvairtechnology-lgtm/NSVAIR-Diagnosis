'use client'

import { CameraModule } from './camera-module'

export function PostureAnalysis() {
  return (
    <CameraModule
      moduleId="posture"
      moduleName="Posture Analysis"
      apiPath="/api/diagnose/posture"
      title="Posture Analysis"
      instructions="Stand naturally in a full-body side-view photo. Wear fitted clothing. Stand against a plain wall if possible."
      facingMode="environment"
      aspectRatio="portrait"
      accentColor="text-lime-600"
      accentBorder="border-lime-200"
      accentBg="bg-lime-50/50 dark:bg-lime-950/20"
      analyzingText="AI is analyzing your posture…"
      analyzingSubtext="Checking head, shoulders, spine, and pelvic alignment"
    />
  )
}
