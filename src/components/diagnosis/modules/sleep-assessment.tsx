'use client'

import { Moon } from 'lucide-react'
import { QuestionnaireModule, type QuestionnaireQ } from './questionnaire-module'

const QUESTIONS: QuestionnaireQ[] = [
  {
    id: 1,
    question: 'On average, how many hours do you sleep per night?',
    options: [
      { label: '7-9 hours', value: 0 },
      { label: '6-7 hours', value: 1 },
      { label: '5-6 hours', value: 2 },
      { label: 'Less than 5 hours', value: 3 },
    ],
  },
  {
    id: 2,
    question: 'How long does it usually take you to fall asleep?',
    options: [
      { label: 'Less than 15 minutes', value: 0 },
      { label: '15-30 minutes', value: 1 },
      { label: '30-60 minutes', value: 2 },
      { label: 'More than 60 minutes', value: 3 },
    ],
  },
  {
    id: 3,
    question: 'How often do you wake up during the night?',
    options: [
      { label: 'Rarely / never', value: 0 },
      { label: 'Once a week', value: 1 },
      { label: 'Several times a week', value: 2 },
      { label: 'Every night', value: 3 },
    ],
  },
  {
    id: 4,
    question: 'How often do you snore loudly (or has someone told you)?',
    options: [
      { label: 'Never', value: 0 },
      { label: 'Occasionally', value: 1 },
      { label: 'Frequently', value: 2 },
      { label: 'Every night', value: 3 },
    ],
  },
  {
    id: 5,
    question: 'Has anyone observed you stop breathing during sleep?',
    options: [
      { label: 'Never', value: 0 },
      { label: 'Rarely', value: 1 },
      { label: 'Sometimes', value: 2 },
      { label: 'Often', value: 3 },
    ],
  },
  {
    id: 6,
    question: 'How tired or sleepy do you feel during the day?',
    options: [
      { label: 'Not at all', value: 0 },
      { label: 'A little', value: 1 },
      { label: 'Moderately', value: 2 },
      { label: 'Very sleepy', value: 3 },
    ],
  },
  {
    id: 7,
    question: 'How often do you use screens (phone/TV) in the hour before bed?',
    options: [
      { label: 'Never', value: 0 },
      { label: 'Sometimes', value: 1 },
      { label: 'Often', value: 2 },
      { label: 'Always', value: 3 },
    ],
  },
  {
    id: 8,
    question: 'How consistent is your sleep schedule (bedtime/wake time)?',
    options: [
      { label: 'Very consistent', value: 0 },
      { label: 'Mostly consistent', value: 1 },
      { label: 'Somewhat irregular', value: 2 },
      { label: 'Very irregular', value: 3 },
    ],
  },
]

export function SleepAssessment() {
  return (
    <QuestionnaireModule
      moduleId="sleep"
      moduleName="Sleep Quality"
      icon={Moon}
      apiPath="/api/diagnose/sleep"
      questions={QUESTIONS}
      accentColor="text-blue-600"
      accentBorder="border-blue-200"
      accentBg="bg-blue-50/50 dark:bg-blue-950/20"
      iconBg="bg-blue-100 dark:bg-blue-900/40"
      analyzingText="AI is evaluating your sleep health…"
      analyzingSubtext="Screening for insomnia, apnea risk, and sleep hygiene"
    />
  )
}
