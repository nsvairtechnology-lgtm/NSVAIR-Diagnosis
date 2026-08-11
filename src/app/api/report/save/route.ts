import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      userProfile,
      report,
      results,
    } = body as {
      userProfile: { name?: string; age?: string; gender?: string }
      report: {
        overallSummary: string
        overallRiskScore: number
        redFlags: string[]
        recommendations: string[]
        nextSteps: string[]
        topFindings: unknown[]
      }
      results: unknown[]
    }

    if (!report) {
      return NextResponse.json({ error: 'No report provided' }, { status: 400 })
    }

    const saved = await db.diagnosisReport.create({
      data: {
        userName: userProfile?.name || null,
        userAge: userProfile?.age || null,
        userGender: userProfile?.gender || null,
        summary: report.overallSummary,
        riskScore: report.overallRiskScore,
        redFlags: JSON.stringify(report.redFlags || []),
        recommendations: JSON.stringify(report.recommendations || []),
        nextSteps: JSON.stringify(report.nextSteps || []),
        topFindings: JSON.stringify(report.topFindings || []),
        resultsJson: JSON.stringify(results || []),
      },
    })

    return NextResponse.json({ success: true, id: saved.id })
  } catch (error) {
    console.error('Save report error:', error)
    return NextResponse.json(
      { error: 'Failed to save report' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const reports = await db.diagnosisReport.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        userName: true,
        summary: true,
        riskScore: true,
        createdAt: true,
      },
    })
    return NextResponse.json({ reports })
  } catch (error) {
    console.error('List reports error:', error)
    return NextResponse.json({ reports: [] })
  }
}
