'use client'

import { Apple } from 'lucide-react'
import { QuestionnaireModule, type QuestionnaireQ } from './questionnaire-module'

const QUESTIONS: QuestionnaireQ[] = [
  {
    id: 1,
    question: 'How many servings of fruits and vegetables do you eat daily?',
    options: [
      { label: '5 or more', value: 0 },
      { label: '3-4 servings', value: 1 },
      { label: '1-2 servings', value: 2 },
      { label: 'None or rarely', value: 3 },
    ],
  },
  {
    id: 2,
    question: 'How many glasses of water do you drink per day?',
    options: [
      { label: '8 or more (2L+)', value: 0 },
      { label: '5-7 glasses', value: 1 },
      { label: '3-4 glasses', value: 2 },
      { label: 'Less than 3', value: 3 },
    ],
  },
  {
    id: 3,
    question: 'How often do you eat protein-rich foods (meat, fish, eggs, legumes, dairy)?',
    options: [
      { label: 'Every meal', value: 0 },
      { label: 'Once or twice a day', value: 1 },
      { label: 'A few times a week', value: 2 },
      { label: 'Rarely', value: 3 },
    ],
  },
  {
    id: 4,
    question: 'How often do you consume sugary drinks, sweets, or processed foods?',
    options: [
      { label: 'Rarely', value: 0 },
      { label: 'Occasionally', value: 1 },
      { label: 'Several times a week', value: 2 },
      { label: 'Daily', value: 3 },
    ],
  },
  {
    id: 5,
    question: 'Do you eat whole grains (brown rice, oats, whole-wheat) vs refined grains?',
    options: [
      { label: 'Mostly whole grains', value: 0 },
      { label: 'A mix of both', value: 1 },
      { label: 'Mostly refined', value: 2 },
      { label: 'Almost only refined', value: 3 },
    ],
  },
  {
    id: 6,
    question: 'How often do you skip meals?',
    options: [
      { label: 'Never', value: 0 },
      { label: 'Occasionally', value: 1 },
      { label: 'Several times a week', value: 2 },
      { label: 'Daily', value: 3 },
    ],
  },
  {
    id: 7,
    question: 'Do you have any dietary restrictions (vegan, vegetarian, no dairy, etc.)?',
    options: [
      { label: 'No, balanced omnivore', value: 0 },
      { label: 'Vegetarian (well-planned)', value: 1 },
      { label: 'Vegan', value: 2 },
      { label: 'Restrictive / many exclusions', value: 3 },
    ],
  },
  {
    id: 8,
    question: 'How would you describe your overall energy levels through the day?',
    options: [
      { label: 'Steady and good', value: 0 },
      { label: 'Mostly okay', value: 1 },
      { label: 'Often sluggish', value: 2 },
      { label: 'Frequently exhausted', value: 3 },
    ],
  },
]

export function NutritionAssessment() {
  return (
    <QuestionnaireModule
      moduleId="nutrition"
      moduleName="Nutrition Check"
      icon={Apple}
      apiPath="/api/diagnose/nutrition"
      questions={QUESTIONS}
      accentColor="text-green-600"
      accentBorder="border-green-200"
      accentBg="bg-green-50/50 dark:bg-green-950/20"
      iconBg="bg-green-100 dark:bg-green-900/40"
      analyzingText="AI is evaluating your nutrition…"
      analyzingSubtext="Screening for deficiencies and dietary patterns"
    />
  )
}
