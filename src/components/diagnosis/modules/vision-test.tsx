'use client'

import * as React from 'react'
import { Loader2, Sparkles, RotateCcw, Eye, Check, X } from 'lucide-react'
import { useDiagnosisStore } from '@/lib/diagnosis-store'
import type { DiagnosisResult } from '@/lib/types'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { DiagnosisResultView } from '@/components/diagnosis/result-view'

// Ishihara-style color plates. We render SVG dots that form a number.
// A normal viewer sees the "answer"; a red-green deficient viewer sees a different/no number.
// Here we use a simplified Ishihara-inspired set with hidden numbers in colored dot fields.
interface Plate {
  id: number
  answer: string
  // Color palette: foreground (number) and background dots
  fg: string
  bg: string
  // The number type it tests
  type: string
}

const PLATES: Plate[] = [
  { id: 1, answer: '12', fg: '#8a8a3a', bg: '#c9a23a', type: 'normal (demonstration)' },
  { id: 2, answer: '8', fg: '#6a8a3a', bg: '#c9833a', type: 'red-green' },
  { id: 3, answer: '29', fg: '#3a7a8a', bg: '#a36a3a', type: 'red-green' },
  { id: 4, answer: '5', fg: '#8a4a3a', bg: '#3a8a6a', type: 'red-green' },
  { id: 5, answer: '3', fg: '#6a5a8a', bg: '#8a8a3a', type: 'red-green' },
  { id: 6, answer: '15', fg: '#3a6a8a', bg: '#c9a25a', type: 'red-green' },
]

const NUMBER_OPTIONS = ['12', '8', '29', '5', '3', '15', '7', '74', 'Nothing']

export function VisionTest() {
  const { results, setResult, setLoading, loadingModules } = useDiagnosisStore()
  const loading = loadingModules.vision
  const result = results.vision

  const [phase, setPhase] = React.useState<'intro' | 'testing' | 'sharpness' | 'done'>('intro')
  const [currentPlate, setCurrentPlate] = React.useState(0)
  const [correctCount, setCorrectCount] = React.useState(0)
  const [missedTypes, setMissedTypes] = React.useState<string[]>([])
  const [sharpness, setSharpness] = React.useState<'clear' | 'slightly-blurry' | 'blurry' | 'very-blurry'>('clear')

  const plate = PLATES[currentPlate]

  const handleAnswer = (answer: string) => {
    const isCorrect = answer === plate.answer
    if (isCorrect) {
      setCorrectCount((c) => c + 1)
    } else {
      setMissedTypes((m) => [...m, plate.type])
    }
    if (currentPlate < PLATES.length - 1) {
      setCurrentPlate((p) => p + 1)
    } else {
      setPhase('sharpness')
    }
  }

  const submit = async () => {
    setLoading('vision', true)
    const start = Date.now()
    const metrics = {
      correctPlates: correctCount,
      totalPlates: PLATES.length,
      accuracy: correctCount / PLATES.length,
      missedPlateTypes: missedTypes,
      sharpnessSelfReport: sharpness,
      screenDistance: 'self-reported',
    }
    try {
      const res = await fetch('/api/diagnose/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      const dr: DiagnosisResult = {
        moduleId: 'vision',
        moduleName: 'Vision Test',
        icon: 'Eye',
        category: 'sensors',
        summary: data.summary,
        findings: data.findings || [],
        riskLevel: data.riskLevel || 'low',
        riskScore: data.riskScore || 0,
        recommendations: data.recommendations || [],
        completedAt: new Date().toISOString(),
        duration: Date.now() - start,
        rawData: { metrics },
      }
      setResult('vision', dr)
      toast.success('Vision test complete')
    } catch (e) {
      toast.error((e as Error).message || 'Failed to analyze vision')
    } finally {
      setLoading('vision', false)
    }
  }

  if (result) {
    return (
      <div className="space-y-4">
        <DiagnosisResultView result={result} />
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => {
            setResult('vision', null as unknown as DiagnosisResult)
            setPhase('intro')
            setCurrentPlate(0)
            setCorrectCount(0)
            setMissedTypes([])
          }}
        >
          <RotateCcw className="h-3.5 w-3.5" /> Test again
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <Card className="border-indigo-200 bg-indigo-50/50 dark:bg-indigo-950/20">
        <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="font-medium text-sm flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            AI is interpreting your vision results…
          </p>
        </CardContent>
      </Card>
    )
  }

  if (phase === 'intro') {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                <Eye className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold">Color Vision Test</h3>
                <p className="text-xs text-muted-foreground">Ishihara-style screening</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p className="font-medium text-foreground">Before you begin:</p>
              <p>• Sit about 60-75cm (arm's length) from your screen</p>
              <p>• Ensure good room lighting (not too dim or glaring)</p>
              <p>• Remove tinted glasses if possible</p>
              <p>• Look at each plate and tap the number you see</p>
              <p>• Don&apos;t worry if you can&apos;t see some — that&apos;s the point of the test</p>
            </div>
            <Button
              onClick={() => setPhase('testing')}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              Start Vision Test
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (phase === 'testing') {
    const progress = ((currentPlate + 1) / PLATES.length) * 100
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Plate {currentPlate + 1} of {PLATES.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center gap-4">
            <p className="text-sm font-medium text-center">
              What number do you see in the circle below?
            </p>
            <IshiharaPlate plate={plate} />
            <div className="grid grid-cols-3 gap-2 w-full max-w-md">
              {NUMBER_OPTIONS.map((opt) => (
                <Button
                  key={opt}
                  variant="outline"
                  onClick={() => handleAnswer(opt)}
                  className="h-12"
                >
                  {opt}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (phase === 'sharpness') {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="text-center">
              <h3 className="font-semibold mb-1">Visual Sharpness Check</h3>
              <p className="text-xs text-muted-foreground">
                How clear is the text below at your current viewing distance?
              </p>
            </div>
            <div className="rounded-lg bg-muted/40 p-8 text-center space-y-3">
              <p className="text-4xl font-bold">E F P</p>
              <p className="text-2xl font-bold">T O Z</p>
              <p className="text-base font-medium">L P E D</p>
              <p className="text-xs text-muted-foreground">If you can read all lines clearly, your sharpness is good</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">How clear was the text?</p>
              <div className="grid grid-cols-2 gap-2">
                {([
                  ['clear', 'Crystal clear'],
                  ['slightly-blurry', 'Slightly blurry'],
                  ['blurry', 'Blurry'],
                  ['very-blurry', 'Very blurry'],
                ] as const).map(([val, label]) => (
                  <Button
                    key={val}
                    variant={sharpness === val ? 'default' : 'outline'}
                    onClick={() => setSharpness(val)}
                    className={sharpness === val ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
            <Button
              onClick={submit}
              className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2"
            >
              <Check className="h-4 w-4" /> Submit Results
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}

// Render an Ishihara-style plate as SVG dots forming a number
function IshiharaPlate({ plate }: { plate: Plate }) {
  // Use a fixed dot pattern that places fg-colored dots in the shape of the number
  // and bg-colored dots elsewhere. We'll use a grid of dots with a mask for the number.
  const size = 280
  const dots = 14 // dots across
  const cell = size / dots
  const dotR = cell * 0.42

  // Define number shapes on a 14x10 grid (for two-digit numbers we render side by side)
  // Using a simple bitmap for each digit 0-9 and render the plate.answer string
  const digitMaps: Record<string, string[]> = {
    '1': ['00011000', '00111100', '00011000', '00011000', '00011000', '00011000', '00011000', '00011000'],
    '2': ['01111100', '11000110', '00000110', '00001100', '00011000', '00110000', '01100000', '11111110'],
    '3': ['11111100', '00000110', '00000110', '00111100', '00000110', '00000110', '00000110', '11111100'],
    '5': ['11111110', '11000000', '11000000', '11111100', '00000110', '00000110', '11000110', '01111100'],
    '8': ['00111100', '01100110', '01100110', '00111100', '01100110', '01100110', '01100110', '00111100'],
    '9': ['00111100', '01100110', '01100110', '00111110', '00000110', '00000110', '00001100', '00111000'],
    '7': ['11111110', '00000110', '00001100', '00011000', '00110000', '00110000', '00110000', '00110000'],
    '4': ['00001100', '00011100', '00110100', '01100100', '11111110', '00000100', '00000100', '00000100'],
  }

  const answer = plate.answer
  // Build a combined bitmap: each digit is 8 wide x 8 tall. We render digits horizontally centered.
  const digits = answer.split('')
  const digitW = 8
  const digitH = 8
  const totalW = digits.length * digitW
  const offsetX = Math.floor((dots - totalW) / 2)
  const offsetY = Math.floor((dots - digitH) / 2)

  // Build the set of (x, y) cells that are "foreground" (part of the number)
  const fgCells = new Set<string>()
  digits.forEach((d, di) => {
    const map = digitMaps[d]
    if (!map) return
    for (let y = 0; y < digitH; y++) {
      for (let x = 0; x < digitW; x++) {
        if (map[y][x] === '1') {
          fgCells.add(`${x + offsetX + di * digitW},${y + offsetY}`)
        }
      }
    }
  })

  const dots_arr = []
  for (let y = 0; y < dots; y++) {
    for (let x = 0; x < dots; x++) {
      // Distance from center to keep dots within a circle
      const cx = dots / 2
      const cy = dots / 2
      const dist = Math.sqrt((x - cx + 0.5) ** 2 + (y - cy + 0.5) ** 2)
      if (dist > dots / 2 - 0.5) continue
      const isFg = fgCells.has(`${x},${y}`)
      // Slight color variation for natural look
      const baseColor = isFg ? plate.fg : plate.bg
      dots_arr.push(
        <circle
          key={`${x}-${y}`}
          cx={x * cell + cell / 2}
          cy={y * cell + cell / 2}
          r={dotR}
          fill={baseColor}
          opacity={0.95}
        />
      )
    }
  }

  return (
    <div className="rounded-full bg-white p-2 shadow-sm">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-full">
        <circle cx={size / 2} cy={size / 2} r={size / 2 - 4} fill="#f5f5f5" />
        {dots_arr}
      </svg>
    </div>
  )
}
