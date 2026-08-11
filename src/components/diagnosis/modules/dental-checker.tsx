'use client'

import { CameraModule } from './camera-module'

export function DentalChecker() {
  return (
    <CameraModule
      moduleId="dental"
      moduleName="Dental & Oral"
      apiPath="/api/diagnose/dental"
      title="Dental & Oral Health"
      instructions="Open your mouth wide and position teeth, gums, and tongue in good lighting. Pull back lips to expose teeth."
      facingMode="environment"
      aspectRatio="square"
      accentColor="text-orange-600"
      accentBorder="border-orange-200"
      accentBg="bg-orange-50/50 dark:bg-orange-950/20"
      analyzingText="AI is examining your oral health…"
      analyzingSubtext="Checking teeth, gums, tongue, and oral hygiene"
    />
  )
}
